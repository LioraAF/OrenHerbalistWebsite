(() => {
  const storageKey = "oren-site-feedback-v2";
  const page = window.location.pathname.split("/").pop() || "index.html";
  let notes = loadNotes();
  let selectedElement = null;
  let editingId = null;
  let selecting = false;

  const launcher = document.createElement("button");
  launcher.className = "feedback-launcher";
  launcher.type = "button";
  launcher.dataset.feedbackUi = "true";
  launcher.textContent = `הערות (${notes.length})`;

  const panel = document.createElement("aside");
  panel.className = "feedback-panel";
  panel.dataset.feedbackUi = "true";
  panel.setAttribute("aria-label", "הערות באתר");
  panel.innerHTML = `
    <div class="feedback-panel-header">
      <h2>הערות באתר</h2>
      <button class="feedback-close" type="button" aria-label="סגירה">×</button>
    </div>
    <div class="feedback-actions">
      <button class="feedback-button feedback-button-primary" type="button" data-feedback-select>הוספת הערה</button>
      <button class="feedback-button" type="button" data-feedback-export>ייצוא JSON</button>
      <button class="feedback-button" type="button" data-feedback-exit>יציאה ממצב הערות</button>
    </div>
    <form class="feedback-form" data-feedback-form hidden>
      <h3 data-feedback-form-title>הערה חדשה</h3>
      <p class="feedback-target-summary" data-feedback-target></p>
      <label class="feedback-field">
        סוג השינוי
        <select name="changeType">
          <option value="text">שינוי מלל</option>
          <option value="design">שינוי עיצוב</option>
          <option value="freeform">שינוי חופשי</option>
        </select>
      </label>
      <label class="feedback-field">
        מלל חלופי
        <textarea name="replacementText" placeholder="מה תרצו שיופיע במקום?"></textarea>
      </label>
      <label class="feedback-field">
        הערה
        <textarea name="note" placeholder="תארו את השינוי המבוקש"></textarea>
      </label>
      <div class="feedback-form-actions">
        <button class="feedback-button feedback-button-primary" type="submit">שמירה</button>
        <button class="feedback-button" type="button" data-feedback-cancel>ביטול</button>
      </div>
    </form>
    <div class="feedback-notes" data-feedback-notes></div>
  `;

  const toast = document.createElement("div");
  toast.className = "feedback-toast";
  toast.dataset.feedbackUi = "true";

  document.body.append(launcher, panel, toast);

  const form = panel.querySelector("[data-feedback-form]");
  const notesContainer = panel.querySelector("[data-feedback-notes]");
  const targetSummary = panel.querySelector("[data-feedback-target]");
  const formTitle = panel.querySelector("[data-feedback-form-title]");

  launcher.addEventListener("click", () => panel.classList.add("is-open"));
  panel.querySelector(".feedback-close").addEventListener("click", () => panel.classList.remove("is-open"));
  panel.querySelector("[data-feedback-select]").addEventListener("click", startSelecting);
  panel.querySelector("[data-feedback-export]").addEventListener("click", exportNotes);
  panel.querySelector("[data-feedback-exit]").addEventListener("click", exitFeedbackMode);
  panel.querySelector("[data-feedback-cancel]").addEventListener("click", closeForm);
  form.addEventListener("submit", saveNote);
  notesContainer.addEventListener("click", handleNoteAction);
  document.addEventListener("click", selectTarget, true);

  enableFeedbackNavigation();
  renderNotes();

  function loadNotes() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function persistNotes() {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
    launcher.textContent = `הערות (${notes.length})`;
  }

  function startSelecting() {
    selecting = true;
    panel.classList.remove("is-open");
    document.body.classList.add("feedback-selecting");
    showToast("בחרו את האזור שעליו תרצו להעיר");
  }

  function selectTarget(event) {
    if (!selecting || !(event.target instanceof Element) || event.target.closest("[data-feedback-ui]")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selecting = false;
    document.body.classList.remove("feedback-selecting");
    selectedElement?.classList.remove("feedback-target-picked");
    selectedElement = event.target;
    selectedElement.classList.add("feedback-target-picked");
    editingId = null;
    openForm();
  }

  function openForm(note = null) {
    form.reset();
    form.hidden = false;
    formTitle.textContent = note ? "עריכת הערה" : "הערה חדשה";

    if (note) {
      form.elements.changeType.value = note.changeType;
      form.elements.replacementText.value = note.replacementText || "";
      form.elements.note.value = note.note || "";
      targetSummary.textContent = note.targetLabel || note.selector;
    } else {
      targetSummary.textContent = getTargetLabel(selectedElement);
    }

    panel.classList.add("is-open");
    form.elements.changeType.focus();
  }

  function closeForm() {
    form.hidden = true;
    editingId = null;
    selectedElement?.classList.remove("feedback-target-picked");
    selectedElement = null;
  }

  function saveNote(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const now = new Date().toISOString();

    if (editingId) {
      notes = notes.map((note) => note.id === editingId ? {
        ...note,
        changeType: formData.get("changeType"),
        replacementText: String(formData.get("replacementText") || "").trim(),
        note: String(formData.get("note") || "").trim(),
        updatedAt: now,
      } : note);
    } else if (selectedElement) {
      const currentText = getElementText(selectedElement);
      notes.push({
        id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        page,
        selector: createSelector(selectedElement),
        tag: selectedElement.tagName.toLowerCase(),
        targetLabel: getTargetLabel(selectedElement),
        changeType: formData.get("changeType"),
        currentText,
        originalText: currentText,
        replacementText: String(formData.get("replacementText") || "").trim(),
        imageSource: getImageSource(selectedElement),
        note: String(formData.get("note") || "").trim(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        createdAt: now,
        updatedAt: now,
      });
    }

    persistNotes();
    closeForm();
    renderNotes();
    showToast("ההערה נשמרה");
  }

  function handleNoteAction(event) {
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    const noteElement = event.target.closest("[data-note-id]");
    const note = notes.find((item) => item.id === noteElement?.dataset.noteId);

    if (!note) {
      return;
    }

    if (event.target.dataset.action === "edit") {
      editingId = note.id;
      selectedElement = null;
      openForm(note);
    }

    if (event.target.dataset.action === "delete") {
      notes = notes.filter((item) => item.id !== note.id);
      persistNotes();
      renderNotes();
    }
  }

  function renderNotes() {
    const pageNotes = notes.filter((note) => note.page === page);

    if (!pageNotes.length) {
      notesContainer.innerHTML = '<p class="feedback-empty">אין עדיין הערות בעמוד הזה.</p>';
      return;
    }

    notesContainer.innerHTML = pageNotes.map((note, index) => `
      <article class="feedback-note" data-note-id="${escapeHtml(note.id)}">
        <p class="feedback-note-meta">${index + 1}. ${escapeHtml(changeTypeLabel(note.changeType))} · ${escapeHtml(note.page)}</p>
        <h3>${escapeHtml(note.targetLabel || note.selector)}</h3>
        ${note.replacementText ? `<p class="feedback-note-text">${escapeHtml(note.originalText)} ← ${escapeHtml(note.replacementText)}</p>` : ""}
        ${note.note ? `<p class="feedback-note-text">${escapeHtml(note.note)}</p>` : ""}
        <div class="feedback-note-actions">
          <button type="button" data-action="edit">עריכה</button>
          <button type="button" data-action="delete">מחיקה</button>
        </div>
      </article>
    `).join("");
  }

  function exportNotes() {
    const payload = {
      version: 2,
      site: "Oren Herbalist Website",
      exportedAt: new Date().toISOString(),
      instructions: "Each item records the page, change type, selected element, original text, replacement text when relevant, request, and viewport size.",
      notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `oren-site-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  function exitFeedbackMode() {
    const url = new URL(window.location.href);
    url.searchParams.delete("feedback");
    window.location.href = url.toString();
  }

  function enableFeedbackNavigation() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      if (!(anchor instanceof HTMLAnchorElement) || anchor.origin !== window.location.origin || !anchor.pathname.endsWith(".html")) {
        return;
      }

      const url = new URL(anchor.href);
      url.searchParams.set("feedback", "1");
      anchor.href = url.toString();
    });
  }

  function createSelector(element) {
    const parts = [];
    let current = element;

    while (current && current !== document.body) {
      let part = current.tagName.toLowerCase();

      if (current.id) {
        part += `#${CSS.escape(current.id)}`;
        parts.unshift(part);
        break;
      }

      const classes = [...current.classList].filter((name) => !name.startsWith("feedback-"));
      if (classes.length) {
        part += `.${classes.map((name) => CSS.escape(name)).join(".")}`;
      }

      const siblings = current.parentElement ? [...current.parentElement.children].filter((child) => child.tagName === current.tagName) : [];
      if (siblings.length > 1) {
        part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }

      parts.unshift(part);
      current = current.parentElement;
    }

    return `body > ${parts.join(" > ")}`;
  }

  function getTargetLabel(element) {
    const text = getElementText(element);
    const labels = {
      H1: "כותרת ראשית",
      H2: "כותרת",
      H3: "כותרת",
      P: "פסקה",
      IMG: "תמונה",
      SECTION: "אזור",
      A: "קישור",
      BUTTON: "כפתור",
    };
    const label = labels[element?.tagName] || "אלמנט";
    return text ? `${label}: ${text.slice(0, 150)}` : label;
  }

  function getElementText(element) {
    return String(element?.innerText || element?.getAttribute?.("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 700);
  }

  function getImageSource(element) {
    if (element instanceof HTMLImageElement) {
      return element.currentSrc || element.src;
    }

    return window.getComputedStyle(element).backgroundImage.replace(/^url\(["']?|["']?\)$/g, "").replace(/^none$/, "");
  }

  function changeTypeLabel(type) {
    return {
      text: "שינוי מלל",
      design: "שינוי עיצוב",
      freeform: "שינוי חופשי",
    }[type] || type;
  }

  function escapeHtml(value) {
    const span = document.createElement("span");
    span.textContent = String(value || "");
    return span.innerHTML;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }
})();
