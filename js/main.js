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

  const rotateStoryImages = () => {
    const swapImages = () => {
      smallIndex = mainIndex;
      mainIndex = nextIndex;
      nextIndex = (nextIndex + 1) % storyImages.length;
      setStoryImages();
    };

    if (reduceMotion) {
      swapImages();
      return;
    }

    const ghost = createStoryGhost();
    storyMedia.classList.add("is-pushing");

    window.setTimeout(() => {
      swapImages();
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
