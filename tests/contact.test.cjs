const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/contact.js");
const keys = ["RESEND_API_KEY", "TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "CONTACT_FROM_EMAIL", "CONTACT_ALLOWED_ORIGINS"];
let saved, originalFetch, calls, verification, sendResult, sendStatus;
const valid = () => ({ name: "בדיקה", email: "visitor@example.com", phone: "0541234567",
  message: "שלום\n<script>plain text</script>", requestId: "d834b236-f73a-43a9-a7fb-47378aecddf1", token: "verified-token", _honey: "" });
const upstream = (body, status = 200) => ({ ok: status < 300, json: async () => body });

beforeEach(() => {
  saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = "test-private-key";
  process.env.TURNSTILE_SITE_KEY = "test-public-key";
  process.env.TURNSTILE_SECRET_KEY = "test-verification-secret";
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_ALLOWED_ORIGINS;
  originalFetch = global.fetch;
  calls = [];
  verification = { success: true, hostname: "orenherbalist.com", action: "contact" };
  sendResult = { data: [{ id: "owner-id" }, { id: "visitor-id" }] };
  sendStatus = 200;
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.includes("siteverify")) return upstream(verification);
    assert.equal(url, "https://api.resend.com/emails/batch");
    return upstream(sendResult, sendStatus);
  };
});
afterEach(() => {
  global.fetch = originalFetch;
  keys.forEach((key) => saved[key] === undefined ? delete process.env[key] : process.env[key] = saved[key]);
});
async function invoke(body = valid(), headers = {}, method = "POST") {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(v) { this.code = v; return this; }, json(v) { this.body = v; return this; } };
  await handler({ method, headers: { origin: "https://orenherbalist.com", "content-type": "application/json", ...headers }, body }, res);
  return res;
}

test("configuration exposes only the public widget key and never caches", async () => {
  const res = await invoke(undefined, {}, "GET");
  assert.equal(res.code, 200);
  assert.deepEqual(res.body, { siteKey: "test-public-key" });
  assert.equal(res.headers["Cache-Control"], "no-store");
  assert.equal(calls.length, 0);
});
test("missing secrets fail closed", async () => {
  delete process.env.RESEND_API_KEY;
  assert.equal((await invoke()).code, 503);
  assert.equal((await invoke(undefined, {}, "GET")).code, 503);
  assert.equal(calls.length, 0);
});
test("rejects other origins, unsupported methods, and non-JSON requests", async () => {
  assert.equal((await invoke(valid(), { origin: "https://attacker.test" })).code, 403);
  assert.equal((await invoke(valid(), { origin: undefined })).code, 403);
  assert.equal((await invoke(valid(), {}, "DELETE")).code, 405);
  assert.equal((await invoke(valid(), { "content-type": "text/plain" })).code, 415);
  assert.equal(calls.length, 0);
});
test("rejects malformed, oversized, blank, injected, and bot submissions", async () => {
  for (const body of ["{broken", null, [], { ...valid(), name: "   " },
    { ...valid(), email: "bad\r\nBcc:evil@example.com" }, { ...valid(), name: "X\nY" },
    { ...valid(), email: "a@example.com,b@example.com" }, { ...valid(), message: "x".repeat(5001) },
    { ...valid(), _honey: "bot" }, { ...valid(), token: "" }, { ...valid(), requestId: "invalid" }]) {
    assert.equal((await invoke(body)).code, 400);
  }
  assert.equal((await invoke({ ...valid(), extra: "x".repeat(33000) })).code, 413);
  assert.equal(calls.length, 0);
});
test("validates verification success, hostname, and action before sending", async () => {
  for (const value of [ { success: false }, { success: "true" },
    { success: true, hostname: "attacker.test", action: "contact" },
    { success: true, hostname: "orenherbalist.com", action: "other" }]) {
    verification = value;
    assert.equal((await invoke()).body.code, "verification");
  }
  assert.ok(calls.every((call) => call.url.includes("siteverify")));
});
test("sends two private messages with exact visitor copy and correct reply addresses", async () => {
  const body = { ...valid(), to: "attacker@example.com", _cc: "attacker@example.com" };
  assert.equal((await invoke(body)).body.success, true);
  assert.equal(calls.length, 2);
  const emails = JSON.parse(calls[1].options.body);
  assert.equal(emails.length, 2);
  assert.deepEqual(emails[0].to, ["liora1018@gmail.com"]);
  assert.deepEqual(emails[1].to, ["visitor@example.com"]);
  assert.equal(emails[0].reply_to, body.email);
  assert.equal(emails[1].reply_to, "liora1018@gmail.com");
  assert.ok(emails.every((email) => email.from.includes("contact@orenherbalist.com")));
  assert.ok(emails[1].text.endsWith(emails[0].text));
  assert.ok(emails[0].text.includes(body.message));
  assert.ok(emails.every((email) => !email.html && !email.cc));
  assert.equal(calls[1].options.headers.Authorization, "Bearer test-private-key");
});
test("retries retain the Resend idempotency key; changed enquiries receive a new key", async () => {
  await invoke();
  const first = calls[1].options.headers["Idempotency-Key"];
  await invoke();
  assert.equal(calls[3].options.headers["Idempotency-Key"], first);
  await invoke({ ...valid(), message: "Changed enquiry" });
  assert.notEqual(calls[5].options.headers["Idempotency-Key"], first);
});
test("provider rejection and incomplete batches never report success", async () => {
  for (const value of [{}, { data: [{ id: "one" }] }, { data: [{ id: "one" }, {}] }]) {
    sendResult = value;
    assert.equal((await invoke()).code, 502);
  }
  sendStatus = 429;
  assert.equal((await invoke()).code, 502);
});
test("network errors and timeouts return a generic failure without exposing secrets", async () => {
  global.fetch = async () => { throw new Error("test-private-key: timeout"); };
  const res = await invoke();
  assert.equal(res.code, 502);
  assert.deepEqual(res.body, { success: false, code: "send_failed" });
});
