/* Diary page templates. Each layout returns the inside of one page. */
window.CupidPages = (function () {
  const { C, state, esc, ui, txt, t, img, icon, isVisible } = window.Cupid;

  const tape = (cls) => `<span class="tape ${cls || ""}" aria-hidden="true"></span>`;
  const hand = (s, cls) => `<p class="hand ${cls || ""}">${s}</p>`;

  /** A caption only breaks at its dash ("DIE ALONE — ..."), so no word is left alone on a line. */
  function caption(field) {
    const s = txt(field);
    if (!s.includes(" — ")) return t(field);
    const html = s
      .split(" — ")
      .map((part, i, all) => `<span class="keep">${esc(part)}${i < all.length - 1 ? " —" : ""}</span>`)
      .join(" ");
    const other = state.lang === "th" ? "en" : "th";
    return typeof field === "object" && !field[state.lang] ? `<span lang="${other}">${html}</span>` : html;
  }

  function callouts(list) {
    return (list || [])
      .map(
        (c) =>
          `<span class="callout" style="--x:${c.x};--y:${c.y}"><span>${esc(txt(c.text))}</span></span>`,
      )
      .join("");
  }

  const layouts = {
    cover(p) {
      return `
        <div class="cover">
          <div class="cover__frame">
            <p class="cover__label">${esc(ui("diary.title"))}</p>
            <div class="cover__oval">${img(p.image, { sizes: "260px", zoom: false })}</div>
            <h3 class="cover__name">${esc(C.PROFILE.name)}</h3>
            <p class="cover__sub">${icon.heart}</p>
          </div>
          <span class="cover__clasp" aria-hidden="true">${icon.heart}</span>
        </div>`;
    },

    bookplate(p) {
      const note = txt(p.note);
      return `
        <div class="plate">
          <p class="plate__small">${esc(ui("diary.belongs"))}</p>
          <p class="plate__name">${esc(C.PROFILE.name)}</p>
          <span class="plate__rule" aria-hidden="true">${icon.heartLine}</span>
          ${note ? `<p class="plate__note hand">${esc(note)}</p>` : ""}
          <p class="plate__found">${esc(ui("diary.ifFound"))}</p>
        </div>
        <span class="stamp" aria-hidden="true">${icon.heart}</span>`;
    },

    contents(p, ctx) {
      const rows = ctx.toc
        .map(
          (r) => `
          <li class="${r.dark ? "is-dark" : ""}">
            <button type="button" data-goto="${esc(r.id)}">
              <span class="toc__title">${esc(r.title)}</span>
              <span class="toc__dots" aria-hidden="true"></span>
              <span class="toc__num">${r.num}</span>
            </button>
          </li>`,
        )
        .join("");
      return `
        <h3 class="page-title">${esc(ui("diary.contents"))}</h3>
        <ol class="toc">${rows}</ol>
        ${hand(esc(ctx.dark ? ui("diary.darkHere") : ui("diary.secretHere")), "toc__hint")}`;
    },

    portrait(p) {
      return `
        <h3 class="page-title page-title--hand">${t(p.title)}</h3>
        <figure class="portrait">
          ${img(p.image, { sizes: "(max-width: 860px) 80vw, 420px" })}
          ${callouts(p.callouts)}
        </figure>
        <span class="doodle doodle--heart" aria-hidden="true">${icon.heartLine}</span>`;
    },

    about(p) {
      const facts = C.PROFILE.facts
        .filter((f) => f.book && isVisible(f))
        .map(
          (f) =>
            `<li><span class="form__label">${esc(ui(f.label))}</span><span class="form__value${f.label === "fact.name" ? " hand" : ""}">${t(f.value)}</span></li>`,
        )
        .join("");
      return `
        <h3 class="page-title">${t(p.title)}</h3>
        <ul class="form">${facts}</ul>
        <div class="swatches" aria-hidden="true">
          ${C.PROFILE.palette.map((c) => `<span style="--c:${c.hex}"></span>`).join("")}
        </div>`;
    },

    polaroid(p) {
      return `
        <figure class="polaroid tilt-l${p.caption ? "" : " polaroid--blank"}">
          ${tape("tape--top")}
          ${img(p.image, { sizes: "(max-width: 860px) 60vw, 260px" })}
          ${p.caption ? `<figcaption class="hand">${caption(p.caption)}</figcaption>` : ""}
        </figure>
        <div class="entry entry--short">
          <h3 class="page-title page-title--hand">${t(p.title)}</h3>
          <p class="entry__text">${t(p.entry, { block: true })}</p>
        </div>`;
    },

    entry(p) {
      return `
        <div class="ruled">
          <h3 class="page-title">${t(p.title)}</h3>
          <p class="entry__text">${t(p.entry, { block: true })}</p>
        </div>
        <figure class="clipped tilt-r">
          <span class="clip" aria-hidden="true"></span>
          ${img(p.image, { sizes: "(max-width: 860px) 50vw, 220px" })}
        </figure>`;
    },

    duo(p) {
      return `
        <h3 class="page-title page-title--hand">${t(p.title)}</h3>
        <figure class="duo">
          ${img(p.image, { sizes: "(max-width: 860px) 80vw, 380px" })}
        </figure>
        <p class="duo__to"><span>${esc(ui("diary.to"))}</span> ${t(p.who)}</p>
        <p class="entry__text">${t(p.entry, { block: true })}</p>
        <div class="duo__mini tilt-r">${img(p.second, { sizes: "160px" })}</div>`;
    },

    collage(p) {
      const [a, b, c, d] = p.images;
      return `
        <h3 class="page-title page-title--hand">${t(p.title)}</h3>
        <div class="collage">
          <div class="collage__a">${img(a, { sizes: "(max-width: 860px) 60vw, 280px" })}</div>
          <figure class="collage__b polaroid tilt-r">${tape("tape--corner")}${img(b, { sizes: "200px" })}</figure>
          <div class="collage__c">${img(c, { sizes: "160px" })}</div>
          <div class="collage__d">${img(d, { sizes: "160px" })}</div>
          <span class="collage__star" aria-hidden="true">${icon.star}</span>
        </div>`;
    },

    // ---------- dark-mode layouts ----------
    bleed(p) {
      // the paper note is optional: a page without one shows only the picture
      return `
        <figure class="bleed">${img(p.image, { sizes: "(max-width: 860px) 95vw, 520px" })}</figure>
        <span class="stitches" aria-hidden="true"></span>
        ${txt(p.note) ? `<p class="scrap hand">${t(p.note)}</p>` : ""}`;
    },

    // A letter that runs on over several pages: only its first page has the title and photo;
    // `last: true` sets the closing words alone in the middle of the page.
    torn(p) {
      return `
        <div class="torn${p.last ? " torn--last" : ""}">
          ${p.title ? `<h3 class="page-title page-title--struck">${t(p.title)}</h3>` : ""}
          ${p.image ? `<figure class="torn__photo tilt-l">${tape("tape--dark")}${img(p.image, { sizes: "(max-width: 860px) 70vw, 300px" })}</figure>` : ""}
          <p class="entry__text">${t(p.entry, { block: true })}</p>
        </div>`;
    },

    pair(p) {
      return `
        <div class="pair">
          <figure class="pair__art">${img(p.image, { sizes: "(max-width: 860px) 60vw, 280px" })}</figure>
          <div class="pair__text">
            <h3 class="page-title page-title--hand">${t(p.title)}</h3>
            <p class="entry__text">${t(p.entry, { block: true })}</p>
          </div>
          <span class="flutter flutter--1" aria-hidden="true">${icon.butterfly}</span>
          <span class="flutter flutter--2" aria-hidden="true">${icon.butterfly}</span>
        </div>`;
    },

    memories(p) {
      const keys = Object.keys(C.IMAGES).filter((k) => isVisible(C.IMAGES[k]));
      return `
        <h3 class="page-title">${t(p.title)}</h3>
        <ul class="film" style="--cols:${keys.length > 9 ? 4 : 3}">
          ${keys.map((k, i) => `<li class="${i % 3 === 1 ? "tilt-r" : i % 3 === 2 ? "tilt-l" : ""}">${img(k, { sizes: "120px" })}</li>`).join("")}
        </ul>
        ${hand(esc(ui("diary.memoriesNote")), "film__hint")}`;
    },

    end(p, ctx) {
      const note = txt(p.note);
      return `
        <div class="end">
          <p class="end__script">${esc(ui("diary.toBeContinued"))}</p>
          <span class="end__heart" aria-hidden="true">${icon.heart}</span>
          ${note ? `<p class="hand">${esc(note)}</p>` : ""}
          <p class="end__hint">${esc(ctx.dark ? ui("diary.darkHere") : ui("diary.secretHere"))}</p>
        </div>`;
    },

    back() {
      return `<div class="back"><span class="back__emboss" aria-hidden="true">${icon.heartLine}</span></div>`;
    },
  };

  /*
   * Long entries. When a page's writing is longer than the space left for it, the page's
   * picture shrinks first (down to half), then the writing gets a little smaller (down to
   * 88 %). The duo and mirror pages may then drop their picture (the duo's small one in the
   * corner stays; the mirror page faces the same form). Only if that is still not enough, on
   * very small screens, does the writing scroll inside the page. Results are remembered per
   * page, language and page size.
   */
  const MIN_ART = 0.5;
  const MIN_TEXT = 0.88;
  const fitted = new Map();

  function topIn(el, stop) {
    let y = 0;
    for (let n = el; n && n !== stop; n = n.offsetParent) y += n.offsetTop;
    return y;
  }

  function applyFit(page, text, f) {
    if (f.art) page.style.setProperty("--art", f.art);
    if (f.fit) page.style.setProperty("--fit", f.fit);
    page.classList.toggle("no-art", !!f.noArt);
    if (f.scroll) {
      text.style.maxHeight = f.scroll + "px";
      text.classList.add("is-scroll");
    }
  }

  function fitPage(page) {
    const text = page.querySelector(".entry__text");
    const inner = page.querySelector(".page__inner");
    if (!text || !inner || !page.offsetHeight) return;
    page.style.removeProperty("--art");
    page.style.removeProperty("--fit");
    page.classList.remove("no-art");
    text.classList.remove("is-scroll");
    text.style.maxHeight = "";

    const key = `${page.dataset.page}|${state.lang}|${page.offsetWidth}x${page.offsetHeight}`;
    if (fitted.has(key)) return applyFit(page, text, fitted.get(key));

    const clipped = page.querySelector(".clipped");
    const room = () => {
      let limit = inner.clientHeight - parseFloat(getComputedStyle(inner).paddingBottom);
      if (clipped) limit = Math.min(limit, clipped.offsetTop - 6);
      return limit - topIn(text, inner);
    };
    // offsetHeight is a whole number: keep 1px spare so a fraction never crosses the line
    const fits = () => text.offsetHeight + 1 <= room();
    // largest value in [min, 1] that still fits; false (left at min) when even min is not enough
    const search = (prop, min) => {
      page.style.setProperty(prop, min);
      if (!fits()) return false;
      let lo = min;
      let hi = 1;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        page.style.setProperty(prop, mid);
        if (fits()) lo = mid;
        else hi = mid;
      }
      // round down: a hair larger than the value tested can wrap one more line
      page.style.setProperty(prop, String(Math.floor(lo * 1000) / 1000));
      return true;
    };
    const read = (prop) => parseFloat(page.style.getPropertyValue(prop)) || 0;

    let f = {};
    if (!fits()) {
      if (search("--art", MIN_ART)) f = { art: read("--art") };
      else if (search("--fit", MIN_TEXT)) f = { art: MIN_ART, fit: read("--fit") };
      else {
        f = { art: MIN_ART, fit: MIN_TEXT };
        // the duo keeps its small picture in the corner; the mirror page faces the same form
        if (page.querySelector(".duo, .pair__art")) {
          page.classList.add("no-art");
          page.style.removeProperty("--fit");
          f = { art: MIN_ART, noArt: true };
          if (!fits()) f.fit = search("--fit", MIN_TEXT) ? read("--fit") : MIN_TEXT;
          page.style.setProperty("--fit", f.fit || 1);
        }
        if (!fits()) f.scroll = Math.max(48, Math.floor(room()));
      }
    }
    fitted.set(key, f);
    page.style.removeProperty("--art");
    page.style.removeProperty("--fit");
    page.classList.remove("no-art");
    applyFit(page, text, f);
  }

  /** Fit every diary page inside `root` (the book, or a turning sheet). */
  function fit(root) {
    root.querySelectorAll(".page").forEach(fitPage);
  }

  /** Fonts arriving late change how much space text needs. */
  function forget() {
    fitted.clear();
  }

  const COVERS = { cover: true, back: true };

  /**
   * Build the visible page list for the current theme and language.
   * Dark pages are left out entirely in Light mode (never rendered).
   */
  function build(dark) {
    const list = C.DIARY.filter(isVisible);
    let n = 0;
    const numbers = list.map((p) => (COVERS[p.layout] ? null : ++n));
    const toc = list
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.toc)
      .map(({ p, i }) => ({ id: p.id, title: txt(p.title), num: numbers[i], dark: p.mode === "dark" }));
    const ctx = { toc, dark };

    return list.map((p, i) => {
      const body = layouts[p.layout] ? layouts[p.layout](p, ctx) : "";
      const num = numbers[i];
      const side = COVERS[p.layout] ? "" : i % 2 === 1 ? " page--verso" : " page--recto";
      return {
        id: p.id,
        label: p.layout === "cover" ? ui("diary.cover") : p.layout === "back" ? ui("diary.backCover") : String(num),
        html:
          `<div class="page page--${p.layout}${p.mode === "dark" ? " page--dark" : ""}${COVERS[p.layout] ? " page--hard" : side}" data-page="${esc(p.id)}">` +
          `<div class="page__inner">${body}</div>` +
          (num ? `<span class="page__num">${num}</span>` : "") +
          `</div>`,
      };
    });
  }

  return { build, fit, forget };
})();
