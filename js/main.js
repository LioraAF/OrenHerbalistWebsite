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
  const defaultStatus = formStatus?.textContent || "";

  const setFormStatus = (message) => {
    if (formStatus instanceof HTMLElement) {
      formStatus.textContent = message;
    }
  };

  const submitWithPageFallback = () => {
    setFormStatus("מעבירים לשליחה מאובטחת...");
    window.setTimeout(() => {
      emailContactForm.submit();
    }, 600);
  };

  emailContactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = emailContactForm.dataset.emailEndpoint || emailContactForm.action;

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "שולח...";
    }

    setFormStatus("שולח את הפרטים...");

    try {
      const formData = new FormData(emailContactForm);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false || result?.success === "false") {
        throw new Error(`Form submission failed with ${response.status}`);
      }

      emailContactForm.reset();
      setFormStatus("תודה, הפרטים נשלחו ונחזור אליך בהקדם.");
    } catch (error) {
      submitWithPageFallback();
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = "שליחת פרטים";
      }

      window.setTimeout(() => {
        setFormStatus(defaultStatus);
      }, 7000);
    }
  });
}

const storyMedia = document.querySelector(".story-media");

if (storyMedia) {
  const mainPhoto = storyMedia.querySelector(".story-photo-main");
  const smallPhoto = storyMedia.querySelector(".story-photo-secondary");
  const storyImages = [
    "herbs-hands.jpg",
    "herb-basket-steps.jpg",
    "herb-trimming.jpg",
    "hand-herb.jpg",
    "basket-green-herbs.jpg",
    "lavender-basket.jpg",
  ];
  const rotateEveryMs = 4000;
  const pushMs = 1000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mainIndex = 0;
  let smallIndex = 1;
  let nextIndex = 2;

  storyImages.forEach((src) => {
    const image = new Image();
    image.src = `images/story-gallery/${src}`;
  });

  const setStoryImages = () => {
    storyMedia.style.setProperty("--story-main-image", `url("../images/story-gallery/${storyImages[mainIndex]}")`);
    storyMedia.style.setProperty("--story-small-image", `url("../images/story-gallery/${storyImages[smallIndex]}")`);
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
      url("images/story-gallery/${storyImages[mainIndex]}")
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
  window.setInterval(rotateStoryImages, rotateEveryMs);
}

const productRotationFrame = document.querySelector(".product-rotation-frame");

if (productRotationFrame instanceof HTMLElement) {
  const productRotationImages = [
    "WhatsApp Image 2026-06-10 at 11.22.43 (1).jpeg",
    "WhatsApp Image 2026-06-10 at 11.22.43 (2).jpeg",
    "WhatsApp Image 2026-06-10 at 11.22.43.jpeg",
  ];
  const rotationMs = 4200;
  const enterDelayMs = 680;
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

    productRotationFrame.classList.add("is-leaving");

    window.setTimeout(() => {
      productRotationFrame.classList.add("is-entering");
      productRotationFrame.classList.remove("is-leaving");
      setProductRotationImage();

      void productRotationFrame.offsetHeight;
      productRotationFrame.classList.remove("is-entering");
    }, enterDelayMs);
  };

  setProductRotationImage();
  window.setInterval(rotateProductImage, rotationMs);
}

const workshopRotationSets = {
  adults: [
    "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36 (2).jpeg",
    "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.31 (1).jpeg",
    "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.35 (2).jpeg",
    "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36 (1).jpeg",
    "workshops-adults/WhatsApp Image 2026-06-22 at 16.36.31.jpeg",
  ],
  kids: [
    "workshops-kids/WhatsApp Image 2026-06-15 at 15.52.27.jpeg",
    "workshops-kids/WhatsApp Image 2026-06-15 at 15.52.30.jpeg",
    "workshops-kids/WhatsApp Image 2026-06-22 at 16.31.47.jpeg",
    "workshops-kids/WhatsApp Image 2026-06-22 at 16.32.24.jpeg",
    "workshops-kids/WhatsApp Image 2026-06-22 at 16.32.43.jpeg",
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
    image.src = `images/workshops-gallery/${src}`;
  });

  const setWorkshopRotationImage = () => {
    frame.style.setProperty(
      "--workshop-rotation-image",
      `url("../images/workshops-gallery/${rotationImages[imageIndex]}")`
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
      "סדנה שמתחילה ביציאה איטית ליער והיכרות עם האורן, השרף, הריח והמרקם שלו. לומדים להסתכל על העץ, להבין איפה השרף מופיע, ומה ההבדל בין איסוף אחראי לבין פגיעה מיותרת בעץ.",
      "במהלך המפגש מכירים שימושים מסורתיים של שרפים, מדברים על בטיחות ועל מינונים פשוטים, ואז עוברים לרקיחה מעשית.",
      "בסוף מכינים יחד משחת עזרה ראשונה ביתית, שמתאימה לשימוש חיצוני סביב יובש, שפשופים, עור מגורה וכוויות קלות.",
      "מתאים במיוחד לקבוצות שרוצות חוויה בטבע עם תוצר קטן ביד, הרבה ריח, והרבה תחושה של יער.",
    ],
  },
  oils: {
    label: "סדנה מעשית",
    title: "שמנים אתריים וארומתרפיה",
    transition: "pop",
    paragraphs: [
      "מפגש חושי עם עולם השמנים האתריים: מריחים, משווים, לומדים איך שמן אתרי מרגיש בגוף ואיך משתמשים בו בזהירות.",
      "מדברים על זיקוק, על משפחות ריח, על דילול נכון ועל התאמה אישית: מתי נרצה ריח מרגיע, מתי ריח שמרים אנרגיה, ומתי עדיף לבחור משהו עדין יותר.",
      "הסדנה יכולה להסתיים בהכנת תערובת אישית קטנה, כמו שמן גוף, רול־און או תרסיס פשוט, לפי אופי הקבוצה והזמן שיש.",
      "מתאימה למפגש indoor או outdoor, לימי חברה, קבוצות חברים וסדנאות שבהן רוצים הרבה חושים בלי לצאת בהכרח למסלול ליקוט.",
    ],
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
  },
  roots: {
    label: "סדנה מעשית",
    title: "ליקוט שורשי מרפא",
    transition: "pop",
    paragraphs: [
      "סדנה עונתית ושקטה יותר, סביב צמחים שהכוח שלהם נמצא גם מתחת לפני האדמה. לומדים לזהות את הצמח, להבין מתי נכון לעבוד עם שורשים, ומה המשמעות של איסוף אחראי.",
      "הדגש הוא לא רק על מה אפשר לקחת, אלא גם על מה משאירים: איפה מלקטים, כמה, מתי, ואיך מאפשרים לצמחייה להתחדש.",
      "לפי העונה והקבוצה אפשר לדבר על מרתחים, תמציות, חיזוק, עיכול, שורשיות וקשר לאדמה.",
      "מתאים לקבוצות שמבקשות מפגש קצת יותר מעמיק, איטי ומחובר לעונה.",
    ],
  },
  lecture: {
    label: "הרצאה",
    title: "צמחי מרפא, טבע ובריאות יומיומית",
    transition: "pop",
    paragraphs: [
      "אפשרות טובה לקבוצה שרוצה לפתוח חלון לעולם צמחי המרפא בלי סדנה מעשית מלאה. ההרצאה יכולה להתקיים במשרד, במרחב קהילתי, בבית אירוח או כחלק מיום העשרה.",
      "מדברים על צמחי מרפא מקומיים, עונות השנה, שימושים ביתיים פשוטים, בטיחות, מתי כדאי להיזהר, ואיך משלבים צמחים בחיי היומיום בלי להפוך את זה למורכב מדי.",
      "אפשר לשלב טעימה, הרחה או הדגמות קטנות, אבל המרכז הוא הסיפור, הידע והחיבור בין אדם, אדמה ובריאות.",
      "מתאים במיוחד לחברות, קהילות וקבוצות שרוצות תוכן עשיר ונגיש בזמן קצר יחסית.",
    ],
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
    workshopModalContent.replaceChildren(
      ...detail.paragraphs.map((paragraph) => {
        const node = document.createElement("p");
        node.textContent = paragraph;
        return node;
      })
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
  "workshops-adults/WhatsApp Image 2026-06-10 at 11.23.57 copy.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-10 at 11.23.57.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.31 (1).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.31.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.32 (1).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.32 (2).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.32 (3).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.32.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.33.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.34 (1).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.34 (2).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.34.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.35 (1).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.35 (2).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.35 (3).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.35.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36 (1).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36 (2).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36 (3).jpeg",
  "workshops-adults/WhatsApp Image 2026-06-15 at 15.52.36.jpeg",
  "workshops-adults/WhatsApp Image 2026-06-22 at 16.36.31.jpeg",
];

const workshopKidsGalleryImages = [
  "workshops-kids/WhatsApp Image 2026-06-15 at 15.52.27.jpeg",
  "workshops-kids/WhatsApp Image 2026-06-15 at 15.52.30.jpeg",
  "workshops-kids/WhatsApp Image 2026-06-22 at 16.31.47.jpeg",
  "workshops-kids/WhatsApp Image 2026-06-22 at 16.32.24.jpeg",
  "workshops-kids/WhatsApp Image 2026-06-22 at 16.32.43.jpeg",
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
  image.src = `images/workshops-gallery/${src}`;
  image.alt = "";
  image.loading = "lazy";
  return image;
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
  const loadMoreButton = document.querySelector("[data-library-load-more]");
  const countLabel = document.querySelector("[data-library-count]");
  const modal = document.querySelector("[data-reel-modal]");
  const modalClose = document.querySelector("[data-reel-modal-close]");
  const modalVideo = document.querySelector("[data-reel-modal-video]");
  const modalPlaceholder = document.querySelector("[data-reel-modal-placeholder]");
  const modalTopic = document.querySelector("[data-reel-modal-topic]");
  const modalTitle = document.querySelector("[data-reel-modal-title]");
  const modalDescription = document.querySelector("[data-reel-modal-description]");
  const modalInstagram = document.querySelector("[data-reel-modal-instagram]");
  const pageSize = 12;
  const instagramProfile = "https://www.instagram.com/orenherbalist/";
  const reelLinks = window.REEL_LINKS || {};

  // These placeholders mirror the real topic folders under /videos.
  // Add Instagram URLs in /videos/reel-links.js as real Reels are added.
  const topicDefinitions = [
    {
      key: "medicinal-plants",
      label: "צמחי מרפא",
      folder: "videos/medicinal-plants",
      count: 30,
      description: "היכרות קצרה עם צמח מרפא, איכויותיו והשימושים המסורתיים שלו.",
    },
    {
      key: "foraging",
      label: "ליקוט",
      folder: "videos/foraging",
      count: 10,
      description: "רגע מן השטח על זיהוי, עונה וליקוט אחראי שמכבד את המקום.",
    },
    {
      key: "natural-pharmacy",
      label: "רוקחות טבעית",
      folder: "videos/natural-pharmacy",
      count: 2,
      description: "הדגמה קצרה של הכנה צמחית שאפשר להכיר ולתרגל בבית.",
    },
  ];

  const reelItems = topicDefinitions.flatMap((topic, topicIndex) =>
    Array.from({ length: topic.count }, (_, itemIndex) => {
      const number = itemIndex + 1;
      const paddedNumber = String(number).padStart(2, "0");
      const seconds = 24 + ((number * 7 + topicIndex * 5) % 31);
      const id = `${topic.key}-${paddedNumber}`;

      return {
        id,
        topic: topic.key,
        topicLabel: topic.label,
        folder: topic.folder,
        title: `${topic.label} — סרטון ${paddedNumber}`,
        description: topic.description,
        duration: `00:${String(seconds).padStart(2, "0")}`,
        tone: (number + topicIndex * 2) % 6,
        videoSrc: "",
        instagramUrl: reelLinks[id] || instagramProfile,
      };
    })
  );

  let activeFilter = "all";
  let visibleCount = pageSize;

  const getFilteredItems = () => {
    if (activeFilter === "all" || activeFilter === "reels") {
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

    const play = document.createElement("span");
    play.className = "reel-play";
    play.setAttribute("aria-hidden", "true");
    play.textContent = "▶";

    const duration = document.createElement("span");
    duration.className = "reel-duration";
    duration.textContent = item.duration;

    const placeholder = document.createElement("span");
    placeholder.className = "reel-placeholder-label";
    placeholder.textContent = "מקום לסרטון";

    const copy = document.createElement("span");
    copy.className = "reel-card-copy";

    const topic = document.createElement("span");
    topic.className = "reel-card-topic";
    topic.textContent = item.topicLabel;

    const title = document.createElement("span");
    title.className = "reel-card-title";
    title.textContent = item.title;

    media.append(play, duration, placeholder);
    copy.append(topic, title);
    card.append(media, copy);
    return card;
  };

  const renderReels = () => {
    const filteredItems = getFilteredItems();
    const shownItems = filteredItems.slice(0, visibleCount);
    reelsGrid.replaceChildren(...shownItems.map(createReelCard));

    if (countLabel instanceof HTMLElement) {
      countLabel.textContent = `מציגים ${shownItems.length} מתוך ${filteredItems.length} סרטונים`;
    }

    if (loadMoreButton instanceof HTMLButtonElement) {
      loadMoreButton.hidden = shownItems.length >= filteredItems.length;
    }
  };

  const stopModalVideo = () => {
    if (modalVideo instanceof HTMLVideoElement) {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      modalVideo.load();
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

    if (modalInstagram instanceof HTMLAnchorElement) {
      modalInstagram.href = item.instagramUrl;
    }

    if (modalPlaceholder instanceof HTMLElement) {
      modalPlaceholder.className = `reel-modal-placeholder reel-tone-${item.tone}`;
      modalPlaceholder.hidden = Boolean(item.videoSrc);
    }

    if (modalVideo instanceof HTMLVideoElement && item.videoSrc) {
      modalVideo.src = item.videoSrc;
      modalVideo.hidden = false;
      modalVideo.load();
    }

    modal.showModal();
  };

  filters.forEach((filter) => {
    if (!(filter instanceof HTMLButtonElement)) {
      return;
    }

    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.libraryFilter || "all";
      visibleCount = pageSize;

      filters.forEach((option) => {
        const isActive = option === filter;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      renderReels();
    });
  });

  loadMoreButton?.addEventListener("click", () => {
    visibleCount += pageSize;
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
