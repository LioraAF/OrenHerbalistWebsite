const siteGalleryImages = window.siteGalleryImages || {};
const languageSwitch = document.querySelector('.language-switch');
if (languageSwitch) {
  const destination = new URL(languageSwitch.href);
  destination.search = window.location.search;
  destination.hash = window.location.hash;
  languageSwitch.href = destination.href;
}
// Keep the entire English name visible on one line, even in a narrow header.
const fitEnglishBrandName = () => {
  if (document.documentElement.lang !== 'en') return;
  const name = document.querySelector('.brand strong');
  if (!name) return;
  name.style.removeProperty('font-size');
  const available = name.parentElement.clientWidth;
  const desired = parseFloat(getComputedStyle(name).fontSize);
  if (available > 0 && name.scrollWidth > available) {
    name.style.fontSize = `${desired * available / name.scrollWidth}px`;
  }
};
fitEnglishBrandName();
window.addEventListener('resize', fitEnglishBrandName);
document.fonts.ready.then(fitEnglishBrandName);

// Start the English page scrollbar beneath the responsive, sticky header.
if (document.documentElement.lang === 'en') {
  const header = document.querySelector('.site-header');
  if (header) {
    const syncHeaderHeight = () => document.documentElement.style.setProperty(
      '--site-header-height', `${header.getBoundingClientRect().height}px`
    );
    syncHeaderHeight();
    new ResizeObserver(syncHeaderHeight).observe(header);
  }
}


const galleryImages = (name) => siteGalleryImages[name] || [];
const galleryImageUrl = (src) => new URL(`images/${src.split("/").map(encodeURIComponent).join("/")}`, document.baseURI).href;
const galleryBackground = (src) => src ? `url("${galleryImageUrl(src)}")` : "none";

// Folder-backed photo sections, including sections that previously showed a single photo.
[
  [".image-band-photo", "main"],
  [".about-photo", "treatment"],
  [".values-photo", "treatment"],
].forEach(([selector, name], offset) => {
  const images = galleryImages(name);
  document.querySelectorAll(selector).forEach((frame) => {
    let index = images.length ? offset % images.length : 0;
    const show = () => { frame.style.backgroundImage = galleryBackground(images[index]); };
    show();
    if (images.length > 1) window.setInterval(() => {
      index = (index + 1) % images.length;
      show();
    }, 6000);
  });
});

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open") || !(event.target instanceof Element)) {
      return;
    }

    const clickedToggle = navToggle.contains(event.target);
    const clickedOption = event.target.closest(".site-nav a");

    if (!clickedToggle && !clickedOption) {
      closeNav();
    }
  });
}

const storyMedia = document.querySelector(".story-media");
if (storyMedia && !galleryImages("home").length) {
  storyMedia.style.setProperty("--story-main-image", "none");
  storyMedia.style.setProperty("--story-small-image", "none");
}

if (storyMedia && galleryImages("home").length) {
  const mainPhoto = storyMedia.querySelector(".story-photo-main");
  const smallPhoto = storyMedia.querySelector(".story-photo-secondary");
  const storyImages = [...galleryImages("home")];
  for (let index = storyImages.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [storyImages[index], storyImages[randomIndex]] = [storyImages[randomIndex], storyImages[index]];
  }

  const rotateEveryMs = 6000;
  const pushMs = 1500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mainIndex = 0;
  let smallIndex = 1 % storyImages.length;
  let nextIndex = 2 % storyImages.length;

  storyImages.forEach((src) => {
    const image = new Image();
    image.src = galleryImageUrl(src);
  });

  const setStoryImages = () => {
    storyMedia.style.setProperty("--story-main-image", galleryBackground(storyImages[mainIndex]));
    storyMedia.style.setProperty("--story-small-image", galleryBackground(storyImages[smallIndex]));
  };

  const createStoryGhost = () => {
    if (!(mainPhoto instanceof HTMLElement) || !(smallPhoto instanceof HTMLElement)) {
      return null;
    }

    const mediaRect = storyMedia.getBoundingClientRect();
    const mainRect = mainPhoto.getBoundingClientRect();
    const smallRect = smallPhoto.getBoundingClientRect();

    if (!mainRect.width || !mainRect.height || !smallRect.width || !smallRect.height) {
      return null;
    }

    const ghost = document.createElement("div");
    ghost.className = "story-photo story-photo-ghost";
    ghost.style.backgroundImage = `
      linear-gradient(rgba(41, 53, 31, 0.08), rgba(239, 229, 210, 0.08)),
      ${galleryBackground(storyImages[mainIndex])}
    `;
    ghost.style.left = `${mainRect.left - mediaRect.left}px`;
    ghost.style.top = `${mainRect.top - mediaRect.top}px`;
    ghost.style.width = `${mainRect.width}px`;
    ghost.style.height = `${mainRect.height}px`;
    ghost.style.transform = "translate(0, 0) scale(1)";
    storyMedia.append(ghost);

    // Commit the starting rectangle so the next values animate instead of snapping.
    void ghost.offsetHeight;

    const shiftX = smallRect.left + smallRect.width / 2 - (mainRect.left + mainRect.width / 2);
    const shiftY = smallRect.top + smallRect.height / 2 - (mainRect.top + mainRect.height / 2);
    const scale = Math.min(smallRect.width / mainRect.width, smallRect.height / mainRect.height);

    window.requestAnimationFrame(() => {
      ghost.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(${scale})`;
    });

    return ghost;
  };

  const advanceStoryImages = () => {
    smallIndex = mainIndex;
    mainIndex = nextIndex;
    nextIndex = (nextIndex + 1) % storyImages.length;
    setStoryImages();
  };

  const rotateStoryImages = () => {
    if (reduceMotion) {
      advanceStoryImages();
      return;
    }

    const ghost = createStoryGhost();
    storyMedia.classList.add("is-pushing");

    window.setTimeout(() => {
      advanceStoryImages();
      storyMedia.classList.remove("is-pushing");
      ghost?.remove();
    }, pushMs);
  };

  setStoryImages();
  const storyObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) {
      return;
    }

    storyObserver.disconnect();
    window.setTimeout(() => {
      rotateStoryImages();
      window.setInterval(rotateStoryImages, rotateEveryMs);
    }, 800);
  }, { threshold: 0.25 });
  storyObserver.observe(storyMedia);
}

const productRotationFrame = document.querySelector(".product-rotation-frame");
if (productRotationFrame && !galleryImages("products").length) {
  productRotationFrame.style.setProperty("--product-rotation-image", "none");
}

if (productRotationFrame instanceof HTMLElement && galleryImages("products").length) {
  const productRotationImages = galleryImages("products");
  const rotationMs = 4200;
  const fadeMs = 1500;
  const overlapMs = 600;
  const enterDelayMs = fadeMs - overlapMs;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let productImageIndex = 0;

  productRotationImages.forEach((src) => {
    const image = new Image();
    image.src = galleryImageUrl(src);
  });

  const setProductRotationImage = () => {
    productRotationFrame.style.setProperty(
      "--product-rotation-image",
      galleryBackground(productRotationImages[productImageIndex])
    );
  };

  const rotateProductImage = () => {
    productImageIndex = (productImageIndex + 1) % productRotationImages.length;

    if (reduceMotion) {
      setProductRotationImage();
      return;
    }

    const outgoingFrame = productRotationFrame.cloneNode(true);
    outgoingFrame.setAttribute("aria-hidden", "true");
    Object.assign(outgoingFrame.style, {
      position: "absolute",
      top: `${productRotationFrame.offsetTop}px`,
      left: `${productRotationFrame.offsetLeft}px`,
      width: `${productRotationFrame.offsetWidth}px`,
      height: `${productRotationFrame.offsetHeight}px`,
      pointerEvents: "none",
    });
    productRotationFrame.parentElement.append(outgoingFrame);
    productRotationFrame.classList.add("is-entering");
    setProductRotationImage();
    void outgoingFrame.offsetHeight;
    outgoingFrame.classList.add("is-leaving");

    window.setTimeout(() => {
      void productRotationFrame.offsetHeight;
      productRotationFrame.classList.remove("is-entering");
    }, enterDelayMs);
    window.setTimeout(() => outgoingFrame.remove(), fadeMs + 50);
  };

  setProductRotationImage();
  window.setInterval(rotateProductImage, rotationMs);
}

const workshopRotationSets = {
  adults: galleryImages("adults"),
  kids: galleryImages("kids"),
};

document.querySelectorAll("[data-workshop-rotation]").forEach((frame) => {
  if (!(frame instanceof HTMLElement)) {
    return;
  }

  const rotationName = frame.dataset.workshopRotation;
  const rotationImages = workshopRotationSets[rotationName] || [];

  if (!rotationImages.length) {
    frame.style.setProperty("--workshop-rotation-image", "none");
    return;
  }

  const rotationMs = 4600;
  const enterDelayMs = 520;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let imageIndex = 0;

  rotationImages.forEach((src) => {
    const image = new Image();
    image.src = galleryImageUrl(src);
  });

  const setWorkshopRotationImage = () => {
    frame.style.setProperty(
      "--workshop-rotation-image",
      galleryBackground(rotationImages[imageIndex])
    );
  };

  const rotateWorkshopImage = () => {
    imageIndex = (imageIndex + 1) % rotationImages.length;

    if (reduceMotion) {
      setWorkshopRotationImage();
      return;
    }

    frame.classList.add("is-leaving");

    window.setTimeout(() => {
      frame.classList.add("is-entering");
      frame.classList.remove("is-leaving");
      setWorkshopRotationImage();

      void frame.offsetHeight;
      frame.classList.remove("is-entering");
    }, enterDelayMs);
  };

  setWorkshopRotationImage();
  window.setInterval(rotateWorkshopImage, rotationMs);
});

const workshopModal = document.getElementById("workshop-modal");
const workshopModalClose = document.querySelector("[data-workshop-modal-close]");
const workshopModalLabel = document.querySelector("[data-workshop-modal-label]");
const workshopModalTitle = document.querySelector("[data-workshop-modal-title]");
const workshopModalContent = document.querySelector("[data-workshop-modal-content]");

const workshopModalDetails = {
  resin: {
    label: "סדנה מעשית",
    title: "ליקוט שרפים ביער",
    transition: "pop",
    paragraphs: [
      "נלמד על היערות בישראל ועל המשמעות האקולוגית של עץ האורן. נצא ליער ונכיר את השרף, הריח והמרקם שלו. לומדים להסתכל על העץ, להבין איפה השרף מופיע, ומה ההבדל בין איסוף אחראי לבין פגיעה מיותרת בעץ.",
      "במהלך המפגש מכירים שימושים מסורתיים של שרפים, מדברים על בטיחות ועל מינונים פשוטים, ואז עוברים לרקיחה מעשית.",
      "בסוף מכינים יחד משחת עזרה ראשונה ביתית, שמתאימה לשימוש חיצוני סביב יובש, חתכים, שפשופים, עור מגורה וכוויות קלות.",
      "מתאים במיוחד לקבוצות ולזוגות שרוצים חוויה בטבע עם ארומת יער ומשחה שרקחנו יחד לקחת הביתה.",
    ],
    where: "ביער אורנים מתאים, באזור קדיתא והגליל העליון או ביער אחר שמתאים לקבוצה ולעונה.",
  },
  oils: {
    label: "סדנה מעשית",
    title: "סדנת זיקוק שמנים וארומתרפיה",
    transition: "pop",
    paragraphs: [
      "מפגש מעשי שמלווה את כל הדרך מהצמח ועד למוצר: מלקטים צמחים ארומטיים, מזקקים אותם לקבלת שמן אתרי והידרוסול, ומשלבים את התוצרים ברוקחות טבעית לשימוש יומיומי.",
      "מכירים מגוון שמנים אתריים שימושיים, מריחים ומשווים ביניהם, ולומדים על האיכויות שלהם, על דילול נכון ועל שימוש בטוח.",
      "רוקחים יחד מוצרים לפי צורכי המשתתפים, תוך שימוש בשמן האתרי ובהידרוסול שהפקנו בתהליך הזיקוק.",
      "הסדנה מתאימה לימי חברה, לקבוצות חברים וגם לדייט ייחודי לזוגות. אפשר להתאים את המפגש לעבודה בפנים או בחוץ.",
    ],
    where: "באזור קדיתא והגליל העליון, או במקום אחר בארץ בתיאום מראש, עם צמחים לליקוט ומרחב מתאים לזיקוק ולרקיחה.",
  },
  mushrooms: {
    label: "סדנה מעשית",
    title: "היכרות עם ליקוט פטריות למאכל",
    transition: "pop",
    paragraphs: [
      "יציאה משותפת לטבע ללמידה חווייתית על פטריות בר, עם דגש גדול על זהירות, סבלנות ואחריות.",
      "לומדים איך בכלל מסתכלים על פטרייה: בית גידול, עונה, צבע, ריח, מבנה, סימני זיהוי ומה חשוב לצלם או לבדוק לפני שמחליטים משהו.",
      "המפגש לא נועד לעודד אכילה חסרת זהירות מהטבע, אלא לבנות שפה בסיסית ובטוחה יותר סביב פטריות, סקרנות והיכרות עם הסביבה.",
      "אפשר לשלב שיחה על מטבח, מסורות מקומיות, ייבוש ושימור, בהתאם לעונה ולמה שפוגשים בשטח.",
    ],
    where: "ביער ובשטחים טבעיים שבהם יש תנאים מתאימים לפטריות. המיקום נקבע סמוך למועד לפי העונה, הגשם ומה שקורה בשטח.",
  },
  roots: {
    label: "סדנה מעשית",
    title: "ליקוט שורשי מרפא",
    transition: "pop",
    paragraphs: [
      "סדנה מעשית שמחברת לחומר דרך הידיים: מכירים צמחי מרפא מקומיים, לומדים לזהות אותם ומלקטים שורשים באחריות.",
      "עובדים עם השורשים שליקטנו: מרגישים את המרקם, מנקים, מעבדים ומכינים מהם תוצרי רוקחות טבעית.",
      "לצד העשייה נלמד על שימושי המרפא של השורשים שליקטנו, מתוך הידע המסורתי והמידע המחקרי הקיים.",
      "הסדנה מתקיימת לאורך השנה. בחירת הצמחים והפעילות מותאמת לזמינות בשטח, תוך שמירה על הצמחייה ועל יכולתה להתחדש.",
    ],
    where: "בטבע, באזור קדיתא והגליל העליון או במקום מתאים אחר בארץ, עם מרחב לעבודה מעשית בשורשים.",
  },
  lecture: {
    label: "הרצאה",
    title: "צמחי מרפא, טבע ובריאות יומיומית",
    transition: "pop",
    paragraphs: [
      "הרצאה חווייתית שפותחת חלון לעולם צמחי המרפא ולקשר בין אדם, אדמה ובריאות.",
      "אורן מביא איתו מגוון צמחי מרפא נפוצים בגינות, כגון מרווה, רוזמרין, טימין, זוטא ועשב לימון. מכירים את הצמחים מקרוב ולומדים על האיכויות והשימושים של כל אחד.",
      "לומדים איך להכין תה כדי להפיק את האיכויות של הצמח, ואיך ומתי לשלב אותו בחיי היומיום, תוך התייחסות לשימוש בטוח ולהתאמה אישית.",
      "בסוף ההרצאה המשתתפים מרכיבים לעצמם חליטה על פי החומר הנלמד. ההרצאה מתאימה לחברות, לקהילות ולקבוצות, ללא הגבלה על מספר המשתתפים.",
    ],
    where: "באזור קדיתא והגליל העליון או במקום אחר בארץ: במרחב קהילתי, בבית אירוח, באולם או במשרד.",
  },
  custom: {
    label: "סדנה בהתאמה אישית",
    title: "מה מסקרן אתכם ללמוד?",
    transition: "pop",
    paragraphs: [
      "כל אדם מסתקרן מהדברים קצת אחרת. אם יש משהו מסוים שהייתם רוצים ללמוד, נבנה יחד מפגש סביב תחומי העניין והצרכים שלכם.",
      "אפשר להעמיק בצמחי מרפא, ארומתרפיה, ליקוט, גידול, זיקוק, הרכבת פורמולות ורוקחות טבעית, וגם בהיכרות עם עולם הפטריות.",
      "התוכן נבנה לפי הצורך והעניין של האדם, הזוג או הקבוצה, ובהתאם לעונה, למיקום ולרצון לקיים את המפגש בפנים או בחוץ.",
      "אפשר לתכנן מפגש אישי, דייט ייחודי לזוגות או סדנה לקבוצה של עד 30 משתתפים, כמפגש חד פעמי או כחלק מסדרה.",
    ],
    where: "באזור קדיתא והגליל העליון, או במקום מפגש אחר בארץ שנבחר יחד: בטבע, בבית, בבית אירוח, במרחב קהילתי או במשרד.",
  },
};

if (
  workshopModal instanceof HTMLDialogElement &&
  workshopModalLabel instanceof HTMLElement &&
  workshopModalTitle instanceof HTMLElement &&
  workshopModalContent instanceof HTMLElement
) {
  let lastWorkshopTrigger = null;

  const closeWorkshopModal = () => {
    if (workshopModal.open) {
      workshopModal.close();
    }
  };

  const openWorkshopModal = (trigger) => {
    const detailKey = trigger.dataset.workshopModal || "";
    const detail = workshopModalDetails[detailKey];

    if (!detail) {
      return;
    }

    lastWorkshopTrigger = trigger;
    workshopModalLabel.textContent = detail.label;
    workshopModalTitle.textContent = detail.title;
    workshopModal.dataset.transition = detail.transition;

    const whereSection = document.createElement("section");
    const whereTitle = document.createElement("h3");
    const whereDescription = document.createElement("p");

    whereSection.className = "workshop-modal-where workshop-modal-where-soft-note";
    whereTitle.textContent = "איפה:";
    whereDescription.textContent = detail.where;
    whereSection.append(whereTitle, whereDescription);

    workshopModalContent.replaceChildren(
      ...detail.paragraphs.map((paragraph) => {
        const node = document.createElement("p");
        node.textContent = paragraph;
        return node;
      }),
      whereSection
    );

    workshopModal.showModal();
  };

  document.querySelectorAll("[data-workshop-modal]").forEach((trigger) => {
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    trigger.addEventListener("click", () => openWorkshopModal(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openWorkshopModal(trigger);
    });
  });

  workshopModalClose?.addEventListener("click", closeWorkshopModal);
  workshopModal.addEventListener("click", (event) => {
    if (event.target === workshopModal) {
      closeWorkshopModal();
    }
  });
  workshopModal.addEventListener("close", () => {
    lastWorkshopTrigger?.focus();
  });
}

const workshopAdultGalleryImages = galleryImages("adults");
const workshopGallerySets = workshopRotationSets;

const shuffleImages = (images) => {
  const shuffled = [...images];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const createGalleryImage = (src, onError) => {
  const image = document.createElement("img");
  image.alt = "";
  image.loading = "lazy";
  const frame = document.createElement("span");
  frame.className = "gallery-photo";
  frame.append(image);
  image.addEventListener("error", () => onError(frame), { once: true });
  image.src = galleryImageUrl(src);
  return frame;
};

const getTrackGap = (track) => {
  const trackStyle = window.getComputedStyle(track);
  const columnGap = parseFloat(trackStyle.columnGap);
  return Number.isFinite(columnGap) ? columnGap : parseFloat(trackStyle.gap) || 0;
};

document.querySelectorAll("[data-gallery-strip]").forEach(async (track) => {
  const gallery = track.closest(".gallery-strip");
  const viewport = track.closest(".gallery-strip-window");
  if (!gallery || !viewport) return;

  const source = track.dataset.galleryStrip || "adults";
  const sourceImages = workshopGallerySets[source] || workshopAdultGalleryImages;
  const sources = new Set(source === "adults" ? shuffleImages(sourceImages) : sourceImages);
  const controls = gallery.querySelectorAll("[data-gallery-control]");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cruiseSpeed = 18; // Pixels per second, independent of photo width and screen refresh rate.
  const clickDistance = 1000;
  let direction = 1;
  let offset = 0;
  let boost = null;
  let velocity = cruiseSpeed;
  let lastTime = null;
  let animationFrame = 0;
  let visible = false;
  let ready = false;

  const updateControls = () => controls.forEach(button => { button.disabled = sources.size < 2; });
  const render = () => { track.style.transform = `translate3d(${-offset}px, 0, 0)`; };
  const stepWidth = frame => frame.getBoundingClientRect().width + getTrackGap(track);

  const removeMissingImage = frame => {
    const src = frame.dataset.gallerySrc;
    const anchor = [...track.children].find(item => item.dataset.gallerySrc !== src);
    const before = ready && anchor ? anchor.getBoundingClientRect().left : 0;
    sources.delete(src);
    [...track.children].filter(item => item.dataset.gallerySrc === src).forEach(item => item.remove());
    if (ready && anchor) offset += anchor.getBoundingClientRect().left - before;
    if (sources.size < 2) {
      boost = null;
      offset = 0;
    }
    updateControls();
    render();
  };

  const appendPhoto = src => {
    const frame = createGalleryImage(src, removeMissingImage);
    frame.dataset.gallerySrc = src;
    frame.querySelector("img").loading = "eager";
    track.append(frame);
    return frame;
  };

  [...sources].forEach(appendPhoto);
  updateControls();
  // Resolve natural photo widths before recycling frames, avoiding layout jumps as images load.
  await Promise.all([...track.querySelectorAll("img")].map(image => image.decode().catch(() => {})));
  ready = true;

  const fillTrack = () => {
    if (sources.size < 2 || !track.children.length) return;
    const largest = Math.max(...[...track.children].map(frame => stepWidth(frame)));
    const minimumWidth = viewport.clientWidth + 2 * largest;
    // Copy complete cycles in their current order. Partial cycles can put the same
    // photo on both sides of the loop join, especially after moving and resizing.
    const sequence = [...track.children].slice(0, sources.size).map(frame => frame.dataset.gallerySrc);
    while (track.getBoundingClientRect().width < minimumWidth) {
      sequence.forEach(appendPhoto);
    }
  };

  const recycle = () => {
    if (sources.size < 2) return;
    while (offset >= stepWidth(track.firstElementChild)) {
      offset -= stepWidth(track.firstElementChild);
      track.append(track.firstElementChild);
    }
    while (offset < 0) {
      const last = track.lastElementChild;
      offset += stepWidth(last);
      track.prepend(last);
    }
  };

  // Quintic motion matches the current and cruising velocities with zero acceleration at both ends.
  // Button clicks can retarget an ongoing move without snapping position or speed.
  const boostPosition = (t, move) => {
    const t2 = t * t, t3 = t2 * t, t4 = t3 * t, t5 = t4 * t;
    return move.distance * (10*t3 - 15*t4 + 6*t5)
      + move.startSpeed * move.duration * (t - 6*t3 + 8*t4 - 3*t5)
      + move.endSpeed * move.duration * (-4*t3 + 7*t4 - 3*t5);
  };
  const boostVelocity = (t, move) => {
    const t2 = t * t, t3 = t2 * t, t4 = t3 * t;
    return move.distance / move.duration * (30*t2 - 60*t3 + 30*t4)
      + move.startSpeed * (1 - 18*t2 + 32*t3 - 15*t4)
      + move.endSpeed * (-12*t2 + 28*t3 - 15*t4);
  };

  const tick = time => {
    animationFrame = 0;
    const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    if (sources.size > 1) {
      if (boost) {
        boost.elapsed = Math.min(boost.elapsed + delta, boost.duration);
        const progress = boost.elapsed / boost.duration;
        const position = boostPosition(progress, boost);
        offset += position - boost.position;
        boost.position = position;
        velocity = boostVelocity(progress, boost);
        if (progress === 1) boost = null;
      } else {
        velocity = direction * cruiseSpeed;
        offset += velocity * delta;
      }
      recycle();
      render();
    }
    startAnimation();
  };

  const startAnimation = () => {
    if (!animationFrame && ready && visible && !document.hidden && !motionPreference.matches && sources.size > 1) {
      animationFrame = window.requestAnimationFrame(tick);
    }
  };
  const pauseAnimation = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastTime = null;
  };

  controls.forEach(button => button.addEventListener("click", () => {
    if (sources.size < 2) return;
    const nextDirection = button.dataset.galleryControl === "prev" ? -1 : 1;
    if (motionPreference.matches) {
      offset += nextDirection * clickDistance;
      recycle();
      render();
      return;
    }
    const distance = nextDirection * clickDistance;
    direction = nextDirection;
    boost = {
      distance,
      duration: Math.max(1.2, Math.min(2.8, Math.abs(distance) / 620 + 0.7)),
      startSpeed: velocity,
      endSpeed: direction * cruiseSpeed,
      elapsed: 0,
      position: 0,
    };
    startAnimation();
  }));

  fillTrack();
  render();
  new ResizeObserver(() => { fillTrack(); recycle(); render(); }).observe(viewport);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) startAnimation();
    else pauseAnimation();
  }, { rootMargin: "100px" }).observe(gallery);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAnimation();
    else startAnimation();
  });
  motionPreference.addEventListener("change", () => {
    pauseAnimation();
    boost = null;
    startAnimation();
  });
});

const reelsGrid = document.querySelector("[data-reels-grid]");

if (reelsGrid instanceof HTMLElement) {
  const filters = Array.from(document.querySelectorAll("[data-library-filter]"));
  const countLabel = document.querySelector("[data-library-count]");
  const modal = document.querySelector("[data-reel-modal]");
  const modalClose = document.querySelector("[data-reel-modal-close]");
  const modalVideo = document.querySelector("[data-reel-modal-video]");
  const modalTopic = document.querySelector("[data-reel-modal-topic]");
  const modalTitle = document.querySelector("[data-reel-modal-title]");
  const modalDescription = document.querySelector("[data-reel-modal-description]");
  const modalLink = document.querySelector("[data-reel-modal-link]");
  const reelTopics = {
    "medicinal-plants": "צמחי מרפא",
    foraging: "ליקוט",
    "natural-pharmacy": "רוקחות ביתית",
  };

  const reelItems = [
    {
      id: "5XaKIqrVzQs",
      topic: "medicinal-plants",
      title: "שיחה עם פרץ על סמבוק שחור",
      description: "פרץ מעל־עלים משוחח עם אורן על גבעולי הסמבוק, על סגולות עממיות ועל מקור שמו של הצמח. תיעוד של מסורות וסיפורים, לא הנחיה לטיפול בתינוקות.",
      thumbnail: "https://i.ytimg.com/vi/5XaKIqrVzQs/maxres1.jpg",
    },
    {
      id: "baCel93LGAM",
      topic: "medicinal-plants",
      title: "הכנת עלי בוצין מפורץ",
      description: "היכרות עם הבוצין המפורץ ועם העלים המכוסים שערות עדינות. אורן מדגים את הכנת העלים ומספר על שימושים מסורתיים בחליטה וגם בעישון, ללא המלצה לעשן.",
      thumbnail: "https://i.ytimg.com/vi/baCel93LGAM/maxres3.jpg",
    },
    {
      id: "A0LhLF-EHwU",
      topic: "medicinal-plants",
      title: "האזוב במטבח ובמסורת המקומית",
      description: "האזוב שמוכר כזעתר, מהעלים הריחניים ועד התוספת לסלט ולמרק. אורן משוחח על טעמו של הצמח ועל מקומו במסורת צמחי המרפא המקומית.",
      thumbnail: "https://i.ytimg.com/vi/A0LhLF-EHwU/maxres2.jpg",
    },
    {
      id: "1dSl-rc-K5Y",
      topic: "medicinal-plants",
      title: "היכרות עם ולריאנה איטלקית",
      description: "בין צמחי הבר מסתתרת ולריאנה איטלקית, קרובה של הוולריאנה הרפואית. אורן מראה את העלים ומסביר מדוע השורש, עם ריחו האופייני, הוא החלק שמוזכר בשימוש המסורתי.",
      thumbnail: "https://i.ytimg.com/vi/1dSl-rc-K5Y/maxres2.jpg",
    },
    {
      id: "ie1XCKPkTT4",
      topic: "natural-pharmacy",
      title: "הכנת שמן משרף אורן",
      description: "למה עץ האורן מפריש שרף, ומה רואים סביב פצע ישן בגזע? אורן משוחח על איסוף השרף ועל תהליך הכנת שמן בבן־מארי וסינונו.",
      thumbnail: "https://i.ytimg.com/vi/ie1XCKPkTT4/maxres1.jpg",
    },
    {
      id: "77K_0Jfd-wk",
      topic: "foraging",
      title: "שלבי הצמיחה של חרחבינה מכחילה",
      description: "איך משתנה החרחבינה מעלים צעירים ועגולים לצמח בוגר וקוצני? אורן מציג את שלבי הצמיחה ואת ההבדל בין השימוש הקולינרי בעלים לשימוש המסורתי בשורש.",
      thumbnail: "https://i.ytimg.com/vi/77K_0Jfd-wk/maxres2.jpg",
    },
    {
      id: "dW3hDGr-1T8",
      topic: "medicinal-plants",
      title: "קומפרי וזהירות בשימוש בו",
      description: "אורן מציג את הקומפרי ביער ומספר על השימוש המסורתי שלו במיצויים לשימוש חיצוני. השיחה מדגישה את האזהרה מפני שימוש פנימי בצמח.",
      thumbnail: "https://i.ytimg.com/vi/dW3hDGr-1T8/maxres3.jpg",
    },
    {
      id: "9LLRsOUS_Cs",
      topic: "foraging",
      title: "ליקוט כוכבית בין מחטי האורן",
      description: "מפגש עם הכוכבית הגדלה בין מחטי האורן בקדיתא. אורן מציג את המרקם הרך והרירי שלה ומשוחח על מקומה במטבח ובמיצויים מסורתיים לשימוש חיצוני.",
      thumbnail: "https://i.ytimg.com/vi/9LLRsOUS_Cs/maxres1.jpg",
    },
  ].map((item, index) => ({
    ...item,
    topicLabel: reelTopics[item.topic],
    tone: index % 6,
    thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`,
    youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
  }));

  reelItems.forEach((item) => {
    item.watchUrl = item.youtubeUrl;
    item.linkLabel = "לצפייה ב־YouTube";
  });

  (window.DRIVE_VIDEOS || []).forEach((item) => {
    const youtubeId = item.youtubeId;
    reelItems.push({
      ...item,
      topicLabel: reelTopics[item.topic],
      tone: reelItems.length % 6,
      embedUrl: youtubeId
        ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`
        : `https://drive.google.com/file/d/${item.driveId}/preview`,
      watchUrl: youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : `https://drive.google.com/file/d/${item.driveId}/view`,
      linkLabel: youtubeId ? "לצפייה ב־YouTube" : "לצפייה ב־Google Drive",
    });
  });

  let activeFilter = "all";
  let visibleCount = 12;
  const loadMore = document.querySelector("[data-reels-load-more]");

  const getFilteredItems = () => {
    if (activeFilter === "all") {
      return reelItems;
    }

    return reelItems.filter((item) => item.topic === activeFilter);
  };

  const createReelCard = (item) => {
    const card = document.createElement("button");
    card.className = "reel-library-card";
    card.type = "button";
    card.dataset.reelId = item.id;
    card.setAttribute("aria-label", `פתיחת ${item.title}`);

    const media = document.createElement("span");
    media.className = `reel-card-media reel-tone-${item.tone}`;

    const thumbnail = document.createElement("img");
    thumbnail.className = "reel-card-thumbnail";
    thumbnail.src = item.thumbnail;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";

    const play = document.createElement("span");
    play.className = "reel-play";
    play.setAttribute("aria-hidden", "true");
    play.textContent = "▶";

    const copy = document.createElement("span");
    copy.className = "reel-card-copy";

    const topic = document.createElement("span");
    topic.className = "reel-card-topic";
    topic.textContent = item.topicLabel;

    const title = document.createElement("span");
    title.className = "reel-card-title";
    title.textContent = item.title;

    media.append(thumbnail, play);
    copy.append(topic, title);
    if (item.description && item.description !== "מפגש עם אורן ועם עולם הצמחים, הליקוט והרוקחות הביתית.") {
      const description = document.createElement("span");
      description.className = "reel-card-description";
      description.textContent = item.description;
      copy.append(description);
    }
    card.append(media, copy);
    return card;
  };

  const renderReels = () => {
    const filteredItems = getFilteredItems();
    const loadedItems = filteredItems.slice(0, visibleCount);
    reelsGrid.replaceChildren(...loadedItems.map(createReelCard));
    if (loadMore instanceof HTMLButtonElement) {
      loadMore.hidden = visibleCount >= filteredItems.length;
      const nextCount = Math.min(12, Math.max(0, filteredItems.length - visibleCount));
      loadMore.textContent = `הצגת ${nextCount} סרטונים נוספים`;
    }

    if (countLabel instanceof HTMLElement) {
      countLabel.textContent = `${filteredItems.length} סרטונים`;
    }
  };

  const stopModalVideo = () => {
    if (modalVideo instanceof HTMLIFrameElement) {
      modalVideo.removeAttribute("src");
      modalVideo.title = "";
      modalVideo.hidden = true;
    }
  };

  const closeModal = () => {
    stopModalVideo();

    if (modal instanceof HTMLDialogElement && modal.open) {
      modal.close();
    }
  };

  const openModal = (item) => {
    if (!(modal instanceof HTMLDialogElement)) {
      return;
    }

    if (modalTopic instanceof HTMLElement) {
      modalTopic.textContent = item.topicLabel;
    }

    if (modalTitle instanceof HTMLElement) {
      modalTitle.textContent = item.title;
    }

    if (modalDescription instanceof HTMLElement) {
      modalDescription.textContent = item.description;
    }

    if (modalLink instanceof HTMLAnchorElement) {
      modalLink.href = item.watchUrl;
      modalLink.textContent = item.linkLabel;
    }

    if (modalVideo instanceof HTMLIFrameElement) {
      modalVideo.src = item.embedUrl;
      modalVideo.title = item.title;
      modalVideo.hidden = false;
    }

    modal.showModal();
  };

  filters.forEach((filter) => {
    if (!(filter instanceof HTMLButtonElement)) {
      return;
    }

    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.libraryFilter || "all";
      visibleCount = 12;

      filters.forEach((option) => {
        const isActive = option === filter;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      renderReels();
    });
  });

  loadMore?.addEventListener("click", () => {
    visibleCount += 12;
    renderReels();
  });

  reelsGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const card = event.target.closest("[data-reel-id]");
    const item = reelItems.find((candidate) => candidate.id === card?.dataset.reelId);

    if (item) {
      openModal(item);
    }
  });

  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("cancel", stopModalVideo);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  renderReels();
}

const feedbackMode = new URLSearchParams(window.location.search).get("feedback") === "1";

if (feedbackMode) {
  const feedbackStyles = document.createElement("link");
  feedbackStyles.rel = "stylesheet";
  feedbackStyles.href = "css/feedback.css?v=20261103-clear-all";
  document.head.append(feedbackStyles);

  const feedbackScript = document.createElement("script");
  feedbackScript.src = "js/feedback.js?v=20261103-clear-all";
  document.body.append(feedbackScript);
}
document.querySelectorAll('.product-roller').forEach((roller) => {
  const track = roller.querySelector('.product-roller-track');
  const scrollbar = document.createElement('div');
  scrollbar.className = 'product-scrollbar';
  scrollbar.tabIndex = 0;
  scrollbar.setAttribute('role', 'scrollbar');
  scrollbar.setAttribute('aria-label', 'גלילת מוצרים');
  scrollbar.setAttribute('aria-controls', track.id);
  scrollbar.setAttribute('aria-orientation', 'horizontal');
  scrollbar.setAttribute('aria-valuemin', '0');
  scrollbar.setAttribute('aria-valuemax', '100');
  const thumb = document.createElement('span');
  thumb.className = 'product-scrollbar-thumb';
  scrollbar.append(thumb);
  roller.append(scrollbar);
  const rtl = getComputedStyle(track).direction === 'rtl';
  const updateScroll = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = Math.min(1, track.clientWidth / track.scrollWidth);
    const progress = max > 0 ? Math.min(1, Math.abs(track.scrollLeft) / max) : 0;
    thumb.style.width = `${ratio * 100}%`;
    thumb.style.left = `${(rtl ? 1 - progress : progress) * (1 - ratio) * 100}%`;
    scrollbar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    scrollbar.setAttribute('aria-disabled', String(max <= 1));
  };
  let dragOffset = 0;
  const drag = (event) => {
    const bounds = scrollbar.getBoundingClientRect();
    const travel = bounds.width - thumb.getBoundingClientRect().width;
    if (travel <= 0) return;
    const physical = Math.max(0, Math.min(1, (event.clientX - bounds.left - dragOffset) / travel));
    track.scrollLeft = (rtl ? -(1 - physical) : physical) * (track.scrollWidth - track.clientWidth);
  };
  scrollbar.addEventListener('pointerdown', (event) => {
    if (scrollbar.getAttribute('aria-disabled') === 'true') return;
    event.preventDefault();
    scrollbar.setPointerCapture(event.pointerId);
    dragOffset = event.target === thumb ? event.clientX - thumb.getBoundingClientRect().left : thumb.getBoundingClientRect().width / 2;
    track.style.scrollSnapType = 'none';
    drag(event);
  });
  scrollbar.addEventListener('pointermove', (event) => { if (scrollbar.hasPointerCapture(event.pointerId)) drag(event); });
  scrollbar.addEventListener('lostpointercapture', () => { track.style.scrollSnapType = ''; });
  scrollbar.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') track.scrollLeft = 0;
    else if (event.key === 'End') track.scrollLeft = (rtl ? -1 : 1) * (track.scrollWidth - track.clientWidth);
    else track.scrollBy({left: (event.key === 'ArrowLeft' ? -1 : 1) * track.clientWidth / 2});
  });
  track.addEventListener('scroll', updateScroll, {passive: true});
  new ResizeObserver(updateScroll).observe(track);
  updateScroll();
  roller.querySelectorAll('[data-product-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = track.querySelector('.preparation-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      track.scrollBy({ left: direction * Number(button.dataset.productStep) * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  });
});

const giftPhoto = document.querySelector('.gift-image');
if (giftPhoto) {
  const giftPhotos = galleryImages("gifts");
  let giftPhotoIndex = 0;
  let giftSliding = false;
  const showGiftPhoto = () => {
    giftPhoto.dataset.photo = giftPhotos[giftPhotoIndex]?.split("/").pop() || "";
    giftPhoto.style.backgroundImage = galleryBackground(giftPhotos[giftPhotoIndex]);
    giftPhoto.querySelector('.gift-photo-status').textContent = giftPhotos.length
      ? `תמונה ${giftPhotoIndex + 1} מתוך ${giftPhotos.length}` : "";
  };
  showGiftPhoto();
  const giftSlideLayer = () => {
    const layer = giftPhoto.cloneNode(false);
    layer.removeAttribute('role');
    layer.removeAttribute('aria-label');
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', margin: '0', border: '0', boxShadow: 'none', transform: 'none'});
    return layer;
  };
  giftPhoto.querySelectorAll('[data-gift-step]').forEach((button) => {
    button.disabled = giftPhotos.length < 2;
    button.addEventListener('click', () => {
      if (giftSliding || giftPhotos.length < 2) return;
      const outgoing = giftSlideLayer();
      giftPhotoIndex = (giftPhotoIndex + Number(button.dataset.giftStep) + giftPhotos.length) % giftPhotos.length;
      showGiftPhoto();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const incoming = giftSlideLayer();
      const viewport = document.createElement('div');
      Object.assign(viewport.style, {position: 'absolute', inset: '0', overflow: 'hidden', borderRadius: 'inherit', backgroundColor: 'var(--cream)', pointerEvents: 'none', zIndex: '1'});
      viewport.append(outgoing, incoming);
      giftPhoto.append(viewport);
      giftSliding = true;
      const direction = Number(button.dataset.giftStep) > 0 ? -1 : 1;
      const timing = {duration: 1100, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards'};
      outgoing.animate([
        {opacity: 1, offset: 0},
        {opacity: 0.85, offset: 1},
      ], timing);
      const animation = incoming.animate([
        {transform: `translateX(${direction * 100}%)`, opacity: 0, offset: 0},
        {transform: `translateX(${direction * 85}%)`, opacity: 1, offset: 0.15},
        {transform: 'translateX(0)', opacity: 1, offset: 1},
      ], timing);
      animation.finished.finally(() => { viewport.remove(); giftSliding = false; });
    });
  });
}

// Let the contact button trail scrolling briefly, then return to its resting spot.
const floatingWhatsapp = document.querySelector(".floating-whatsapp");

if (floatingWhatsapp instanceof HTMLAnchorElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let previousScroll = window.scrollY;
  let offset = 0;
  let frame = 0;
  let previousTime = 0;

  const resetFollow = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    offset = 0;
    floatingWhatsapp.style.removeProperty("translate");
  };

  const settle = (time) => {
    const elapsed = Math.min(64, Math.max(0, time - previousTime));
    previousTime = time;
    offset *= Math.exp(-elapsed / 170);

    if (Math.abs(offset) < 0.1) {
      resetFollow();
      return;
    }

    floatingWhatsapp.style.translate = `0 ${offset}px`;
    frame = window.requestAnimationFrame(settle);
  };

  window.addEventListener("scroll", () => {
    const delta = window.scrollY - previousScroll;
    previousScroll = window.scrollY;

    if (reducedMotion.matches || floatingWhatsapp.matches(":hover, :focus")) {
      resetFollow();
      return;
    }

    // Keep the full button inside the viewport, even during a fast scroll.
    offset = Math.max(-40, Math.min(20, offset - delta * 0.18));
    floatingWhatsapp.style.translate = `0 ${offset}px`;

    if (!frame) {
      previousTime = performance.now();
      frame = window.requestAnimationFrame(settle);
    }
  }, { passive: true });

  floatingWhatsapp.addEventListener("pointerenter", resetFollow);
  floatingWhatsapp.addEventListener("focus", resetFollow);
  reducedMotion.addEventListener("change", resetFollow);
}
document.querySelectorAll('details.winter-kit').forEach((details) => {
  const summary = details.querySelector('summary');
  let animation;
  let expanded = details.open;
  summary.addEventListener('click', (event) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    animation?.cancel();
    expanded = !expanded;
    details.style.height = '';
    details.open = false;
    const closedHeight = details.getBoundingClientRect().height;
    details.open = true;
    const openHeight = details.getBoundingClientRect().height;
    details.style.overflow = 'hidden';
    animation = details.animate(
      [{height: `${startHeight}px`}, {height: `${expanded ? openHeight : closedHeight}px`}],
      {duration: 1000, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards'}
    );
    animation.onfinish = () => {
      details.open = expanded;
      animation.cancel();
      animation = null;
      details.style.overflow = '';
    };
  });
});

