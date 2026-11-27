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

/* ---------- Shared product card ---------- */
var ReTechCards = (function () {
    "use strict";

    const priceFormatter = new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR"
    });

    const LAPTOP_ICON =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="10" rx="1.5"/>' +
        '<path d="M2 18.5h20"/></svg>';

    const PC_ICON =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="11" rx="1.5"/>' +
        '<path d="M9 20h6M12 15v5"/></svg>';

    function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    function markup(product, link) {
        const specs = [
            ["CPU", product.processor],
            ["RAM", product.ram],
            ["Storage", product.storage],
            ["Display", product.display]
        ].filter(function (row) {
            return Boolean(row[1]);
        });

        return (
            '<article class="product-card" aria-label="' +
            escapeHtml(product.type + ": " + product.name) +
            '">' +
            '<div class="product-card__visual' +
            (product.image ? "" : " is-fallback") +
            '">' +
            (product.image
                ? '<img class="product-card__photo" src="' +
                  escapeHtml(product.image) +
                  '" alt="" width="640" height="400" loading="lazy" decoding="async">'
                : '<span class="product-card__icon" aria-hidden="true">' +
                  (product.type === "PC" ? PC_ICON : LAPTOP_ICON) +
                  "</span>") +
            '<span class="product-card__chip">' +
            escapeHtml(product.type) +
            "</span>" +
            '<p class="product-card__price">' +
            escapeHtml(priceFormatter.format(product.price)) +
            "</p>" +
            "</div>" +
            '<div class="product-card__body">' +
            '<h3 class="product-card__name">' +
            escapeHtml(product.name) +
            "</h3>" +
            '<dl class="product-card__specs">' +
            specs
                .map(function (row) {
                    return (
                        "<div><dt>" +
                        escapeHtml(row[0]) +
                        "</dt><dd>" +
                        escapeHtml(row[1]) +
                        "</dd></div>"
                    );
                })
                .join("") +
            "</dl>" +
            '<div class="product-card__foot">' +
            '<span class="product-card__condition">' +
            escapeHtml(product.condition) +
            "</span>" +
            '<a class="product-card__link" href="' +
            escapeHtml(link.href) +
            '">' +
            escapeHtml(link.label) +
            ' <span aria-hidden="true">→</span></a>' +
            "</div>" +
            "</div>" +
            "</article>"
        );
    }

    return { markup: markup };
})();

/* ---------- Home product slider ---------- */
(function () {
    "use strict";

    const root = document.querySelector("[data-product-slider]");
    if (!root) return;

    const viewport = root.querySelector("[data-ps-viewport]");
    const track = root.querySelector("[data-ps-track]");
    const prevButton = root.querySelector("[data-ps-prev]");
    const nextButton = root.querySelector("[data-ps-next]");
    const currentLabel = root.querySelector("[data-ps-current]");
    const totalLabel = root.querySelector("[data-ps-total]");
    const note = root.querySelector("[data-ps-note]");
    if (!viewport || !track) return;

    const SHOW_COUNT = 3;

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function pickRandom(list, count) {
        const pool = list.slice();

        for (let i = pool.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const swap = pool[i];
            pool[i] = pool[j];
            pool[j] = swap;
        }

        return pool.slice(0, count);
    }

    function step() {
        const card = track.firstElementChild;
        if (!card) return 0;
        const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
        return card.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
        return viewport.scrollWidth - viewport.clientWidth;
    }

    function update() {
        const size = step();
        const total = track.children.length;
        const index = size ? Math.round(viewport.scrollLeft / size) : 0;

        if (currentLabel) currentLabel.textContent = pad(Math.min(index + 1, Math.max(total, 1)));
        if (totalLabel) totalLabel.textContent = pad(total);
        if (prevButton) prevButton.disabled = viewport.scrollLeft <= 2;
        if (nextButton) nextButton.disabled = viewport.scrollLeft >= maxScroll() - 2;
    }

    function motionBehavior() {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        return reduce || document.hidden ? "auto" : "smooth";
    }

    function scrollToIndex(direction) {
        const size = step();
        if (!size) return;

        const target = Math.max(0, Math.min(viewport.scrollLeft + size * direction, maxScroll()));
        viewport.scrollTo({ left: target, behavior: motionBehavior() });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            scrollToIndex(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            scrollToIndex(1);
        });
    }

    viewport.addEventListener("scroll", update, { passive: true });

    viewport.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollToIndex(1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollToIndex(-1);
        } else if (event.key === "Home") {
            event.preventDefault();
            viewport.scrollTo({ left: 0, behavior: motionBehavior() });
        } else if (event.key === "End") {
            event.preventDefault();
            viewport.scrollTo({ left: maxScroll(), behavior: motionBehavior() });
        }
    });

    window.addEventListener("resize", update);
    window.addEventListener("load", update);

    fetch("/api/products", { headers: { Accept: "application/json" } })
        .then(function (response) {
            if (!response.ok) throw new Error("HTTP " + response.status);
            return response.json();
        })
        .then(function (data) {
            const all = Array.isArray(data) ? data : (data && data.products) || [];
            if (!all.length) throw new Error("Empty product list");

            track.innerHTML = pickRandom(all, SHOW_COUNT)
                .map(function (product) {
                    return ReTechCards.markup(product, {
                        href: "/products.html?type=" + encodeURIComponent(product.type),
                        label: product.type === "PC" ? "See all PCs" : "See all laptops"
                    });
                })
                .join("");

            if (note) note.hidden = true;
            root.classList.add("is-ready");
            update();
        })
        .catch(function () {
            if (note) {
                note.hidden = false;
                note.textContent =
                    "The product list could not be loaded right now. Please try again later, or call us on +36 70 454 6967.";
            }
        });
})();

/* ---------- Products page catalog ---------- */
(function () {
    "use strict";

    const root = document.querySelector("[data-product-grid]");
    if (!root) return;

    const grid = root.querySelector("[data-grid]");
    const countLabel = root.querySelector("[data-count]");
    const empty = root.querySelector("[data-empty]");
    const searchInput = root.querySelector("[data-filter-q]");
    const typeSelect = root.querySelector("[data-filter-type]");
    const sortSelect = root.querySelector("[data-sort]");
    const maxInput = root.querySelector("[data-filter-max]");

    const params = new URLSearchParams(window.location.search);
    const startType = params.get("type");
    const startSort = params.get("sort");

    if (searchInput) searchInput.value = params.get("q") || "";
    if (maxInput) maxInput.value = params.get("maxPrice") || "";
    if (typeSelect && (startType === "Laptop" || startType === "PC")) typeSelect.value = startType;
    if (sortSelect && (startSort === "price-asc" || startSort === "price-desc")) sortSelect.value = startSort;

    let requestId = 0;
    let debounceTimer = null;
    let lastQuery = null;

    function filters() {
        const search = new URLSearchParams();
        const type = typeSelect ? typeSelect.value : "all";
        const query = searchInput ? searchInput.value.trim() : "";
        const sort = sortSelect ? sortSelect.value : "name";
        const max = maxInput ? maxInput.value.trim() : "";

        if (type && type !== "all") search.set("type", type);
        if (query) search.set("q", query);
        if (max && Number(max) > 0) search.set("maxPrice", max);
        if (sort && sort !== "name") search.set("sort", sort);

        return search;
    }

    function load() {
        const search = filters();
        const queryString = search.toString();
        if (queryString === lastQuery) return;

        lastQuery = queryString;
        const current = (requestId += 1);

        grid.setAttribute("aria-busy", "true");

        fetch("/api/products" + (queryString ? "?" + queryString : ""), {
            headers: { Accept: "application/json" }
        })
            .then(function (response) {
                if (!response.ok) throw new Error("HTTP " + response.status);
                return response.json();
            })
            .then(function (data) {
                if (current !== requestId) return;

                const list = Array.isArray(data) ? data : (data && data.products) || [];

                grid.innerHTML = list
                    .map(function (product) {
                        return ReTechCards.markup(product, {
                            href: "/contact.html",
                            label: "Ask about it"
                        });
                    })
                    .join("");

                if (countLabel) {
                    countLabel.textContent = list.length + (list.length === 1 ? " product" : " products");
                }
                if (empty) empty.hidden = list.length > 0;

                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname + (queryString ? "?" + queryString : "")
                );
            })
            .catch(function () {
                if (current !== requestId) return;

                lastQuery = null;
                if (countLabel) countLabel.textContent = "";
                if (empty) {
                    empty.hidden = false;
                    empty.textContent = "The product list could not be loaded right now. Please try again later.";
                }
            })
            .finally(function () {
                if (current === requestId) grid.removeAttribute("aria-busy");
            });
    }

    function scheduleLoad(delay) {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(load, delay);
    }

    if (typeSelect) typeSelect.addEventListener("change", load);
    if (sortSelect) sortSelect.addEventListener("change", load);
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            scheduleLoad(250);
        });
        searchInput.addEventListener("change", load);
    }
    if (maxInput) {
        maxInput.addEventListener("input", function () {
            scheduleLoad(350);
        });
        maxInput.addEventListener("change", load);
    }

    load();
})();

/* ---------- Home newsletter ---------- */
(function () {
    "use strict";

    const form = document.querySelector("[data-newsletter]");
    if (!form) return;

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector("button[type=\"submit\"]");
    const note = document.querySelector("[data-newsletter-note]");
    const defaultNote = note ? note.textContent : "";
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let busy = false;

    function setNote(message, state) {
        if (!note) return;

        note.textContent = message;
        note.classList.toggle("is-success", state === "success");
        note.classList.toggle("is-error", state === "error");
    }

    function setInvalid(invalid) {
        if (invalid) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (busy || !input) return;

        const email = input.value.trim();

        if (!EMAIL_PATTERN.test(email)) {
            setInvalid(true);
            setNote("Please enter a valid email address.", "error");
            input.focus();
            return;
        }

        setInvalid(false);
        busy = true;
        if (button) button.disabled = true;
        setNote("Subscribing…", "");

        fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        })
            .then(function (response) {
                if (!response.ok) throw new Error("HTTP " + response.status);
                return response.json();
            })
            .then(function () {
                form.reset();
                setNote("Thanks! The next issue lands on Friday.", "success");
            })
            .catch(function () {
                setNote("Something went wrong. Please try again later.", "error");
            })
            .finally(function () {
                busy = false;
                if (button) button.disabled = false;
            });
    });

    if (input) {
        input.addEventListener("input", function () {
            if (input.getAttribute("aria-invalid") === "true") setInvalid(false);
            if (note && (note.classList.contains("is-error") || note.classList.contains("is-success"))) {
                setNote(defaultNote, "");
            }
        });
    }
})();
