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

const emailContactForm = document.querySelector("[data-email-form]");

if (emailContactForm instanceof HTMLFormElement) {
  const formStatus = emailContactForm.querySelector("[data-form-status]");
  const submitButton = emailContactForm.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton?.textContent || "שליחת פרטים";
  let isSubmitting = false;

  const setFormStatus = (message) => {
    if (formStatus instanceof HTMLElement) {
      formStatus.textContent = message;
    }
  };

  // Restore the form when returning from verification, including the back cache.
  window.addEventListener("pageshow", () => {
    isSubmitting = false;
    emailContactForm.removeAttribute("aria-busy");
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
    }
    setFormStatus("");
  });

  const requiredFields = emailContactForm.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
  });

  emailContactForm.addEventListener("submit", (event) => {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    requiredFields.forEach((field) => {
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? "" : "נא למלא את השדה.");
    });
    if (!emailContactForm.reportValidity()) {
      event.preventDefault();
      return;
    }

    if (emailContactForm.elements.namedItem("_honey")?.value) {
      event.preventDefault();
      return;
    }

    // FormSubmit sender copies require a normal POST with CAPTCHA enabled.
    // The provider confirms success after verification; keep the entered fields.
    isSubmitting = true;
    emailContactForm.setAttribute("aria-busy", "true");
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "מעבירים לאימות...";
    }
    setFormStatus("מעבירים לאימות ולשליחה. יש להשלים את האימות בעמוד הבא.");
  });
}

const storyMedia = document.querySelector(".story-media");

if (storyMedia) {
  const mainPhoto = storyMedia.querySelector(".story-photo-main");
  const smallPhoto = storyMedia.querySelector(".story-photo-secondary");
  const storyImages = [
    "ashwagandha-roots.webp",
    "cutting-fresh-herbs-closeup-1826.jpg",
    "desert-herb-and-hills-1792.jpg",
    "desert-herb-landscape-1793.jpg",
    "dried-herbs-in-open-bags-1961.jpg",
    "fresh-herb-harvest-basket-1794.jpg",
    "fresh-purple-flower-bundle-1830.jpg",
    "freshly-picked-yellow-flowers-1943.jpg",
    "green-herb-in-desert-ravine-1928.jpg",
    "hands-gathering-herb-stems-1836.jpg",
    "hands-harvesting-herb-stems-1825.jpg",
    "harvesting-herbs-among-garden-plants-1833.jpg",
    "harvesting-herbs-in-garden.jpeg",
    "hawthorn.jpeg",
    "herb-basket-on-harvest-table-1812.jpg",
    "herb-growing-in-rock-crevice-1931.jpg",
    "herb-harvest-hands-detail-1837.jpg",
    "herb-harvest-in-garden-closeup-1835.jpg",
    "herb-harvesting-in-garden-1831.jpg",
    "herb-harvesting-with-pruning-shears-1827.jpg",
    "herb-leaves-and-buds-1810.jpg",
    "herb-on-hillside-trail-1923.jpg",
    "herb-sprig-held-against-landscape-1939.jpg",
    "herbal-distillation-glassware-1948.jpg",
    "herbs-growing-in-rocky-valley-1921.jpg",
    "herbs-on-rocky-slope-1934.jpg",
    "myrrh.jpeg",
    "oren-at-herbal-market-stall-1816.jpg",
    "oren-holding-freshly-harvested-herbs-1824.jpg",
    "pale-purple-wildflower-1919.jpg",
    "pink-thistle-against-rock-1925.jpg",
    "pink-thistle-in-soft-light-1926.jpg",
    "pink-thistle-in-valley-1924.jpg",
    "pruning-herb-stems-1834.jpg",
    "purple-flower-bundle-wide-1832.jpg",
    "purple-flower-harvest-on-stone-1829.jpg",
    "purple-flower-harvest-upright-1828.jpg",
    "purple-flower-stems-in-vase-1795.jpg",
    "purple-thistle-closeup-1809.jpg",
    "purple-thistles-in-field-1808.jpg",
    "purple-wildflowers-in-rocky-valley-1936.jpg",
    "red-berries-in-hand-1796.jpg",
    "rounded-desert-shrub-1929.jpg",
    "scented-geranium.png",
    "small-herb-against-sunlit-rock-1937.jpg",
    "small-herb-on-rock-face-1927.jpg",
    "small-wildflower-against-rock-1920.jpg",
    "sunlight-through-herb-garden-1946.jpg",
    "sunlit-herb-and-rock-wall-1935.jpg",
    "tall-herb-beside-rock-wall-1932.jpg",
    "trailing-herb-in-sandy-soil-1930.jpg",
    "valerian.webp",
    "white-wildflower-cluster-1938.jpg",
    "wild-herb-and-boulder-in-sunlight-1914.jpg",
    "wild-herb-beside-pale-boulder-1913.jpg",
    "wild-herb-beside-valley-rocks-1922.jpg",
    "wild-herb-on-rock.jpeg",
    "wild-herb-on-rocky-path-1791.jpg",
    "wild-herb-overlooking-valley-1933.jpg",
    "wild-lettuce.jpeg",
    "yellow-flower-harvest-bowl-1941.jpg",
    "yellow-flower-harvest-closeup-1940.jpg",
    "yellow-flowering-herb-in-garden-1944.jpg",
    "yellow-flowering-herb-under-tree-1945.jpg",
    "yellow-flowers-in-white-bowl-1942.jpg",
    "yellow-wildflowers-on-path-1807.jpg",
  ];
  for (let index = storyImages.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [storyImages[index], storyImages[randomIndex]] = [storyImages[randomIndex], storyImages[index]];
  }

  const rotateEveryMs = 6000;
  const pushMs = 1500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mainIndex = 0;
  let smallIndex = 1;
  let nextIndex = 2;

  storyImages.forEach((src) => {
    const image = new Image();
    image.src = `images/home-gallery/${src}`;
  });

  const setStoryImages = () => {
    storyMedia.style.setProperty("--story-main-image", `url("../images/home-gallery/${storyImages[mainIndex]}")`);
    storyMedia.style.setProperty("--story-small-image", `url("../images/home-gallery/${storyImages[smallIndex]}")`);
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
      url("images/home-gallery/${storyImages[mainIndex]}")
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

if (productRotationFrame instanceof HTMLElement) {
  const productRotationImages = [
    "herbal-bottles-at-market.jpeg",
    "herbal-extract-bottle-display.jpeg",
    "herbal-balm-jar-display.jpeg",
    "herbal-products-overhead-display-1798.jpg",
    "herbal-gift-basket-with-price-1800.jpg",
    "herbal-market-stall-wide-1801.jpg",
    "herbal-market-stall-close-1802.jpg",
    "herbal-oils-and-jars-display-1803.jpg",
    "herbal-balm-jar-closeup-1804.jpg",
    "herbal-oil-and-spray-bottles-1805.jpg",
    "herbal-balms-and-extracts-display-1806.jpg",
  ];
  const rotationMs = 4200;
  const fadeMs = 1500;
  const overlapMs = 600;
  const enterDelayMs = fadeMs - overlapMs;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let productImageIndex = 0;

  productRotationImages.forEach((src) => {
    const image = new Image();
    image.src = `images/products-gallery/${src}`;
  });

  const setProductRotationImage = () => {
    productRotationFrame.style.setProperty(
      "--product-rotation-image",
      `url("../images/products-gallery/${productRotationImages[productImageIndex]}")`
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
  adults: [
    "workshops/herbal-workshop-in-meadow.jpeg",
    "workshops/mushroom-caps-in-hand.jpeg",
    "workshops/mushroom-cluster-in-hand.jpeg",
    "workshops/outdoor-workshop-circle.jpeg",
    "workshops/harvesting-herbs-in-garden.jpeg",
  ],
  kids: [
    "workshops-kids/children-herb-workshop-circle.jpeg",
    "workshops-kids/children-outdoor-herbal-activity.jpeg",
    "workshops-kids/children-plant-identification-game.jpeg",
    "workshops-kids/children-planting-herb-garden.jpeg",
    "workshops-kids/child-arranging-flowers.jpeg",
  ],
};

document.querySelectorAll("[data-workshop-rotation]").forEach((frame) => {
  if (!(frame instanceof HTMLElement)) {
    return;
  }

  const rotationName = frame.dataset.workshopRotation;
  const rotationImages = workshopRotationSets[rotationName] || [];

  if (!rotationImages.length) {
    return;
  }

  const rotationMs = 4600;
  const enterDelayMs = 520;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let imageIndex = 0;

  rotationImages.forEach((src) => {
    const image = new Image();
    image.src = `images/${src}`;
  });

  const setWorkshopRotationImage = () => {
    frame.style.setProperty(
      "--workshop-rotation-image",
      `url("../images/${rotationImages[imageIndex]}")`
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

const workshopAdultGalleryImages = [
  "workshops/forest-workshop-herbal-preparation.jpeg",
  "workshops/forest-workshop-group-circle.jpeg",
  "workshops/mushroom-caps-in-hand.jpeg",
  "workshops/oren-explaining-forest-mushrooms.jpeg",
  "workshops/mushroom-in-hand.jpeg",
  "workshops/mushroom-growing-in-pine-needles.jpeg",
  "workshops/forest-mushroom-closeup.jpeg",
  "workshops/oren-with-mushroom-basket.jpeg",
  "workshops/mushroom-stem-in-hand.jpeg",
  "workshops/hands-holding-foraged-mushrooms.jpeg",
  "workshops/oren-presenting-foraged-mushrooms.jpeg",
  "workshops/foraged-mushrooms-in-hands.jpeg",
  "workshops/wild-herb-on-rock.jpeg",
  "workshops/mushroom-cluster-in-hand.jpeg",
  "workshops/herbal-extracts-in-basket.jpeg",
  "workshops/oren-foraging-with-basket.jpeg",
  "workshops/outdoor-workshop-circle.jpeg",
  "workshops/herbal-workshop-in-meadow.jpeg",
  "workshops/oren-foraging-in-forest.jpeg",
  "workshops/oren-leading-outdoor-workshop.jpeg",
  "workshops/harvesting-herbs-in-garden.jpeg",
];

const workshopKidsGalleryImages = [
  "workshops-kids/children-herb-workshop-circle.jpeg",
  "workshops-kids/children-outdoor-herbal-activity.jpeg",
  "workshops-kids/children-plant-identification-game.jpeg",
  "workshops-kids/children-planting-herb-garden.jpeg",
];

const workshopGallerySets = {
  adults: workshopAdultGalleryImages,
  kids: workshopKidsGalleryImages,
};

const shuffleImages = (images) => {
  const shuffled = [...images];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const createGalleryImage = (src) => {
  const image = document.createElement("img");
  image.src = `images/${src}`;
  image.alt = "";
  image.loading = "lazy";
  const frame = document.createElement("span");
  frame.className = "gallery-photo";
  frame.append(image);
  return frame;
};

const getTrackGap = (track) => {
  const trackStyle = window.getComputedStyle(track);
  const columnGap = parseFloat(trackStyle.columnGap);
  return Number.isFinite(columnGap) ? columnGap : parseFloat(trackStyle.gap) || 0;
};

document.querySelectorAll("[data-gallery-strip]").forEach((track) => {
  if (!(track instanceof HTMLElement)) {
    return;
  }

  const source = track.dataset.galleryStrip || "adults";
  const sourceImages = workshopGallerySets[source] || workshopAdultGalleryImages;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gallery = track.closest(".gallery-strip");
  const controls = gallery ? gallery.querySelectorAll("[data-gallery-control]") : [];
  let movingImage = null;
  let movingDirection = null;
  let fallbackTimer = 0;

  shuffleImages(sourceImages).forEach((src) => {
    track.append(createGalleryImage(src));
  });

  if (sourceImages.length < 2) {
    controls.forEach((control) => {
      if (control instanceof HTMLButtonElement) {
        control.disabled = true;
      }
    });

    return;
  }

  const finishMove = () => {
    if (!movingImage) {
      return;
    }

    window.clearTimeout(fallbackTimer);

    if (movingDirection === "next") {
      track.classList.add("is-resetting");
      track.append(movingImage);
      track.classList.remove("is-gliding");

      void track.offsetHeight;
      track.classList.remove("is-resetting");
    }

    movingImage = null;
    movingDirection = null;
  };

  const moveGallery = (direction = "next") => {
    if (movingImage) {
      return;
    }

    const edgeImage = direction === "prev" ? track.lastElementChild : track.firstElementChild;

    if (!(edgeImage instanceof HTMLElement)) {
      return;
    }

    if (reduceMotion) {
      if (direction === "prev") {
        track.prepend(edgeImage);
      } else {
        track.append(edgeImage);
      }

      return;
    }

    const stepDistance = edgeImage.getBoundingClientRect().width + getTrackGap(track);
    movingImage = edgeImage;
    movingDirection = direction;
    track.style.setProperty("--gallery-step-distance", `${stepDistance}px`);

    if (direction === "prev") {
      track.classList.add("is-resetting", "is-gliding");
      track.prepend(edgeImage);

      void track.offsetHeight;
      track.classList.remove("is-resetting");

      window.requestAnimationFrame(() => {
        track.classList.remove("is-gliding");
      });
    } else {
      track.classList.add("is-gliding");
    }

    fallbackTimer = window.setTimeout(finishMove, 1200);
  };

  track.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") {
      finishMove();
    }
  });

  controls.forEach((control) => {
    if (!(control instanceof HTMLButtonElement)) {
      return;
    }

    control.addEventListener("click", () => {
      moveGallery(control.dataset.galleryControl === "prev" ? "prev" : "next");
    });
  });

  if (!reduceMotion) {
    window.setInterval(() => moveGallery("next"), 4000);
  }
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
  };

  const reelItems = [
    {
      id: "5XaKIqrVzQs",
      topic: "medicinal-plants",
      title: "סמבוק שחור",
      description: "פרץ מעלעלים ואורן מציגים את הסמבוק השחור ומספרים על השימושים המסורתיים המיוחסים לו.",
      thumbnail: "https://i.ytimg.com/vi/5XaKIqrVzQs/maxres1.jpg",
    },
    {
      id: "baCel93LGAM",
      topic: "medicinal-plants",
      title: "בוצין מפורץ",
      description: "היכרות מן השטח עם הבוצין המפורץ והשימושים המסורתיים שנקשרו לצמח.",
      thumbnail: "https://i.ytimg.com/vi/baCel93LGAM/maxres3.jpg",
    },
    {
      id: "A0LhLF-EHwU",
      topic: "medicinal-plants",
      title: "אזוב — הזעתר המקומי",
      description: "אורן מספר על האזוב, המוכר גם כזעתר, ועל מקומו במסורת הצמחים המקומית.",
      thumbnail: "https://i.ytimg.com/vi/A0LhLF-EHwU/maxres2.jpg",
    },
    {
      id: "1dSl-rc-K5Y",
      topic: "medicinal-plants",
      title: "ולריאנה",
      description: "אורן מציג את צמח הוולריאנה ומשתף בידע מסורתי על איכויותיו והשימוש בו.",
      thumbnail: "https://i.ytimg.com/vi/1dSl-rc-K5Y/maxres2.jpg",
    },
    {
      id: "ie1XCKPkTT4",
      topic: "foraging",
      title: "שרף האורן",
      description: "מפגש ביער עם שרף האורן ועם הידע המסורתי שנאסף סביבו.",
      thumbnail: "https://i.ytimg.com/vi/ie1XCKPkTT4/maxres1.jpg",
    },
    {
      id: "77K_0Jfd-wk",
      topic: "foraging",
      title: "חרחבינה מכחילה",
      description: "אורן יוצא לליקוט חורפי ומציג את החרחבינה המכחילה בסביבתה הטבעית.",
      thumbnail: "https://i.ytimg.com/vi/77K_0Jfd-wk/maxres2.jpg",
    },
    {
      id: "dW3hDGr-1T8",
      topic: "foraging",
      title: "קומפרי ביער",
      description: "מפגש עם צמח הקומפרי במהלך יציאה ליער וסיפור על השימוש המסורתי בו.",
      thumbnail: "https://i.ytimg.com/vi/dW3hDGr-1T8/maxres3.jpg",
    },
    {
      id: "9LLRsOUS_Cs",
      topic: "foraging",
      title: "כוכבית",
      description: "ליקוט כוכבית בקדיתא והיכרות עם הצמח ועם סביבת הגידול שלו.",
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

  let activeFilter = "all";

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
    card.append(media, copy);
    return card;
  };

  const renderReels = () => {
    const filteredItems = getFilteredItems();
    reelsGrid.replaceChildren(...filteredItems.map(createReelCard));

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
      modalLink.href = item.youtubeUrl;
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

      filters.forEach((option) => {
        const isActive = option === filter;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      renderReels();
    });
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
  const giftPhotos = [
    'herbal-gift-set-in-dappled-light.jpg',
    'herbal-gift-box-overhead-1951.jpg',
    'wrapped-herbal-gift-basket-1952.jpg',
    'herbal-gift-basket-with-price-1800.jpg',
    'herbal-gift-set-on-bench-1950.jpg',
  ];
  let giftPhotoIndex = 0;
  let giftSliding = false;
  const giftSlideLayer = () => {
    const layer = giftPhoto.cloneNode(false);
    layer.removeAttribute('role');
    layer.removeAttribute('aria-label');
    layer.setAttribute('aria-hidden', 'true');
    Object.assign(layer.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', margin: '0', border: '0', boxShadow: 'none', transform: 'none'});
    return layer;
  };
  giftPhoto.querySelectorAll('[data-gift-step]').forEach((button) => {
    button.addEventListener('click', () => {
      if (giftSliding) return;
      const outgoing = giftSlideLayer();
      giftPhotoIndex = (giftPhotoIndex + Number(button.dataset.giftStep) + giftPhotos.length) % giftPhotos.length;
      giftPhoto.dataset.photo = giftPhotos[giftPhotoIndex];
      giftPhoto.style.backgroundImage = `linear-gradient(rgba(41, 53, 31, 0.05), rgba(239, 229, 210, 0.07)), url("images/gifts/${giftPhotos[giftPhotoIndex]}")`;
      giftPhoto.querySelector('.gift-photo-status').textContent = `תמונה ${giftPhotoIndex + 1} מתוך ${giftPhotos.length}`;
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

