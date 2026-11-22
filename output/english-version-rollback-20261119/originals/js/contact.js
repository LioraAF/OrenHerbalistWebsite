(() => {
  const form = document.querySelector("[data-email-form]");
  if (!(form instanceof HTMLFormElement)) return;
  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector('button[type="submit"]');
  const defaultButtonText = button.textContent;
  let sending = false;
  let token = "";
  let widget;
  let requestId = null;
  const unavailable = "השליחה דרך הטופס אינה זמינה כרגע. אפשר לנסות שוב מאוחר יותר או לפנות דרך כפתור הוואטסאפ.";
  const setStatus = (message) => { status.textContent = message; };
  const updateButton = () => { button.disabled = sending || !token; };
  const resetVerification = () => {
    token = "";
    if (widget !== undefined) window.turnstile.reset(widget);
    updateButton();
  };

  form.querySelectorAll("[required]").forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
  });
  form.addEventListener("input", () => { requestId = null; });

  async function initialize() {
    try {
      const response = await fetch(form.action, { signal: AbortSignal.timeout(8000) });
      const config = await response.json();
      if (!response.ok || typeof config.siteKey !== "string" || !config.siteKey) throw new Error();
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const timer = window.setTimeout(() => reject(new Error()), 15000);
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.onload = () => { window.clearTimeout(timer); resolve(); };
        script.onerror = () => { window.clearTimeout(timer); reject(new Error()); };
        document.head.append(script);
      });
      widget = window.turnstile.render(form.querySelector("[data-contact-verification]"), {
        sitekey: config.siteKey,
        action: "contact",
        language: "he",
        size: window.innerWidth < 360 ? "compact" : "flexible",
        callback: (value) => { token = value; updateButton(); },
        "expired-callback": () => {
          token = "";
          updateButton();
          setStatus("האימות פג. יש להשלים אותו שוב לפני השליחה.");
        },
        "error-callback": () => {
          token = "";
          updateButton();
          setStatus(unavailable);
        },
      });
    } catch {
      setStatus(unavailable);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    form.querySelectorAll("[required]").forEach((field) => {
      field.setCustomValidity(field.value.trim() ? "" : "נא למלא את השדה.");
    });
    if (!form.reportValidity()) return;
    if (form.elements.namedItem("_honey").value) return;
    if (!token) {
      setStatus("יש להשלים את האימות לפני השליחה.");
      return;
    }

    sending = true;
    updateButton();
    button.textContent = "שולח...";
    form.setAttribute("aria-busy", "true");
    setStatus("שולח את הפנייה ואת העותק לאימייל שלך...");
    // Keep this ID on a retry, so an uncertain response cannot duplicate emails.
    requestId ||= crypto.randomUUID();
    const payload = { requestId, token };
    ["name", "phone", "email", "message", "_honey"].forEach((name) => {
      payload[name] = form.elements.namedItem(name).value.trim();
    });
    // Prevent edits from being erased while this particular enquiry is sending.
    const fields = [...form.querySelectorAll("input, textarea")];
    fields.forEach((field) => { field.readOnly = true; });
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        if (["verification", "verification_unavailable"].includes(result.code)) {
          setStatus("לא ניתן היה לאשר את האימות. הפרטים נשמרו בטופס. יש להשלים את האימות מחדש ולנסות שוב.");
          return;
        }
        throw new Error();
      }
      form.reset();
      requestId = null;
      setStatus("תודה, הפנייה נשלחה ונחזור אליך בהקדם. עותק נשלח גם לכתובת האימייל שלך. אם לא הגיע, כדאי לבדוק בתיקיית הספאם.");
    } catch {
      setStatus("לא התקבל אישור שהפנייה נשלחה. הפרטים נשמרו בטופס. אפשר לנסות שוב לאחר אימות נוסף או לפנות דרך כפתור הוואטסאפ.");
    } finally {
      sending = false;
      form.removeAttribute("aria-busy");
      fields.forEach((field) => { field.readOnly = false; });
      button.textContent = defaultButtonText;
      resetVerification();
    }
  });

  // A token restored from the browser's back cache may have expired or been used.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !sending) resetVerification();
  });
  initialize();
})();
