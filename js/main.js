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
  const pushMs = 650;
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
      ghost?.classList.add("is-settling");

      window.setTimeout(() => {
        ghost?.remove();
      }, pushMs);
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
  let movingImage = null;
  let fallbackTimer = 0;

  shuffleImages(sourceImages).forEach((src) => {
    track.append(createGalleryImage(src));
  });

  if (reduceMotion || sourceImages.length < 2) {
    return;
  }

  const finishMove = () => {
    if (!movingImage) {
      return;
    }

    window.clearTimeout(fallbackTimer);
    track.classList.add("is-resetting");
    track.append(movingImage);
    track.classList.remove("is-gliding");

    void track.offsetHeight;
    track.classList.remove("is-resetting");
    movingImage = null;
  };

  track.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") {
      finishMove();
    }
  });

  window.setInterval(() => {
    if (movingImage) {
      return;
    }

    const firstImage = track.firstElementChild;

    if (!(firstImage instanceof HTMLElement)) {
      return;
    }

    const stepDistance = firstImage.getBoundingClientRect().width + getTrackGap(track);
    movingImage = firstImage;
    track.style.setProperty("--gallery-step-distance", `${stepDistance}px`);
    track.classList.add("is-gliding");
    fallbackTimer = window.setTimeout(finishMove, 1200);
  }, 4000);
});
