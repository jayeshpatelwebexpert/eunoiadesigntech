
/* =====================================================
   ALTIVIO STUDIO
   COMPLETE GSAP + LENIS CUSTOM JAVASCRIPT
   Updated | Safe Selectors | Responsive
===================================================== */

(function () {
    "use strict";

    /* =====================================================
       1. GLOBAL HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const isReducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, {
                once: true
            });
        } else {
            callback();
        }
    }

    ready(function () {

        if (!window.gsap || !window.ScrollTrigger) {
            console.error("GSAP or ScrollTrigger is not loaded.");
            return;
        }

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        /* =====================================================
           2. LENIS INITIALIZATION
        ===================================================== */

        if (!window.lenis && typeof window.Lenis !== "undefined") {

            window.lenis = new window.Lenis({
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1,
                lerp: 0.1,
                anchors: true
            });

            window.lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add(function (time) {
                if (window.lenis) {
                    window.lenis.raf(time * 1000);
                }
            });

            gsap.ticker.lagSmoothing(0);
        }

        /* =====================================================
           3. COMMON REVEAL FUNCTION
        ===================================================== */

        function reveal(target, trigger, options = {}) {

            if (!target || !trigger || isReducedMotion()) {
                return;
            }

            const animationSettings = {
                autoAlpha: 1,
                y: 0,
                duration: options.duration ?? 0.9,
                delay: options.delay ?? 0,
                stagger: options.stagger ?? 0,
                ease: options.ease ?? "power3.out",
                scrollTrigger: {
                    trigger: trigger,
                    start: options.start ?? "top 85%",
                    once: options.once ?? true
                }
            };

            if (
                typeof options.clearProps === "string" ||
                Array.isArray(options.clearProps)
            ) {
                animationSettings.clearProps = options.clearProps;
            }

            gsap.fromTo(
                target,
                {
                    autoAlpha: 0,
                    y: options.fromY ?? 35
                },
                animationSettings
            );
        }

        /* =====================================================
           4. PORTFOLIO PARALLAX ANIMATION
        ===================================================== */

        function initParallaxPortfolio() {

            const section = $(".parallax-portfolio");

            if (!section || section.dataset.animationReady === "true") {
                return;
            }

            section.dataset.animationReady = "true";

            if (isReducedMotion()) return;

            const projectImages = $$(".parallax-image-inner img", section);

            projectImages.forEach(function (image) {

                const trigger =
                    image.closest(".parallax-project-image") || image;

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
                            trigger: trigger,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1
                        }
                    }
                );

                if (!image.complete) {
                    image.addEventListener("load", function () {
                        ScrollTrigger.refresh();
                    }, { once: true });
                }
            });

            const projectCards = $$(".parallax-project", section);

            projectCards.forEach(function (card) {

                const projectInfo = $(".parallax-project-info", card);

                if (!projectInfo) return;

                reveal(projectInfo, card, {
                    fromY: 45,
                    duration: 1,
                    once: false
                });
            });

            const heading = $(".portfolio-heading-row", section);

            if (heading) {
                reveal(heading, heading, {
                    fromY: 60,
                    duration: 1.2,
                    once: false
                });
            }
        }

        initParallaxPortfolio();


        /* =====================================================
           5. ABOUT SECTION WORD HIGHLIGHT
        ===================================================== */

        const aboutSection = $(".about-section");

        const aboutHeading = aboutSection
            ? $(".about-highlight", aboutSection)
            : null;

        if (aboutSection && aboutHeading && !isReducedMotion()) {

            if (aboutHeading.dataset.wordsReady !== "true") {

                aboutHeading.dataset.wordsReady = "true";

                const originalText = aboutHeading.textContent.trim();
                const words = originalText.split(/\s+/);

                aboutHeading.innerHTML = words.map(function (word) {
                    const span = document.createElement("span");
                    span.className = "highlight-word";
                    span.textContent = word;
                    return span.outerHTML;
                }).join(" ");

                const wordElements = $$(".highlight-word", aboutHeading);

                if (wordElements.length) {

                    gsap.set(wordElements, {
                        color: "#454545"
                    });

                    gsap.to(wordElements, {
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
            }
        }


        /* =====================================================
           6. MARQUEE ANIMATION
        ===================================================== */

        function initMarquee() {

            const marquee = $(".marquee-track");

            if (!marquee || marquee.dataset.marqueeReady === "true") {
                return;
            }

            marquee.dataset.marqueeReady = "true";

            if (isReducedMotion()) return;

            gsap.to(marquee, {
                xPercent: -50,
                duration: 25,
                ease: "none",
                repeat: -1
            });
        }

        initMarquee();


        /* =====================================================
           7. CLIENT BRAND FADE ANIMATION
        ===================================================== */

        (function () {

            if (isReducedMotion()) return;

            const brandItems = $$(".altivio-client-logo");
            const brandGrid = $(".altivio-client-grid");

            if (!brandItems.length || !brandGrid) return;

            reveal(brandItems, brandGrid, {
                fromY: 45,
                duration: 0.9,
                stagger: 0.15
            });

        })();


        /* =====================================================
           8. TESTIMONIAL AUTO SLIDER
        ===================================================== */

        (function () {

            const section = $(".altivio-testimonial-section");

            if (!section || section.dataset.autoSliderReady === "true") {
                return;
            }

            const stack = $(".altivio-testimonial-stack", section);
            const cards = $$(".altivio-testimonial-card", section);
            const current = $(".altivio-testimonial-current", section);
            const total = $(".altivio-testimonial-total", section);

            if (!stack || cards.length < 2) return;

            section.dataset.autoSliderReady = "true";

            const count = cards.length;
            let activeIndex = 0;
            let isAnimating = false;
            let autoplay = null;

            const autoplayDelay = 3500;

            if (total) {
                total.textContent = String(count).padStart(2, "0");
            }

            cards.forEach(function (card, index) {

                const label = $(".altivio-testimonial-top > span:first-child", card);

                if (label) {
                    label.textContent =
                        String(index + 1).padStart(2, "0") +
                        " / " +
                        String(count).padStart(2, "0");
                }
            });

            if (isReducedMotion()) {
                cards.forEach(function (card, index) {
                    card.style.position = "relative";
                    card.style.display = index === 0 ? "block" : "none";
                });

                if (current) current.textContent = "01";
                return;
            }

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
                            zIndex: 1,
                            pointerEvents: "none"
                        });

                        isAnimating = false;
                    }
                });

                timeline.to(previousCard, {
                    autoAlpha: 0,
                    y: -25,
                    duration: 0.8,
                    ease: "power2.in"
                }, 0);

                timeline.to(nextCard, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, 0.1);

                updateCounter();
            }

            function stopAutoplay() {
                if (autoplay) {
                    clearInterval(autoplay);
                    autoplay = null;
                }
            }

            function startAutoplay() {
                stopAutoplay();

                autoplay = setInterval(function () {
                    nextSlide();
                }, autoplayDelay);
            }

            stack.addEventListener("mouseenter", stopAutoplay);
            stack.addEventListener("mouseleave", startAutoplay);

            stack.addEventListener("touchstart", stopAutoplay, {
                passive: true
            });

            stack.addEventListener("touchend", startAutoplay, {
                passive: true
            });

            updateCounter();
            startAutoplay();

        })();


        /* =====================================================
           9. HERO AUTOMATIC ROTATING HEADINGS
        ===================================================== */

        (function () {

            const hero = $(".altivio-hero-section");

            if (!hero || hero.dataset.animationReady === "true") {
                return;
            }

            const title = $(".altivio-hero-title", hero);
            const background = $(".altivio-hero-bg", hero);
            const eyebrow = $(".altivio-hero-eyebrow", hero);
            const description = $(".altivio-hero-description", hero);
            const buttons = $$(".altivio-hero-btn", hero);
            const bottom = $(".altivio-hero-bottom", hero);
            const scrollLine = $(".altivio-hero-scroll-line", hero);

            if (!title) return;

            hero.dataset.animationReady = "true";

            const headings = [
                "We Build Digital Experiences That Move Businesses Forward.",
                "We Turn Creative Ideas Into Powerful Digital Solutions.",
                "We Design Websites That Inspire, Engage & Convert."
            ];

            let currentHeading = 0;

            function createHeadingWords(text) {

                title.innerHTML = "";

                const words = text.split(/\s+/);

                words.forEach(function (word, index) {

                    const span = document.createElement("span");
                    span.className = "altivio-hero-word";
                    span.setAttribute("aria-hidden", "true");
                    span.textContent = word;

                    title.appendChild(span);

                    if (index < words.length - 1) {
                        title.appendChild(document.createTextNode(" "));
                    }
                });

                title.setAttribute("aria-label", text);

                return $$(".altivio-hero-word", title);
            }

            const firstWords = createHeadingWords(headings[0]);

            if (isReducedMotion()) {

                gsap.set(
                    [title, eyebrow, description, ...buttons, bottom].filter(Boolean),
                    {
                        opacity: 1,
                        y: 0,
                        visibility: "visible"
                    }
                );

                gsap.set(firstWords, {
                    opacity: 1,
                    y: 0
                });

                if (background) {
                    gsap.set(background, { scale: 1 });
                }

                return;
            }

            const heroElements = [
                eyebrow,
                description,
                ...buttons,
                bottom
            ].filter(Boolean);

            if (heroElements.length) {
                gsap.set(heroElements, {
                    opacity: 0,
                    y: 20
                });
            }

            if (background) {
                gsap.set(background, { scale: 1.12 });
            }

            const heroTimeline = gsap.timeline();

            if (eyebrow) {
                heroTimeline.to(eyebrow, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                });
            }

            heroTimeline.fromTo(
                firstWords,
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
            );

            if (description) {
                heroTimeline.to(description, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                }, "-=0.3");
            }

            if (buttons.length) {
                heroTimeline.to(buttons, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15
                }, "-=0.3");
            }

            if (bottom) {
                heroTimeline.to(bottom, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                }, "-=0.2");
            }

            if (background) {
                heroTimeline.to(background, {
                    scale: 1,
                    duration: 2.5,
                    ease: "power2.out"
                }, 0);
            }

            function rotateHeading() {

                gsap.to(title, {
                    opacity: 0,
                    y: -18,
                    duration: 0.45,
                    ease: "power2.in",
                    onComplete: function () {

                        currentHeading =
                            (currentHeading + 1) % headings.length;

                        const words = createHeadingWords(
                            headings[currentHeading]
                        );

                        gsap.set(title, {
                            opacity: 1,
                            y: 0
                        });

                        gsap.fromTo(
                            words,
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

                gsap.delayedCall(4.5, rotateHeading);
            }

            gsap.delayedCall(6, rotateHeading);

            if (background) {
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

            if (scrollLine) {
                gsap.to(scrollLine, {
                    scaleX: 0.35,
                    duration: 0.9,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut"
                });
            }

        })();


        /* =====================================================
           10. TEAM EDITORIAL IMAGE REVEAL
        ===================================================== */

        (function () {

            const section = $(".altivio-team-section");

            if (!section || section.dataset.animationReady === "true") {
                return;
            }

            section.dataset.animationReady = "true";

            if (isReducedMotion()) return;

            const label = $(".altivio-team-label", section);
            const heading = $(".altivio-team-heading-row", section);
            const cards = $$(".altivio-team-card", section);
            const footer = $(".altivio-team-footer", section);

            reveal(label, section, { fromY: 25 });
            reveal(heading, heading, { fromY: 45, duration: 1 });

            cards.forEach(function (card, index) {

                const imageWrap = $(".altivio-team-image-wrap", card);
                const image = $(".altivio-team-image", card);
                const info = $(".altivio-team-info", card);

                if (!imageWrap || !image || !info) return;

                gsap.set(imageWrap, {
                    clipPath: "inset(100% 0 0 0)"
                });

                gsap.set(image, {
                    scale: 1.2
                });

                gsap.set(info, {
                    autoAlpha: 0,
                    y: 25
                });

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 88%",
                        once: true
                    }
                });

                timeline
                    .to(imageWrap, {
                        clipPath: "inset(0% 0 0 0)",
                        duration: 1.1,
                        delay: (index % 3) * 0.12,
                        ease: "power3.inOut"
                    })
                    .to(image, {
                        scale: 1,
                        duration: 1.5,
                        ease: "power3.out"
                    }, "-=0.8")
                    .to(info, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power3.out"
                    }, "-=0.6");
            });

            if (footer) {
                reveal(footer, footer, {
                    fromY: 25,
                    duration: 0.8,
                    start: "top 95%"
                });
            }

        })();


        /* =====================================================
           11. WHY CHOOSE US SLIDER
        ===================================================== */

        (function () {

            const section = $(".altivio-why-section");

            if (!section || section.dataset.sliderReady === "true") {
                return;
            }

            const track = $(".altivio-why-track", section);
            const cards = $$(".altivio-why-card", section);
            const prevBtn = $(".altivio-why-prev", section);
            const nextBtn = $(".altivio-why-next", section);
            const progressBar = $(".altivio-why-progress-bar", section);

            if (
                !track ||
                !cards.length ||
                !prevBtn ||
                !nextBtn ||
                !progressBar
            ) {
                return;
            }

            section.dataset.sliderReady = "true";

            let currentIndex = 0;

            function getVisibleCards() {
                if (window.innerWidth <= 575) return 1;
                if (window.innerWidth <= 991) return 2;
                return 4;
            }

            function updateSlider() {

                const visibleCards = Math.min(
                    getVisibleCards(),
                    cards.length
                );

                const maxIndex = Math.max(
                    0,
                    cards.length - visibleCards
                );

                currentIndex = Math.max(
                    0,
                    Math.min(currentIndex, maxIndex)
                );

                const gap = parseFloat(
                    window.getComputedStyle(track).gap
                ) || 0;

                const cardWidth = cards[0].getBoundingClientRect().width;

                if (!cardWidth) return;

                const moveAmount = (cardWidth + gap) * currentIndex;

                track.style.transform =
                    "translateX(-" + moveAmount + "px)";

                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === maxIndex;

                const progress =
                    ((currentIndex + 1) / (maxIndex + 1)) * 100;

                progressBar.style.width = progress + "%";
            }

            nextBtn.addEventListener("click", function () {

                const maxIndex = Math.max(
                    0,
                    cards.length - Math.min(getVisibleCards(), cards.length)
                );

                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                }
            });

            prevBtn.addEventListener("click", function () {

                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });

            let resizeTimer;

            window.addEventListener("resize", function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateSlider, 150);
            });

            updateSlider();

            reveal(
                $(".altivio-why-header", section),
                section,
                { fromY: 45 }
            );

            if (!isReducedMotion()) {
                reveal(
                    cards,
                    $(".altivio-why-slider", section),
                    {
                        fromY: 50,
                        duration: 0.8,
                        stagger: 0.15
                    }
                );
            }

        })();


        /* =====================================================
           12. SERVICES IMAGE PREVIEW
        ===================================================== */

        (function () {

            const section = $(".altivio-service-section");

            if (!section || section.dataset.serviceReady === "true") {
                return;
            }

            const items = $$(".altivio-service-item", section);
            const previewImage = $(".altivio-service-preview-image", section);
            const imageIndex = $(".altivio-service-image-index", section);
            const imageName = $(".altivio-service-image-name", section);

            if (!items.length || !previewImage) return;

            section.dataset.serviceReady = "true";

            function changeServiceImage(item, index) {

                if (!item || item.classList.contains("active")) return;

                const newImage = item.dataset.image;
                const heading = $("h3", item);

                if (!newImage || !heading) return;

                const serviceName = heading.textContent.trim();

                items.forEach(function (service) {
                    service.classList.remove("active");
                });

                item.classList.add("active");

                function updateImage() {

                    previewImage.src = newImage;
                    previewImage.alt = serviceName;

                    if (imageIndex) {
                        imageIndex.textContent =
                            String(index + 1).padStart(2, "0") +
                            " / " +
                            String(items.length).padStart(2, "0");
                    }

                    if (imageName) {
                        imageName.textContent = serviceName;
                    }

                    gsap.to(previewImage, {
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }

                if (!isReducedMotion()) {

                    gsap.killTweensOf(previewImage);

                    gsap.to(previewImage, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: updateImage
                    });

                } else {
                    updateImage();
                }
            }

            items.forEach(function (item, index) {

                item.addEventListener("mouseenter", function () {
                    changeServiceImage(item, index);
                });

                item.addEventListener("focus", function () {
                    changeServiceImage(item, index);
                });

                item.addEventListener("click", function () {
                    changeServiceImage(item, index);
                });

                item.addEventListener("keydown", function (event) {

                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        changeServiceImage(item, index);
                    }
                });
            });

            if (!isReducedMotion()) {

                reveal(
                    $(".altivio-service-label", section),
                    section,
                    { fromY: 30 }
                );

                reveal(
                    $(".altivio-service-title", section),
                    section,
                    { fromY: 50, delay: 0.1, duration: 1 }
                );

                reveal(
                    $$(".altivio-service-item", section),
                    $(".altivio-service-list", section),
                    { fromY: 35, duration: 0.7, stagger: 0.15 }
                );

                reveal(
                    $(".altivio-service-image-wrap", section),
                    $(".altivio-service-showcase", section),
                    { fromY: 0, duration: 1 }
                );
            }

        })();


        /* =====================================================
           13. NAVBAR
        ===================================================== */

        (function () {

            const header = $(".altivio-nav-header");
            const toggle = $("#altivioNavToggle");
            const menu = $("#altivioNavMenu");

            if (!header || !toggle || !menu) return;

            const links = $$(".altivio-nav-list li a", header);

            function closeMenu() {
                menu.classList.remove("open");
                toggle.classList.remove("active");
                toggle.setAttribute("aria-expanded", "false");
            }

            toggle.addEventListener("click", function () {

                const isOpen = menu.classList.toggle("open");

                toggle.classList.toggle("active", isOpen);
                toggle.setAttribute("aria-expanded", String(isOpen));
            });

            links.forEach(function (link) {
                link.addEventListener("click", closeMenu);
            });

            function updateNavbar() {
                header.classList.toggle("scrolled", window.scrollY > 50);
            }

            window.addEventListener("scroll", updateNavbar, {
                passive: true
            });

            updateNavbar();

            document.addEventListener("click", function (event) {
                if (!header.contains(event.target) && menu.classList.contains("open")) {
                    closeMenu();
                }
            });

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    closeMenu();
                }
            });

        })();


        /* =====================================================
           14. CTA ANIMATION
        ===================================================== */

        (function () {

            const section = $(".altivio-cta-section");

            if (!section) return;

            const content = $(".altivio-cta-content", section);
            const image = $(".altivio-cta-image", section);
            const circle = $(".altivio-cta-circle", section);

            if (content && content.children.length) {
                reveal(
                    Array.from(content.children),
                    section,
                    {
                        fromY: 50,
                        duration: 1,
                        stagger: 0.15,
                        start: "top 75%"
                    }
                );
            }

            if (image && !isReducedMotion()) {
                gsap.from(image, {
                    scale: 1.2,
                    autoAlpha: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%",
                        once: true
                    }
                });
            }

            if (circle && !isReducedMotion()) {
                gsap.from(circle, {
                    scale: 0.5,
                    autoAlpha: 0,
                    duration: 1.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%",
                        once: true
                    }
                });
            }

        })();


        /* =====================================================
           15. FOOTER ANIMATIONS
        ===================================================== */

        (function () {

            const section = $(".altivio-footer-section");

            if (!section) return;

            const footerTop = $(".altivio-footer-top", section);
            const bigText = $(".altivio-footer-big-text", section);
            const footerBottom = $(".altivio-footer-bottom", section);
            const footerFloat = $(".altivio-footer-float-contact");

            if (footerTop && footerTop.children.length) {
                reveal(
                    Array.from(footerTop.children),
                    footerTop,
                    {
                        fromY: 35,
                        duration: 0.8,
                        stagger: 0.12
                    }
                );
            }

            if (bigText) {
                reveal(bigText, bigText, {
                    fromY: 70,
                    duration: 1.2,
                    start: "top 90%"
                });
            }

            if (footerBottom) {
                reveal(footerBottom, footerBottom, {
                    fromY: 20,
                    duration: 0.8,
                    start: "top 95%"
                });
            }

            if (footerFloat && !isReducedMotion()) {
                gsap.from(footerFloat, {
                    x: -30,
                    autoAlpha: 0,
                    duration: 1,
                    delay: 0.5,
                    ease: "power3.out"
                });
            }

        })();


        /* =====================================================
           16. BACK TO TOP - LENIS SUPPORT
        ===================================================== */

        (function () {

            const backToTop = $(".altivio-footer-back-top");

            if (!backToTop) return;

            backToTop.addEventListener("click", function (event) {

                event.preventDefault();

                if (window.lenis) {
                    window.lenis.scrollTo(0, {
                        duration: 1.5
                    });
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            });

        })();


        /* =====================================================
           17. STATS SECTION ANIMATION
        ===================================================== */

        (function () {

            const section = $(".altivio-stats-section");

            if (!section) return;

            const label = $(".altivio-stats-label", section);
            const title = $(".altivio-stats-title", section);
            const intro = $(".altivio-stats-intro", section);
            const introLine = $(".altivio-stats-intro-line", section);
            const bottom = $(".altivio-stats-bottom", section);

            const headerElements = [
                label,
                title,
                intro
            ].filter(Boolean);

            if (headerElements.length && !isReducedMotion()) {

                gsap.set(headerElements, {
                    autoAlpha: 0,
                    y: 35
                });

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%",
                        once: true
                    }
                });

                headerElements.forEach(function (element) {
                    timeline.to(element, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                });
            }

            if (introLine && !isReducedMotion()) {
                gsap.fromTo(
                    introLine,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1,
                        ease: "power3.inOut",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 75%",
                            once: true
                        }
                    }
                );
            }

            const cards = $$(".altivio-stats-card", section);

            cards.forEach(function (card, index) {

                const imageWrap = $(".altivio-stats-image-wrap", card);
                const image = $(".altivio-stats-image", card);
                const content = $(".altivio-stats-content", card);
                const counter = $(".altivio-stats-number", card);

                if (!imageWrap || !image || !content || !counter) return;

                if (isReducedMotion()) return;

                const target = Number(counter.dataset.target);
                const suffix = counter.dataset.suffix || "";

                if (!Number.isFinite(target)) return;

                gsap.set(imageWrap, {
                    clipPath: "inset(100% 0 0 0)"
                });

                gsap.set(image, {
                    scale: 1.15
                });

                gsap.set(content, {
                    autoAlpha: 0,
                    y: 35
                });

                const counterValue = { value: 0 };

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        once: true
                    },
                    delay: index * 0.15
                });

                timeline
                    .to(imageWrap, {
                        clipPath: "inset(0% 0 0 0)",
                        duration: 1.1,
                        ease: "power3.inOut"
                    })
                    .to(image, {
                        scale: 1,
                        duration: 1.3,
                        ease: "power2.out"
                    }, "-=1")
                    .to(content, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }, "-=0.65")
                    .to(counterValue, {
                        value: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function () {
                            counter.textContent =
                                Math.round(counterValue.value).toLocaleString("en-IN") + suffix;
                        }
                    }, "-=0.45");
            });

            if (bottom) {
                reveal(bottom, bottom, {
                    fromY: 25,
                    duration: 0.8,
                    start: "top 95%"
                });
            }

            $$(".altivio-stats-image", section).forEach(function (image) {
                if (!image.complete) {
                    image.addEventListener("load", function () {
                        ScrollTrigger.refresh();
                    }, { once: true });
                }
            });

        })();


        /* =====================================================
           18. CONTACT SECTION ANIMATION
        ===================================================== */

        (function () {

            const section = $(".altivio-contact-section");

            if (!section) return;

            const label = $(".altivio-contact-label", section);
            const heading = $(".altivio-contact-heading", section);
            const intro = $(".altivio-contact-intro", section);
            const infoItems = $$(".altivio-contact-info-item", section);
            const social = $(".altivio-contact-social", section);
            const formHeading = $(".altivio-contact-form-heading", section);
            const fields = $$(".altivio-contact-field", section);
            const submit = $(".altivio-contact-submit-wrap", section);
            const bottom = $(".altivio-contact-bottom", section);

            reveal(label, section);
            reveal(heading, heading);
            reveal(intro, intro);

            if (infoItems.length) {
                reveal(
                    infoItems,
                    $(".altivio-contact-info-list", section),
                    {
                        stagger: 0.15,
                        duration: 0.7
                    }
                );
            }

            reveal(social, social);
            reveal(formHeading, formHeading);

            if (fields.length) {
                reveal(
                    fields,
                    $(".altivio-contact-form-fields", section),
                    {
                        stagger: 0.12,
                        duration: 0.65
                    }
                );
            }

            reveal(submit, submit);
            reveal(bottom, bottom);

        })();


        /* =====================================================
           19. FINAL SCROLLTRIGGER REFRESH + DEBUG
        ===================================================== */

        function refreshScrollTrigger() {
            ScrollTrigger.refresh();
        }

        window.addEventListener("load", refreshScrollTrigger, {
            once: true
        });

        window.addEventListener("resize", function () {
            ScrollTrigger.refresh();
        }, { passive: true });

        requestAnimationFrame(function () {
            ScrollTrigger.refresh();
        });

        console.log("===== ALTIVIO STUDIO GSAP DEBUG =====");
        console.log("GSAP Version:", gsap.version);
        console.log("ScrollTrigger Loaded:", typeof ScrollTrigger);
        console.log("ScrollTrigger Count:", ScrollTrigger.getAll().length);

        console.table({
            hero: !!$(".altivio-hero-section"),
            about: !!$(".about-section"),
            portfolio: !!$(".parallax-portfolio"),
            clients: !!$(".altivio-client-section"),
            clientGrid: !!$(".altivio-client-grid"),
            clientLogos: $$(".altivio-client-logo").length,
            testimonials: !!$(".altivio-testimonial-section"),
            team: !!$(".altivio-team-section"),
            whyChooseUs: !!$(".altivio-why-section"),
            services: !!$(".altivio-service-section"),
            navbar: !!$(".altivio-nav-header"),
            cta: !!$(".altivio-cta-section"),
            footer: !!$(".altivio-footer-section"),
            stats: !!$(".altivio-stats-section"),
            contact: !!$(".altivio-contact-section")
        });

        console.log("==============================");

    });

})();
