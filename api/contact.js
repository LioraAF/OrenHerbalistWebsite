const { createHash } = require("node:crypto");

const EMAIL = /^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECIPIENT = "liora1018@gmail.com";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const reply = (status, body) => res.status(status).json(body);
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return reply(405, { success: false });
  }

  const origins = new Set([
    "https://orenherbalist.com",
    "https://www.orenherbalist.com",
    ...(process.env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
  ]);
  if (req.method === "POST" && !origins.has(req.headers.origin)) {
    return reply(403, { success: false });
  }

  const from = process.env.CONTACT_FROM_EMAIL || "contact@orenherbalist.com";
  if (!process.env.RESEND_API_KEY || !process.env.TURNSTILE_SITE_KEY ||
      !process.env.TURNSTILE_SECRET_KEY || !EMAIL.test(from)) {
    return reply(503, { success: false, code: "unavailable" });
  }
  if (req.method === "GET") {
    // Only the public widget key is sent to the browser.
    return reply(200, { siteKey: process.env.TURNSTILE_SITE_KEY });
  }
  if (req.headers["content-type"]?.split(";")[0].trim() !== "application/json") {
    return reply(415, { success: false });
  }

  let body;
  try {
    if (Number(req.headers["content-length"]) > 32768) return reply(413, { success: false });
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    if (Buffer.byteLength(JSON.stringify(body)) > 32768) return reply(413, { success: false });
  } catch {
    return reply(400, { success: false });
  }
  const field = (key) => typeof body[key] === "string" ? body[key].trim() : "";
  if (field("_honey")) return reply(400, { success: false });
  const name = field("name"), email = field("email"), phone = field("phone"), message = field("message");
  const requestId = field("requestId"), token = field("token");
  if (!name || name.length > 120 || /[\r\n]/.test(name) ||
      !EMAIL.test(email) || email.length > 254 || phone.length > 40 || /[\r\n]/.test(phone) ||
      !message || message.length > 5000 || !UUID.test(requestId) || !token || token.length > 2048) {
    return reply(400, { success: false, code: "invalid" });
  }

  try {
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    const verified = await verification.json();
    if (!verification.ok || verified.success !== true || verified.action !== "contact" ||
        verified.hostname !== new URL(req.headers.origin).hostname) {
      return reply(400, { success: false, code: "verification" });
    }

    const details = `שם: ${name}\nאימייל: ${email}\nטלפון: ${phone || "לא צוין"}\n\nהודעה:\n${message}`;
    const fromAddress = `אורן הרבליסט <${from}>`;
    // Separate messages keep the owner's address out of the visitor's To field.
    // Plain text prevents submitted markup from becoming email HTML.
    const emails = [
      { from: fromAddress, to: [RECIPIENT], reply_to: email,
        subject: "פנייה חדשה מאתר אורן הרבליסט", text: details },
      { from: fromAddress, to: [email], reply_to: RECIPIENT,
        subject: "עותק הפנייה שלך לאורן הרבליסט",
        text: `תודה שפנית לאורן הרבליסט. נחזור אליך בהקדם.\n\nזהו עותק הפרטים ששלחת דרך טופס יצירת הקשר:\n\n${details}` },
    ];
    // Retrying the same enquiry within Resend's 24-hour window avoids duplicates.
    const key = createHash("sha256").update(JSON.stringify([requestId, emails])).digest("hex");
    const sent = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact-${key}`,
      },
      body: JSON.stringify(emails),
      signal: AbortSignal.timeout(10000),
    });
    const result = await sent.json();
    if (!sent.ok || !Array.isArray(result.data) || result.data.length !== 2 ||
        !result.data.every((entry) => typeof entry.id === "string" && entry.id)) {
      return reply(502, { success: false, code: "send_failed" });
    }
    // Provider acceptance is confirmed here; inbox delivery must be checked live.
    return reply(200, { success: true });
  } catch {
    // Do not expose provider responses, keys, or visitor data in logs/errors.
    return reply(502, { success: false, code: "send_failed" });
  }
};
