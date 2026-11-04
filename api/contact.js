const { createHash } = require("node:crypto");

const EMAIL = /^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECIPIENT = "liora1018@gmail.com";

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

function brandedEmail(title, text) {
  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f5f1e8;color:#33392a;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1e8;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" dir="rtl" style="max-width:600px;background-color:#fffdf7;text-align:right;">
<tr><td style="padding:28px 24px 12px;"><h1 style="margin:0;font-size:22px;line-height:1.5;color:#39472d;">${escapeHtml(title)}</h1></td></tr>
<tr><td style="padding:12px 24px 28px;font-size:16px;line-height:1.8;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(text).replace(/\r?\n/g, "<br>")}</td></tr>
<tr><td align="center" style="padding:24px;background-color:#eee7d8;border-top:1px solid #d8d1c0;">
<a href="https://www.orenherbalist.com/" style="text-decoration:none;"><img src="https://www.orenherbalist.com/images/Logo%20_full.png" width="200" height="112" alt="אמת מארץ תצמח — אורן הרבליסט" style="display:block;width:200px;max-width:100%;height:auto;border:0;"></a>
<p style="margin:12px 0 0;font-size:14px;color:#39472d;">אורן עמנואל שושנה | הרבליסט קליני</p>
</td></tr></table></td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const reply = (status, body) => {
    if (req.method === "POST" && status >= 400) {
      console.warn("contact_failed", { status, code: body.code || "request_rejected" });
    }
    return res.status(status).json(body);
  };
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

  let stage = "verification";
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
      const knownErrors = new Set(["missing-input-secret", "invalid-input-secret", "missing-input-response",
        "invalid-input-response", "bad-request", "timeout-or-duplicate", "internal-error"]);
      console.warn("contact_verification_failed", {
        httpStatus: verification.status,
        errors: Array.isArray(verified["error-codes"])
          ? verified["error-codes"].filter((code) => knownErrors.has(code)) : [],
        hostnameMatches: verified.hostname === new URL(req.headers.origin).hostname,
        actionMatches: verified.action === "contact",
      });
      return reply(400, { success: false, code: "verification" });
    }

    const details = `שם: ${name}\nאימייל: ${email}\nטלפון: ${phone || "לא צוין"}\n\nהודעה:\n${message}`;
    const confirmation = `תודה שפנית לאורן הרבליסט. נחזור אליך בהקדם.\n\nזהו עותק הפרטים ששלחת דרך טופס יצירת הקשר:\n\n${details}`;
    const fromAddress = `אורן הרבליסט <${from}>`;
    // Separate messages keep the owner's address out of the visitor's To field.
    // Escape submitted text in HTML and retain a plain-text alternative.
    const emails = [
      { from: fromAddress, to: [RECIPIENT], reply_to: email,
        subject: "פנייה חדשה מאתר אורן הרבליסט", text: details,
        html: brandedEmail("פנייה חדשה מאתר אורן הרבליסט", details) },
      { from: fromAddress, to: [email], reply_to: RECIPIENT,
        subject: "עותק הפנייה שלך לאורן הרבליסט",
        text: confirmation, html: brandedEmail("תודה על הפנייה לאורן הרבליסט", confirmation) },
    ];
    // Retrying the same enquiry within Resend's 24-hour window avoids duplicates.
    const key = createHash("sha256").update(JSON.stringify([requestId, emails])).digest("hex");
    stage = "sending";
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
      const knownErrors = new Set(["validation_error", "missing_api_key", "restricted_api_key",
        "invalid_permission", "suspended_api_key", "daily_quota_exceeded", "monthly_quota_exceeded",
        "rate_limit_exceeded", "application_error", "service_unavailable", "invalid_idempotent_request"]);
      console.warn("contact_send_failed", {
        httpStatus: sent.status,
        providerCode: knownErrors.has(result.name) ? result.name : "unexpected_response",
      });
      return reply(502, { success: false, code: "send_failed" });
    }
    // Provider acceptance is confirmed here; inbox delivery must be checked live.
    return reply(200, { success: true });
  } catch (error) {
    // Log only fixed stage/type values, never provider messages or visitor data.
    console.warn("contact_upstream_failed", {
      stage,
      type: ["TimeoutError", "AbortError", "TypeError", "SyntaxError"].includes(error?.name)
        ? error.name : "Error",
    });
    return reply(502, { success: false, code: stage === "verification" ? "verification_unavailable" : "send_failed" });
  }
};
