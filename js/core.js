/* Shared state and small helpers used by every part of the site. */
window.Cupid = (function () {
  const C = window.CUPID_CONTENT;
  const UI = window.CUPID_UI;

  const state = { lang: "en", theme: "light" };

  // Browser storage can be missing (private windows, blocked storage); never rely on it.
  const store = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        /* ignore */
      }
    },
  };

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  }

  /** Interface text by key, with {a}-style variables. */
  function ui(key, vars) {
    let s = (UI[state.lang] && UI[state.lang][key]) || UI.en[key] || key;
    if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }

  /** Plain text of a {th, en} field in the current language ("" when the owner hasn't written it). */
  function txt(field) {
    if (!field) return "";
    if (typeof field === "string") return field;
    // The owner may write only one language; show that rather than nothing.
    return field[state.lang] || field[state.lang === "th" ? "en" : "th"] || "";
  }

  /** Escaped HTML for a content field, or a clearly marked blank waiting for the owner. */
  function t(field, opts) {
    const s = txt(field);
    if (s) {
      const html = esc(s).replace(/\n/g, "<br>");
      // Shown in the other language because the owner wrote only one: mark it for fonts and screen readers.
      const other = state.lang === "th" ? "en" : "th";
      return typeof field === "object" && !field[state.lang] ? `<span lang="${other}">${html}</span>` : html;
    }
    if (opts && opts.block) return `<span class="tbd tbd--block">${esc(ui("tbd.long"))}</span>`;
    return `<span class="tbd">${esc(ui("tbd"))}</span>`;
  }

  function isVisible(item) {
    if (!item) return false;
    if (item.mode === "dark") return state.theme === "dark";
    if (item.mode === "light") return state.theme !== "dark";
    return true;
  }

  function image(key) {
    const im = C.IMAGES[key];
    return im && isVisible(im) ? im : null;
  }

  /**
   * <img> for an artwork. Returns "" for a dark-only image in Light mode, so secret art
   * can never be placed in the page by accident.
   */
  function img(key, o) {
    const im = image(key);
    if (!im) return "";
    o = o || {};
    const full = `assets/img/art/${key}.webp`;
    const thumb = `assets/img/art/thumb/${key}.webp`;
    const tw = Math.round(im.w >= im.h ? 720 : (720 * im.w) / im.h);
    const cls = ["art", im.cutout ? "art--cutout" : "", o.cls || ""].join(" ").trim();
    const zoom = o.zoom === false ? "" : ` data-zoom="${esc(key)}"`;
    return (
      `<img class="${cls}" src="${o.full ? full : thumb}" srcset="${thumb} ${tw}w, ${full} ${im.w}w"` +
      ` sizes="${o.sizes || "(max-width: 860px) 90vw, 40vw"}" width="${im.w}" height="${im.h}"` +
      ` alt="${esc(txt(im.alt))}" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"` +
      ` draggable="false"${zoom}>`
    );
  }

  /** Small inline SVG decorations (drawn for this site). */
  const icon = {
    heart: '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21s-8.5-5.2-10.6-10.3C-.3 6.6 2.4 1.5 7 1.5c2.3 0 4 1.3 5 3 1-1.7 2.7-3 5-3 4.6 0 7.3 5.1 5.6 9.2C20.5 15.8 12 21 12 21z"/></svg>',
    heartLine: '<svg viewBox="0 0 24 22" aria-hidden="true" class="ico-line"><path d="M12 20s-8-4.9-10-9.7C.4 6.4 3 2 7.1 2c2.2 0 3.8 1.2 4.9 2.9C13.1 3.2 14.7 2 16.9 2 21 2 23.6 6.4 22 10.3 20 15.1 12 20 12 20z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><g class="ico-rays"><path d="M12 1.8v2.6M12 19.6v2.6M1.8 12h2.6M19.6 12h2.6M4.8 4.8l1.8 1.8M17.4 17.4l1.8 1.8M4.8 19.2l1.8-1.8M17.4 6.6l1.8-1.8"/></g></svg>',
    arrowL: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M15 5l-7 7 7 7"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    butterflyFill: '<svg viewBox="0 0 32 26" aria-hidden="true"><path fill="currentColor" d="M15 12C12 4 6 0 2.5 2S1 12 8 13c-5 1.5-5 8-1 9s7-4 8-8zM17 12c3-8 9-12 12.5-10S31 12 24 13c5 1.5 5 8 1 9s-7-4-8-8z"/><path d="M16 7v15M16 7l-2-4M16 7l2-4" fill="none" stroke="#2c2930" stroke-width="1.4" stroke-linecap="round"/></svg>',
    butterfly: '<svg viewBox="0 0 40 32" aria-hidden="true" class="ico-line"><path d="M20 8v20M20 12c-3-7-11-11-15-8s0 11 7 11c-6 1-8 8-3 10s9-5 11-9M20 12c3-7 11-11 15-8s0 11-7 11c6 1 8 8 3 10s-9-5-11-9M20 8l-3-5M20 8l3-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 20.5l-2.2-7.3L2.5 11l7.3-2.2z"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.4a8 8 0 0 1 0 11.2"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico-line"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
  };

  return { C, UI, state, store, esc, ui, txt, t, isVisible, image, img, icon };
})();
