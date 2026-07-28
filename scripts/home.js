class HomeRevealController {
    constructor() {
        this.elements = Array.from(document.querySelectorAll(".reveal"));
        this.observer = null;
    }

    initialise() {
        if (!("IntersectionObserver" in window)) {
            this.showAll();
            return;
        }

        this.observer = new IntersectionObserver(
            entries => this.handleEntries(entries),
            {
                rootMargin: "-6% 0px -14% 0px",
                threshold: 0.2
            }
        );

        this.elements.forEach(element => this.observer.observe(element));
    }

    handleEntries(entries) {
        entries.forEach(entry => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }

    showAll() {
        this.elements.forEach(element => element.classList.add("is-visible"));
    }
}

class HomeStoryController {
    constructor() {
        this.story = document.querySelector(".home-story");
        this.frameRequested = false;
    }

    initialise() {
        if (!this.story) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            this.showIntroduction();
            return;
        }

        this.update();
        window.addEventListener("scroll", () => this.requestUpdate(), { passive: true });
        window.addEventListener("resize", () => this.requestUpdate());
    }

    requestUpdate() {
        if (this.frameRequested) {
            return;
        }

        this.frameRequested = true;
        window.requestAnimationFrame(() => {
            this.update();
            this.frameRequested = false;
        });
    }

    update() {
        const availableScroll = this.story.offsetHeight - window.innerHeight;
        if (availableScroll <= 0) {
            this.showIntroduction();
            return;
        }

        const progress = Math.min(
            1,
            Math.max(0, -this.story.getBoundingClientRect().top / availableScroll)
        );
        const transitionProgress = Math.min(1, Math.max(0, (progress - 0.2) / 0.55));
        const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);

        this.story.style.setProperty("--hero-opacity", String(1 - easedProgress));
        this.story.style.setProperty("--hero-shift", `${easedProgress * -24}px`);
        this.story.style.setProperty("--intro-opacity", String(easedProgress));
        this.story.style.setProperty("--intro-shift", `${(1 - easedProgress) * 56}px`);
        this.story.classList.toggle("is-intro-active", easedProgress > 0.55);
    }

    showIntroduction() {
        this.story.style.setProperty("--hero-opacity", "0");
        this.story.style.setProperty("--hero-shift", "0px");
        this.story.style.setProperty("--intro-opacity", "1");
        this.story.style.setProperty("--intro-shift", "0px");
        this.story.classList.add("is-intro-active");
    }
}

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const revealController = new HomeRevealController();
    const storyController = new HomeStoryController();
    revealController.initialise();
    storyController.initialise();
});
