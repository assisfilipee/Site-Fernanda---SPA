(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    /* ===== YEAR ===== */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ===== SLIDER (3 visíveis) ===== */
    (() => {
      const slider = document.querySelector(".slider");
      if (!slider) return;

      const track = slider.querySelector(".slider__track");
      const slides = Array.from(slider.querySelectorAll(".slide"));
      const prevBtn = slider.querySelector(".slider__btn--prev");
      const nextBtn = slider.querySelector(".slider__btn--next");
      const dotsWrap = slider.querySelector(".slider__dots");

      if (!track || slides.length === 0) return;

      const autoplay = slider.dataset.autoplay === "true";
      const interval = Number(slider.dataset.interval || 4500);

      const VISIBLE = 3;
      const maxIndex = Math.max(0, slides.length - VISIBLE);

      let index = 0;
      let timer = null;

      const dots = [];
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        for (let i = 0; i <= maxIndex; i++) {
          const b = document.createElement("button");
          b.className = "dot" + (i === 0 ? " is-active" : "");
          b.type = "button";
          b.setAttribute("aria-label", `Ir para posição ${i + 1}`);
          b.addEventListener("click", () => {
            goTo(i);
            start();
          });
          dotsWrap.appendChild(b);
          dots.push(b);
        }
      }

      const setDots = () => {
        if (!dots.length) return;
        dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
      };

      const goTo = (i) => {
        index = Math.min(Math.max(i, 0), maxIndex);
        track.style.transform = `translateX(-${index * (100 / VISIBLE)}%)`;
        setDots();
      };

      const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
      };

      const start = () => {
        if (!autoplay || maxIndex === 0) return;
        stop();
        timer = setInterval(() => goTo(index + 1), interval);
      };

      if (nextBtn) nextBtn.addEventListener("click", () => { goTo(index + 1); start(); });
      if (prevBtn) prevBtn.addEventListener("click", () => { goTo(index - 1); start(); });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);

      goTo(0);
      start();
    })();

    /* ===== MODAL DE ZOOM (padronizado: is-active) ===== */
    (() => {
      const zoomModal = document.getElementById("imageZoom");
      if (!zoomModal) return;

      const zoomImg = zoomModal.querySelector("img");
      const closeBtn = document.getElementById("imageZoomClose");
      const prevBtn = document.getElementById("zoomPrev");
      const nextBtn = document.getElementById("zoomNext");

      if (!zoomImg || !closeBtn || !prevBtn || !nextBtn) return;

      // pega cards clicáveis que realmente existem no HTML atual
      const cards = Array.from(document.querySelectorAll(".insta__item, .slide"))
        .filter((el) => el.querySelector("img"));

      if (!cards.length) return;

      const imgs = cards.map((card) => card.querySelector("img"));
      let zoomIndex = 0;

      const setZoomSrc = () => {
        const img = imgs[zoomIndex];
        zoomImg.src = img.currentSrc || img.src;
      };

      const openZoom = (i) => {
        zoomIndex = i;
        setZoomSrc();
        zoomModal.classList.add("is-active");
        zoomModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      };

      const closeZoom = () => {
        zoomModal.classList.remove("is-active");
        zoomModal.setAttribute("aria-hidden", "true");
        zoomImg.src = "";
        document.body.style.overflow = "";
      };

      const goPrev = () => {
        zoomIndex = (zoomIndex - 1 + imgs.length) % imgs.length;
        setZoomSrc();
      };

      const goNext = () => {
        zoomIndex = (zoomIndex + 1) % imgs.length;
        setZoomSrc();
      };

      cards.forEach((card, i) => {
        card.addEventListener("click", (e) => {
          if (e.target.closest("a, button, .slider__btn, .slider__dots, .dot")) return;
          openZoom(i);
        });
      });

      closeBtn.addEventListener("click", closeZoom);
      prevBtn.addEventListener("click", (e) => { e.stopPropagation(); goPrev(); });
      nextBtn.addEventListener("click", (e) => { e.stopPropagation(); goNext(); });

      zoomModal.addEventListener("click", (e) => {
        if (e.target === zoomModal) closeZoom();
      });

      document.addEventListener("keydown", (e) => {
        if (!zoomModal.classList.contains("is-active")) return;
        if (e.key === "Escape") closeZoom();
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      });
    })();

    /* ===== BOTÃO "VOLTAR AO TOPO" ===== */
    (() => {
      const btnTop = document.getElementById("btnTop");
      if (!btnTop) return;

      const toggle = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        btnTop.classList.toggle("is-show", y > 300);
      };

      window.addEventListener("scroll", toggle, { passive: true });
      toggle();

      btnTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    })();

    /* ===== BALÃO WHATS (4s depois, fica 4s, some) ===== */
    (() => {
      const wppBubble = document.getElementById("wppBubble");
      if (!wppBubble) return;

      let t1 = null;
      let t2 = null;

      const run = () => {
        clearTimeout(t1);
        clearTimeout(t2);

        wppBubble.classList.remove("is-show");

        t1 = setTimeout(() => {
          wppBubble.classList.add("is-show");
          t2 = setTimeout(() => wppBubble.classList.remove("is-show"), 4000);
        }, 4000);
      };

      run();
    })();
  });
})();
