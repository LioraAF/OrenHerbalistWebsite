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

    storyMedia.classList.add("is-pushing");

    window.setTimeout(() => {
      swapImages();
      storyMedia.classList.remove("is-pushing");
    }, pushMs);
  };

  setStoryImages();
  window.setInterval(rotateStoryImages, rotateEveryMs);
}
