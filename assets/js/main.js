/* ===========================================================
   DG STATYBOS — interactions & motion
   =========================================================== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navH = 74;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Year ---------- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Gallery (curated) ---------- */
  const GALLERY = [
    ["g42", "Modernus karkasinis namas tamsiu stogu"],
    ["g05", "Terasa su mediniu stogu prie namo"],
    ["g37", "Pastatytas karkasinis namas su balkonu"],
    ["g52", "Didelė medinė terasa"],
    ["g16", "Karkasinio namo statyba — karkaso montavimas"],
    ["g30", "Stogo konstrukcijos įrengimas"],
    ["g10", "Medinė terasa prie namo"],
    ["g59", "Naujas dvišlaitis stogas"],
    ["g03", "Medinė karkaso konstrukcija"],
    ["g45", "Stoginė su medinėmis lubomis"],
    ["g69", "Įrengtas šviesus namo vidus"],
    ["g38", "Užbaigtas namas su dvišlaičiu stogu"],
    ["g49", "Terasos stogas / pavėsinė"],
    ["g57", "Stogo dengimas skarda"],
    ["g07", "Medinė terasa prie pievos"],
    ["g11", "Vidaus apdaila — kambarys su medinėmis grindimis"],
    ["g56", "Karkasinio namo medinis karkasas"],
    ["g26", "Pastatytas namas, šviesus fasadas"],
    ["g44", "Terasa su laiptais"],
    ["g12", "Medinių lubų detalė"],
    ["g15", "Užbaigtas karkasinis namas"],
    ["g21", "Stogo gegnės — namo karkasas"],
    ["g28", "Medinė vidaus apdaila"],
    ["g68", "Pastatytas namas su prieangiu"]
  ];
  const masonry = $("#masonry");
  if (masonry) {
    masonry.innerHTML = GALLERY.map(([f, alt], i) =>
      `<button class="tile" data-i="${i}" aria-label="Padidinti nuotrauką: ${alt}">
        <img src="assets/img/${f}.webp" alt="${alt}" loading="lazy" />
        <span class="zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg></span>
      </button>`).join("");
  }

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
  let cur = 0;
  function openLb(i) {
    cur = (i + GALLERY.length) % GALLERY.length;
    lbImg.src = `assets/img/${GALLERY[cur][0]}.webp`;
    lbImg.alt = GALLERY[cur][1];
    lbCount.textContent = `${cur + 1} / ${GALLERY.length}`;
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    if (window.lenisInstance) window.lenisInstance.stop(); else document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    if (window.lenisInstance) window.lenisInstance.start(); else document.body.style.overflow = "";
  }
  if (masonry) masonry.addEventListener("click", e => {
    const t = e.target.closest(".tile"); if (t) openLb(+t.dataset.i);
  });
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbNext").addEventListener("click", () => openLb(cur + 1));
  $("#lbPrev").addEventListener("click", () => openLb(cur - 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") openLb(cur + 1);
    if (e.key === "ArrowLeft") openLb(cur - 1);
  });

  /* ---------- Header scrolled state ---------- */
  const header = $("#header");
  const onScroll = (yPos) => { header.classList.toggle("scrolled", yPos > 24); };

  /* ---------- Lenis smooth scroll + GSAP ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, smoothTouch: false
    });
    window.lenisInstance = lenis;
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    if (window.gsap) {
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    lenis.on("scroll", ({ scroll }) => onScroll(scroll));
  } else {
    window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
  }
  onScroll(window.scrollY || 0);

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#" || id === "#top") {
        e.preventDefault();
        lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        closeMenu(); return;
      }
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(tgt, { offset: -navH + 1 });
      else tgt.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle"), menu = $("#mobileMenu");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open"); toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start(); else document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { lenis ? lenis.stop() : document.body.style.overflow = "hidden"; }
    else { lenis ? lenis.start() : document.body.style.overflow = ""; }
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Process: build sequence ---------- */
  const steps = $$(".proc-step");
  const stageImgs = $$(".proc-visual .stage-img");
  const cCur = $(".proc-counter .c-cur");
  if (steps.length) {
    let active = -1;
    const setActive = (idx) => {
      if (idx === active) return;
      active = idx;
      steps.forEach((s, i) => s.classList.toggle("active", i === idx));
      stageImgs.forEach((s, i) => s.classList.toggle("active", i === idx));
      if (cCur) cCur.textContent = "0" + (idx + 1);
    };
    const stepIO = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) setActive(+en.target.dataset.step);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    steps.forEach(s => stepIO.observe(s));

    /* progress rail fill (scrubbed) */
    const fill = $("#procFill");
    const stepsWrap = $(".proc-steps");
    if (fill && window.ScrollTrigger && !reduce) {
      ScrollTrigger.create({
        trigger: stepsWrap, start: "top center", end: "bottom center",
        onUpdate: self => { fill.style.height = (self.progress * 100).toFixed(1) + "%"; }
      });
    } else if (fill) { fill.style.height = "100%"; }
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$(".faq-item").forEach(o => { o.classList.remove("open"); $(".faq-a", o).style.maxHeight = null; });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- Mobile sticky call: hide over contact/footer ---------- */
  const mobileCall = $("#mobileCall"), contact = $("#kontaktai");
  if (mobileCall && contact && "IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      mobileCall.classList.toggle("hide", e[0].isIntersecting);
    }, { threshold: 0.08 }).observe(contact);
  }

  /* ---------- Lead form ---------- */
  const form = $("#leadForm"), status = $("#formStatus");
  if (form) {
    const EMAIL = "dgstatybos@gmail.com";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const vardas = $("#vardas").value.trim();
      const tel = $("#tel").value.trim();
      const paslauga = $("#paslauga").value;
      const zinute = $("#zinute").value.trim();
      status.className = "form-status";
      if (!vardas || tel.replace(/\D/g, "").length < 6) {
        status.textContent = "Įveskite vardą ir teisingą telefono numerį.";
        status.classList.add("err"); return;
      }
      const btn = $(".btn", form); const label = btn.textContent;
      // If a real form endpoint is configured, send inline; otherwise open the email client.
      if (form.action && !form.action.includes("YOUR_FORM_ID")) {
        btn.textContent = "Siunčiama…"; btn.style.opacity = ".7";
        try {
          const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("bad-response");
          status.textContent = "Ačiū! Užklausa išsiųsta — susisieksime su jumis artimiausiu metu.";
          status.classList.add("ok"); form.reset();
        } catch (err) {
          status.innerHTML = 'Nepavyko išsiųsti. Paskambinkite: <a href="tel:+37066389498" style="color:#fff;text-decoration:underline">+370 663 89498</a>.';
          status.classList.add("err");
        } finally { btn.textContent = label; btn.style.opacity = ""; }
        return;
      }
      // mailto fallback (works now, before a form backend is connected)
      const subject = "Užklausa iš svetainės — " + paslauga;
      const body = "Vardas: " + vardas + "\nTelefonas: " + tel + "\nPaslauga: " + paslauga + "\n\nProjektas:\n" + (zinute || "—");
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Atveriame jūsų el. pašto programą su paruošta žinute…";
      status.classList.add("ok");
    });
  }

  /* ---------- Refresh ScrollTrigger after load ---------- */
  window.addEventListener("load", () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();
