/* Wires the site together: entrance, language, theme, sections, diary and photo viewer. */
(function () {
  const { state, store, ui, icon } = window.Cupid;
  const doc = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 859px)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  state.lang = doc.lang === "th" ? "th" : "en";
  state.theme = doc.dataset.theme === "dark" ? "dark" : "light";

  // ---------- rendering ----------

  function applyStatic() {
    doc.lang = state.lang;
    document.title = ui("meta.title");
    $$("[data-i18n]").forEach((el) => (el.textContent = ui(el.dataset.i18n)));
    $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", ui(el.dataset.i18nAria)));
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
    const dark = state.theme === "dark";
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-label", ui(dark ? "theme.toLight" : "theme.toDark"));
      b.setAttribute("aria-pressed", String(dark));
      b.querySelector(".theme-btn__icon").innerHTML = dark ? icon.sun : icon.moon;
      b.querySelector(".theme-btn__text").textContent = ui(dark ? "theme.light" : "theme.dark");
    });
    const soundOn = window.CupidAudio.enabled;
    $$("[data-sound-toggle]").forEach((b) => {
      b.hidden = !window.CupidAudio.supported;
      b.setAttribute("aria-pressed", String(soundOn));
      b.setAttribute("aria-label", ui(soundOn ? "sound.turnOff" : "sound.turnOn"));
      const iconEl = b.querySelector(".sound-pill__icon") || b;
      iconEl.innerHTML = soundOn ? icon.soundOn : icon.soundOff;
      const text = b.querySelector(".sound-pill__text");
      if (text) text.textContent = ui(soundOn ? "sound.on" : "sound.off");
    });
    $("#diary-hint").textContent = ui(coarse.matches ? "diary.hintTouch" : "diary.hintDesk");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#1c1b1e" : "#f0e7db");
  }

  function renderSections() {
    $("#profile-body").innerHTML = window.CupidSections.profile();
    $("#relationships-body").innerHTML = window.CupidSections.relationships();
    $("#credits-body").innerHTML = window.CupidSections.credits();
    watchReveals();
  }

  let numberedTotal = 0;
  function renderBook() {
    const list = window.CupidPages.build(state.theme === "dark");
    numberedTotal = list.filter((p) => /^\d+$/.test(p.label)).length;
    book.setPages(list);
  }

  function renderAll() {
    applyStatic();
    renderSections();
    renderBook();
    window.CupidLightbox.refresh();
  }

  /** Re-render without the page jumping: keep the section under the middle of the screen in place. */
  function keepingScroll(fn) {
    const mid = window.innerHeight / 2;
    const anchor = $$("main > section").find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    const before = anchor ? anchor.getBoundingClientRect().top : 0;
    fn();
    if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
  }

  // ---------- language & theme ----------

  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang;
    store.set("cupid.lang", lang);
    window.CupidAudio.sfx.tick();
    keepingScroll(renderAll);
  }

  function setTheme(theme, fromEl) {
    if (theme === state.theme) return;
    window.CupidAudio.sfx.theme(theme === "dark");
    window.CupidAudio.setMode(theme);
    const apply = () => {
      state.theme = theme;
      doc.dataset.theme = theme;
      store.set("cupid.theme", theme);
      keepingScroll(renderAll);
    };
    if (document.startViewTransition && !reduce.matches) {
      const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: 0, width: 0, height: 0 };
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      doc.style.setProperty("--vt-x", x + "px");
      doc.style.setProperty("--vt-y", y + "px");
      doc.style.setProperty("--vt-r", Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + "px");
      doc.classList.add("vt-theme");
      const vt = document.startViewTransition(apply);
      // a skipped transition (e.g. tab hidden) still applies the theme; just don't report it as an error
      vt.ready.catch(() => {});
      vt.finished.catch(() => {}).then(() => doc.classList.remove("vt-theme"));
    } else {
      doc.classList.add("theme-fade");
      apply();
      setTimeout(() => doc.classList.remove("theme-fade"), 700);
    }
  }

  // ---------- diary ----------

  const bookEl = $("#book");
  const book = window.CupidFlipbook(bookEl, {
    onChange(s) {
      const total = numberedTotal;
      const nums = s.labels.filter((l) => /^\d+$/.test(l));
      let text;
      if (nums.length === 2) text = ui("diary.pagesOf", { a: nums[0], b: nums[1], n: total });
      else if (nums.length === 1) text = ui("diary.pageOf", { a: nums[0], n: total });
      else text = s.labels.join(" · ");
      $("#book-status").textContent = text;
      $("#book-live").textContent = text;
      $("#book-prev").disabled = s.atStart;
      $("#book-next").disabled = s.atEnd;
      $("#book-first").hidden = s.atStart;
    },
    onZoom: (key) => window.CupidLightbox.open(key),
    onTurn: () => window.CupidAudio.sfx.page(),
    // long entries are fitted to the page each time pages are placed
    onLayout: (el) => window.CupidPages.fit(el),
  });
  // ...and again when the book changes size or the fonts arrive
  let refitTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(refitTimer);
    refitTimer = setTimeout(() => window.CupidPages.fit(bookEl), 150);
  });
  if (document.fonts) {
    const refit = () => {
      window.CupidPages.forget();
      window.CupidPages.fit(bookEl);
    };
    document.fonts.addEventListener("loadingdone", refit);
    document.fonts.ready.then(refit);
  }
  $("#book-prev").addEventListener("click", () => book.prev());
  $("#book-next").addEventListener("click", () => book.next());
  $("#book-first").addEventListener("click", () => book.first());
  book.setSingle(narrow.matches);
  narrow.addEventListener("change", (e) => book.setSingle(e.matches));
  coarse.addEventListener("change", applyStatic);

  // ---------- photo viewer outside the book ----------

  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (!z || z.closest(".book__stage")) return; // the book handles its own taps
    window.CupidLightbox.open(z.getAttribute("data-zoom"));
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-zoom]")) {
      e.preventDefault();
      window.CupidLightbox.open(e.target.getAttribute("data-zoom"));
    }
  });

  // ---------- controls ----------

  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $$("[data-sound-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      window.CupidAudio.setEnabled(!window.CupidAudio.enabled);
      window.CupidAudio.start(state.theme);
      window.CupidAudio.sfx.tick();
      applyStatic();
    }),
  );
  $$("[data-theme-toggle]").forEach((b) =>
    b.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark", b)),
  );

  const menuBtn = $("#menu-btn");
  const nav = $("#site-nav");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", ui(open ? "nav.close" : "nav.menu"));
    menuBtn.innerHTML = open ? icon.close : icon.menu;
    nav.classList.toggle("is-open", open);
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // current section in the nav
  const links = $$("#site-nav a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$("main > section").forEach((s) => spy.observe(s));

  // gentle fade-in of cards as they scroll into view
  let revealer = null;
  function watchReveals() {
    const items = $$(".reveal:not(.is-in), .rel-card, .sticky, .artist");
    if (reduce.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!revealer) {
      revealer = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-in");
              revealer.unobserve(en.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
    }
    items.forEach((el) => {
      el.classList.add("will-reveal");
      revealer.observe(el);
    });
  }

  // ---------- entrance ----------

  const entrance = $("#entrance");
  const behind = $$(".site-header, main, .site-footer");
  function closeEntrance() {
    if (!entrance || entrance.classList.contains("is-opening")) return;
    entrance.classList.add("is-opening");
    // the click on "Open the diary" is what lets the browser play sound
    window.CupidAudio.start(state.theme);
    window.CupidAudio.sfx.open();
    behind.forEach((el) => (el.inert = false));
    doc.classList.remove("has-entrance");
    const done = () => {
      entrance.remove();
      $("#top").focus({ preventScroll: true });
    };
    if (reduce.matches) done();
    else setTimeout(done, 1500);
  }
  if (entrance) {
    // opening the diary always starts at its first page, not wherever a reload left the scroll
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    behind.forEach((el) => (el.inert = true));
    $("#enter-btn").addEventListener("click", closeEntrance);
    requestAnimationFrame(() => entrance.classList.add("is-ready"));
  }

  renderAll();
})();
