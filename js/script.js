// function includeHtml(name) {
//     fetch(`${name}.html`) 
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById(name).innerHTML = data;
//         })
//         .catch(error => console.error(`Error loading ${name}:`, error));
// }

/* ---------- Home hero slider ---------- */
(function () {
    "use strict";

    const SLIDE_DURATION = 6500;
    const SWIPE_THRESHOLD = 45;

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function initHeroSlider(root) {
        const slides = Array.from(root.querySelectorAll("[data-slide]"));
        if (!slides.length) return;

        const track = root.querySelector("[data-track]");
        const dotsWrap = root.querySelector("[data-dots]");
        const progressBar = root.querySelector("[data-progress]");
        const currentLabel = root.querySelector("[data-current]");
        const totalLabel = root.querySelector("[data-total]");
        const prevButton = root.querySelector("[data-prev]");
        const nextButton = root.querySelector("[data-next]");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const dots = [];
        let index = 0;
        let timer = null;
        let paused = false;
        let pointerStart = null;
        let suppressClick = false;

        if (totalLabel) totalLabel.textContent = pad(slides.length);

        slides.forEach(function (slide, i) {
            slide.setAttribute("aria-label", i + 1 + " / " + slides.length);
        });

        if (dotsWrap) {
            slides.forEach(function (_, i) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "hero-dot";
                dot.setAttribute("aria-label", "Go to slide " + (i + 1));
                dot.addEventListener("click", function () {
                    goTo(i);
                });
                dotsWrap.appendChild(dot);
                dots.push(dot);
            });
        }

        function render() {
            slides.forEach(function (slide, i) {
                const isActive = i === index;
                slide.classList.toggle("is-active", isActive);
                slide.setAttribute("aria-hidden", isActive ? "false" : "true");

                if (isActive) {
                    slide.removeAttribute("inert");
                } else {
                    slide.setAttribute("inert", "");
                }
            });

            dots.forEach(function (dot, i) {
                if (i === index) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });

            if (currentLabel) currentLabel.textContent = pad(index + 1);
        }

        function restartProgress() {
            if (!progressBar) return;
            progressBar.style.animation = "none";
            void progressBar.offsetWidth;
            progressBar.style.animation = "";
        }

        function stopTimer() {
            if (timer !== null) {
                window.clearTimeout(timer);
                timer = null;
            }
        }

        function canAutoplay() {
            return slides.length > 1 && !paused && !reducedMotion.matches && !document.hidden;
        }

        function startTimer() {
            stopTimer();
            if (!canAutoplay()) return;

            timer = window.setTimeout(function () {
                goTo(index + 1);
            }, SLIDE_DURATION);
        }

        function goTo(next) {
            const target = (next + slides.length) % slides.length;
            if (target === index) return;

            index = target;
            render();
            restartProgress();
            startTimer();
        }

        function setPaused(value) {
            paused = value;
            root.classList.toggle("is-paused", value);

            if (value) {
                stopTimer();
            } else {
                startTimer();
            }
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                goTo(index - 1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                goTo(index + 1);
            });
        }

        root.addEventListener("mouseenter", function () {
            setPaused(true);
        });

        root.addEventListener("mouseleave", function () {
            setPaused(false);
        });

        root.addEventListener("focusin", function () {
            setPaused(true);
        });

        root.addEventListener("focusout", function (event) {
            if (!root.contains(event.relatedTarget)) setPaused(false);
        });

        root.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(index - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(index + 1);
            } else if (event.key === "Home") {
                event.preventDefault();
                goTo(0);
            } else if (event.key === "End") {
                event.preventDefault();
                goTo(slides.length - 1);
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopTimer();
                root.classList.add("is-paused");
            } else {
                root.classList.toggle("is-paused", paused);
                if (!paused) startTimer();
            }
        });

        if (typeof reducedMotion.addEventListener === "function") {
            reducedMotion.addEventListener("change", function () {
                if (reducedMotion.matches) {
                    stopTimer();
                } else {
                    startTimer();
                }
            });
        }

        if (track) {
            track.addEventListener("pointerdown", function (event) {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                pointerStart = { x: event.clientX, y: event.clientY };
                suppressClick = false;
            });

            track.addEventListener("pointerup", function (event) {
                if (!pointerStart) return;

                const dx = event.clientX - pointerStart.x;
                const dy = event.clientY - pointerStart.y;
                pointerStart = null;

                if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.3) {
                    suppressClick = true;
                    goTo(index + (dx < 0 ? 1 : -1));
                    window.setTimeout(function () {
                        suppressClick = false;
                    }, 80);
                }
            });

            track.addEventListener("pointercancel", function () {
                pointerStart = null;
            });

            track.addEventListener("pointerleave", function () {
                pointerStart = null;
            });

            track.addEventListener(
                "click",
                function (event) {
                    if (suppressClick) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                },
                true
            );
        }

        render();
        root.classList.add("is-ready");
        restartProgress();
        startTimer();
    }

    document.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
})();
