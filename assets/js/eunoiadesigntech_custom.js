
/* =====================================================
   EUNOIA DESIGN TECH
   COMPLETE GSAP + LENIS CUSTOM JAVASCRIPT
===================================================== */


/* =====================================================
   1. GSAP + LENIS INITIALIZATION
===================================================== */

(function () {

    if (!window.gsap || !window.ScrollTrigger) {
        console.error("GSAP or ScrollTrigger is not loaded.");
        return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    let lenis = null;

    if (typeof window.Lenis !== "undefined") {

        lenis = new window.Lenis({
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 1,
            lerp: 0.1,
            anchors: true
        });

        // Sync Lenis with ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // GSAP ticker integration
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

    }


    /* =================================================
       2. SERVICES HEADING ANIMATION
    ================================================= */

    const servicesHeading = document.querySelector(
        ".services-heading"
    );

    if (servicesHeading) {

        gsap.from(servicesHeading.children, {

            y: 60,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",

            scrollTrigger: {
                trigger: servicesHeading,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }

        });

    }


    /* =================================================
       3. SERVICES BLOCK ANIMATION
    ================================================= */

    const serviceBlocks = gsap.utils.toArray(
        ".service-block"
    );

    serviceBlocks.forEach((block) => {

        const elements = block.querySelectorAll(
            ".service-number, .service-content, .service-image, .service-arrow"
        );

        if (!elements.length) return;

        gsap.from(elements, {

            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.out",

            scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }

        });

    });


    /* =================================================
       4. PORTFOLIO PARALLAX ANIMATION
    ================================================= */

    function initParallaxPortfolio() {

        const portfolioSection = document.querySelector(
            ".parallax-portfolio"
        );

        if (!portfolioSection) return;

        if (portfolioSection.dataset.animationReady === "true") {
            return;
        }

        portfolioSection.dataset.animationReady = "true";

        // Reduced motion accessibility
        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        // Image parallax
        const projectImages = portfolioSection.querySelectorAll(
            ".parallax-image-inner img"
        );

        projectImages.forEach((image) => {

            gsap.fromTo(
                image,

                {
                    scale: 1.15,
                    yPercent: 8
                },

                {
                    scale: 1,
                    yPercent: -8,
                    ease: "none",

                    scrollTrigger: {
                        trigger: image.closest(".parallax-project-image") || image,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );

            if (!image.complete) {

                image.addEventListener("load", () => {
                    ScrollTrigger.refresh();
                }, { once: true });

            }

        });


        // Project details reveal
        const projectCards = portfolioSection.querySelectorAll(
            ".parallax-project"
        );

        projectCards.forEach((card) => {

            const projectInfo = card.querySelector(
                ".parallax-project-info"
            );

            if (!projectInfo) return;

            gsap.from(projectInfo, {

                y: 45,
                autoAlpha: 0,
                duration: 1,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }

            });

        });


        // Portfolio heading reveal
        const heading = portfolioSection.querySelector(
            ".portfolio-heading-row"
        );

        if (heading) {

            gsap.from(heading, {

                y: 60,
                autoAlpha: 0,
                duration: 1.2,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: heading,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }

            });

        }

    }

    initParallaxPortfolio();


    /* =================================================
       5. ABOUT SECTION WORD HIGHLIGHT
    ================================================= */

    const aboutSection = document.querySelector(
        ".about-section"
    );

    const aboutHeading = document.querySelector(
        ".about-section .about-highlight"
    );

    if (aboutSection && aboutHeading) {

        const aboutText = aboutHeading.textContent.trim();

        const aboutWords = aboutText.split(/\s+/);

        aboutHeading.innerHTML = aboutWords.map((word) => {
            return `<span class="highlight-word">${word}</span>`;
        }).join(" ");

        const aboutWordElements = aboutHeading.querySelectorAll(
            ".highlight-word"
        );

        gsap.set(aboutWordElements, {
            color: "#454545"
        });

        gsap.to(aboutWordElements, {

            color: "#ffffff",
            stagger: 0.1,
            ease: "none",

            scrollTrigger: {
                trigger: aboutSection,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                invalidateOnRefresh: true
            }

        });

    }


    /* =================================================
       6. MARQUEE ANIMATION
    ================================================= */

    function initMarquee() {

        const marquee = document.querySelector(
            ".marquee-track"
        );

        if (!marquee) return;

        if (marquee.dataset.marqueeReady === "true") {
            return;
        }

        marquee.dataset.marqueeReady = "true";

        gsap.to(marquee, {

            xPercent: -50,
            duration: 25,
            ease: "none",
            repeat: -1

        });

    }

    initMarquee();


    /* =================================================
       7. CLIENT BRAND FADE ANIMATION
    ================================================= */

    (function () {

        const brandItems = gsap.utils.toArray(
            ".client-brands .at-brand-item.at_fade_anim"
        );

        if (!brandItems.length) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        gsap.fromTo(

            brandItems,

            {
                y: 45,
                autoAlpha: 0
            },

            {
                y: 0,
                autoAlpha: 1,
                duration: 0.9,
                stagger: 0.15,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".client-brands-grid",
                    start: "top 85%",
                    once: true
                }

            }

        );

    })();



/* ==========================================
   EUNOIA TESTIMONIAL AUTO SLIDER
   Infinite Loop + Hover Pause
========================================== */

(function () {

    if (!window.gsap) return;

    const section = document.querySelector(
        ".eunoia-testimonial-section"
    );

    if (!section) return;

    const stack = section.querySelector(
        ".eunoia-testimonial-stack"
    );

    const cards = Array.from(
        section.querySelectorAll(".eunoia-testimonial-card")
    );

    const current = section.querySelector(
        ".eunoia-testimonial-current"
    );

    const total = section.querySelector(
        ".eunoia-testimonial-total"
    );

    if (!stack || cards.length < 2) return;

    if (section.dataset.autoSliderReady === "true") return;

    section.dataset.autoSliderReady = "true";

    const count = cards.length;

    let activeIndex = 0;
    let isAnimating = false;
    let autoplay;

    const autoplayDelay = 3500;

    // Update total counter
    if (total) {
        total.textContent = String(count).padStart(2, "0");
    }

    // Update card number
    cards.forEach((card, index) => {

        const label = card.querySelector(
            ".eunoia-testimonial-top > span:first-child"
        );

        if (label) {
            label.textContent =
                String(index + 1).padStart(2, "0") +
                " / " +
                String(count).padStart(2, "0");
        }

    });

    // Initial cards
    gsap.set(cards, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        autoAlpha: 0,
        y: 30,
        zIndex: 1,
        pointerEvents: "none"
    });

    gsap.set(cards[0], {
        autoAlpha: 1,
        y: 0,
        zIndex: 2,
        pointerEvents: "auto"
    });

    function updateCounter() {

        if (current) {
            current.textContent =
                String(activeIndex + 1).padStart(2, "0");
        }

    }

    updateCounter();

    // Change slide
    function nextSlide() {

        if (isAnimating) return;

        isAnimating = true;

        const previousCard = cards[activeIndex];

        activeIndex = (activeIndex + 1) % count;

        const nextCard = cards[activeIndex];

        gsap.set(nextCard, {
            autoAlpha: 0,
            y: 35,
            zIndex: 3,
            pointerEvents: "auto"
        });

        gsap.set(previousCard, {
            zIndex: 2,
            pointerEvents: "none"
        });

        const timeline = gsap.timeline({

            onComplete: function () {

                gsap.set(previousCard, {
                    autoAlpha: 0,
                    y: 0,
                    zIndex: 1
                });

                isAnimating = false;

            }

        });

        timeline.to(previousCard, {
            autoAlpha: 0,
            y: -25,
            duration: 1,
            ease: "power2.in"
        }, 0);

        timeline.to(nextCard, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, 0.1);

        updateCounter();

    }

    // Start autoplay
    function startAutoplay() {

        stopAutoplay();

        autoplay = setInterval(function () {
            nextSlide();
        }, autoplayDelay);

    }

    // Stop autoplay
    function stopAutoplay() {

        if (autoplay) {
            clearInterval(autoplay);
            autoplay = null;
        }

    }

    // Pause when hovering over testimonial cards
    stack.addEventListener("mouseenter", stopAutoplay);

    // Resume when mouse leaves
    stack.addEventListener("mouseleave", startAutoplay);

    // Touch devices
    stack.addEventListener("touchstart", stopAutoplay, {
        passive: true
    });

    stack.addEventListener("touchend", startAutoplay, {
        passive: true
    });

    // Start automatic slider
    startAutoplay();

})();



    /* =================================================
       9. REFRESH SCROLLTRIGGER
    ================================================= */

    window.addEventListener("load", function () {

        ScrollTrigger.refresh();

    });

    window.addEventListener("resize", function () {

        ScrollTrigger.refresh();

    });

    // Refresh after all animations are registered
    requestAnimationFrame(function () {
        ScrollTrigger.refresh();
    });

})();



/* =========================================
   EUNOIA HERO - AUTOMATIC ROTATING HEADINGS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const hero = document.querySelector(".eunoia-hero-section");

    if (!hero || typeof gsap === "undefined") return;

    const title = hero.querySelector(".eunoia-hero-title");
    const background = hero.querySelector(".eunoia-hero-bg");
    const eyebrow = hero.querySelector(".eunoia-hero-eyebrow");
    const description = hero.querySelector(".eunoia-hero-description");
    const buttons = hero.querySelectorAll(".eunoia-hero-btn");
    const bottom = hero.querySelector(".eunoia-hero-bottom");
    const scrollLine = hero.querySelector(".eunoia-hero-scroll-line");

    if (!title) return;

    // Three rotating headings
    const heroHeadings = [
        "We Build Digital Experiences That Move Businesses Forward.",
        "We Turn Creative Ideas Into Powerful Digital Solutions.",
        "We Design Websites That Inspire, Engage & Convert."
    ];

    let currentHeading = 0;
    let headingTimer;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Split heading into words
    function createHeadingWords(text) {

        title.innerHTML = text
            .split(/\s+/)
            .map(word =>
                `<span class="eunoia-hero-word" aria-hidden="true">${word}</span>`
            )
            .join(" ");

        title.setAttribute("aria-label", text);

        return title.querySelectorAll(".eunoia-hero-word");
    }

    // Initial states
    gsap.set(
        [eyebrow, description, buttons, bottom],
        { opacity: 0, y: 20 }
    );

    if (background) {
        gsap.set(background, { scale: 1.12 });
    }

    // First heading
    const firstWords = createHeadingWords(heroHeadings[0]);

    if (reduceMotion) {

        gsap.set(
            [eyebrow, description, buttons, bottom, title],
            { opacity: 1, y: 0 }
        );

        gsap.set(firstWords, { opacity: 1, y: 0 });

    } else {

        // Entrance animation
        const heroTimeline = gsap.timeline();

        heroTimeline
            .to(eyebrow, {
                opacity: 1,
                y: 0,
                duration: 0.7
            })
            .fromTo(firstWords,
                {
                    opacity: 0,
                    y: 40,
                    rotateX: -20
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.07,
                    ease: "power3.out"
                },
                "-=0.2"
            )
            .to(description, {
                opacity: 1,
                y: 0,
                duration: 0.7
            }, "-=0.3")
            .to(buttons, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15
            }, "-=0.3")
            .to(bottom, {
                opacity: 1,
                y: 0,
                duration: 0.7
            }, "-=0.2");

        if (background) {
            heroTimeline.to(background, {
                scale: 1,
                duration: 2.5,
                ease: "power2.out"
            }, 0);
        }

        // Automatic heading rotation
        function rotateHeading() {

            gsap.to(title, {
                opacity: 0,
                y: -18,
                duration: 0.45,
                ease: "power2.in",
                onComplete: function () {

                    currentHeading =
                        (currentHeading + 1) % heroHeadings.length;

                    const words = createHeadingWords(
                        heroHeadings[currentHeading]
                    );

                    gsap.set(title, {
                        opacity: 1,
                        y: 0
                    });

                    gsap.fromTo(words,
                        {
                            opacity: 0,
                            y: 35,
                            rotateX: -20
                        },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            duration: 0.7,
                            stagger: 0.07,
                            ease: "power3.out"
                        }
                    );

                }
            });

            headingTimer = gsap.delayedCall(4.5, rotateHeading);
        }

        // Start after first heading appears
        headingTimer = gsap.delayedCall(6, rotateHeading);

        // Background parallax
        if (background && typeof ScrollTrigger !== "undefined") {

            gsap.to(background, {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });

        }

        // Scroll indicator
        if (scrollLine) {
            gsap.to(scrollLine, {
                scaleX: 0.35,
                duration: 0.9,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }

    }

});