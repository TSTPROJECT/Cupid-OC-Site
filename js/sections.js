/* Profile, relationships and credits sections. */
window.CupidSections = (function () {
  const { C, esc, ui, txt, t, img, icon, isVisible } = window.Cupid;

  function profile() {
    const P = C.PROFILE;
    const facts = P.facts
      .map((f) => `<div class="facts__row"><dt>${esc(ui(f.label))}</dt><dd>${t(f.value)}</dd></div>`)
      .join("");
    const chips = P.palette
      .map(
        (c) => `
        <li class="chip" style="--c:${c.hex}">
          <span class="chip__swatch" aria-hidden="true"></span>
          <span class="chip__name">${esc(txt(c.name))}</span>
          <code class="chip__hex">${c.hex}</code>
        </li>`,
      )
      .join("");
    const notes = P.notes
      .map(
        (n, i) => `
        <li class="sticky sticky--${i % 4}">
          <h4>${esc(ui(n.label))}</h4>
          <p>${t(n.value)}</p>
        </li>`,
      )
      .join("");
    const callouts = P.callouts
      .map((c) => `<span class="callout" style="--x:${c.x};--y:${c.y}"><span>${esc(txt(c.text))}</span></span>`)
      .join("");

    let secret = "";
    if (isVisible(P.secret) && img(P.secret.image)) {
      secret = `
        <aside class="secret reveal" aria-labelledby="secret-title">
          <figure class="secret__art">${img(P.secret.image, { sizes: "(max-width: 860px) 90vw, 460px" })}</figure>
          <div class="secret__text">
            <p class="kicker kicker--dark">${icon.lock} ${esc(ui("profile.secretKicker"))}</p>
            <h3 id="secret-title" class="secret__title">${t(P.secret.title)}</h3>
            <p>${t(P.secret.text, { block: true })}</p>
          </div>
        </aside>`;
    }

    return `
      <div class="profile">
        <div class="profile__art">
          <figure class="photo-sheet tilt-l">
            <span class="tape tape--top" aria-hidden="true"></span>
            <span class="tape tape--bottom" aria-hidden="true"></span>
            ${img(P.mainImage, { sizes: "(max-width: 860px) 88vw, 520px", eager: true, full: true })}
            ${callouts}
          </figure>
          <span class="sticker sticker--heart" aria-hidden="true">${icon.heart}</span>
          <span class="sticker sticker--star" aria-hidden="true">${icon.star}</span>
        </div>
        <div class="profile__text">
          <p class="kicker">${esc(ui("profile.kicker"))}</p>
          <h1 class="profile__name">${esc(P.name)}</h1>
          <p class="profile__name-alt hand" lang="th">${esc(P.nameTh)}</p>
          <div class="lede">${t(P.intro, { block: true })}</div>
          <section class="index-card" aria-labelledby="facts-title">
            <h3 id="facts-title" class="card-title">${esc(ui("profile.facts"))}</h3>
            <dl class="facts">
              <div class="facts__row"><dt>${esc(ui("fact.name"))}</dt><dd class="hand">${esc(P.name)}</dd></div>
              ${facts}
            </dl>
          </section>
          <section aria-labelledby="palette-title">
            <h3 id="palette-title" class="card-title">${esc(ui("profile.palette"))}</h3>
            <ul class="chips">${chips}</ul>
          </section>
        </div>
      </div>
      <section class="notes" aria-labelledby="notes-title">
        <h3 id="notes-title" class="card-title card-title--center">${esc(ui("profile.notes"))}</h3>
        <ul class="notes__list">${notes}</ul>
      </section>
      ${secret}`;
  }

  function relationships() {
    const cards = C.RELATIONSHIPS.filter(isVisible)
      .map(
        (r, i) => `
        <li class="rel-card ${i % 2 ? "tilt-r" : "tilt-l"}${r.mode === "dark" ? " rel-card--dark" : ""}">
          <span class="tape tape--top" aria-hidden="true"></span>
          <figure class="rel-card__photo">${img(r.image, { sizes: "(max-width: 860px) 80vw, 340px" })}</figure>
          <div class="rel-card__body">
            <p class="rel-card__type"><span class="label">${esc(ui("rel.type"))}</span> ${t(r.type)}</p>
            <h3 class="rel-card__name">${t(r.name)}</h3>
            <p class="rel-card__desc">${t(r.description, { block: true })}</p>
          </div>
          ${r.sticker ? `<span class="sticker sticker--card" aria-hidden="true">${icon.heart}</span>` : ""}
        </li>`,
      )
      .join("");
    return `
      <ul class="rel-grid">
        ${cards}
        <li class="rel-card rel-card--empty">
          <span class="rel-card__frame" aria-hidden="true">${icon.heartLine}</span>
          <p class="hand">${esc(ui("rel.empty"))}</p>
          <p class="rel-card__hint">${esc(ui("rel.emptyHint"))}</p>
        </li>
      </ul>`;
  }

  function credits() {
    const all = Object.keys(C.IMAGES);
    const artists = C.CREDITS.artists
      .map((name) => {
        const works = all.filter((k) => C.IMAGES[k].artist === name);
        const shown = works.filter((k) => isVisible(C.IMAGES[k]));
        const hidden = works.length - shown.length;
        const count = shown.length === 1 ? ui("credits.piece") : ui("credits.pieces", { n: shown.length });
        return `
          <li class="artist">
            <div class="artist__thumbs">
              ${shown.slice(0, 3).map((k) => img(k, { sizes: "72px" })).join("")}
              ${shown.length > 3 ? `<span class="artist__more">+${shown.length - 3}</span>` : ""}
              ${hidden ? `<span class="artist__locked" title="${esc(ui("credits.hidden", { n: hidden }))}">${icon.lock}</span>` : ""}
            </div>
            <p class="artist__name">${esc(name)}</p>
            <p class="artist__count">${shown.length ? esc(count) : ""}${hidden ? `<span class="artist__hidden">${esc(ui("credits.hidden", { n: hidden }))}</span>` : ""}</p>
          </li>`;
      })
      .join("");

    return `
      <div class="credits">
        <dl class="credits__list">
          <div><dt>${esc(ui("credits.owner"))}</dt><dd>${t(C.CREDITS.owner)}</dd></div>
          <div><dt>${esc(ui("credits.designer"))}</dt><dd>${t(C.CREDITS.designer)}</dd></div>
          <div><dt>${esc(ui("credits.thanks"))}</dt><dd>${t(C.CREDITS.thanks)}</dd></div>
        </dl>
        <h3 class="card-title card-title--center">${esc(ui("credits.artists"))}</h3>
        <ul class="artists">${artists}</ul>
        <h3 class="card-title card-title--center">${esc(ui("credits.assets"))}</h3>
        <ul class="credits__assets">${C.CREDITS.assets.map((a) => `<li>${t(a)}</li>`).join("")}</ul>
      </div>`;
  }

  return { profile, relationships, credits };
})();
