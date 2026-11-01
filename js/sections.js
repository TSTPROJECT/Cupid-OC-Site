/* Profile, relationships and credits sections. */
window.CupidSections = (function () {
  const { C, esc, ui, txt, t, img, icon, isVisible } = window.Cupid;

  // A row or card the owner marked "Dark mode" (only ever built in Dark mode).
  const darkBadge = () => `<span class="dark-badge">❗️ ${esc(ui("profile.darkBadge"))}</span>`;

  function traits(id, list) {
    const items = list
      .filter(isVisible)
      .map(
        (it) => `
        <li class="trait${it.mode === "dark" ? " trait--dark" : ""}">
          ${it.mode === "dark" ? darkBadge() : ""}
          <h4 class="trait__name" lang="th">${esc(it.name)}</h4>
          ${it.nameEn ? `<p class="trait__en" lang="en">${esc(it.nameEn)}</p>` : ""}
          <p class="trait__text">${t(it.text)}</p>
        </li>`,
      )
      .join("");
    return `
      <section class="traits reveal" aria-labelledby="${id}-title">
        <h3 id="${id}-title" class="card-title card-title--center">${esc(ui("profile." + id))}</h3>
        <ul class="traits__list">${items}</ul>
      </section>`;
  }

  function profile() {
    const P = C.PROFILE;
    const facts = P.facts
      .filter(isVisible)
      .map(
        (f) => `
        <div class="facts__row${f.mode === "dark" ? " facts__row--dark" : ""}">
          <dt>${esc(ui(f.label))}</dt>
          <dd${f.label === "fact.name" ? ' class="hand"' : ""}>${t(f.value)}${f.mode === "dark" ? darkBadge() : ""}</dd>
        </div>`,
      )
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
    const notes = [
      { label: "note.hobbies", html: `<ul class="sticky__list">${P.hobbies.map((h) => `<li>${t(h)}</li>`).join("")}</ul>` },
      { label: "note.likes", html: `<p>${t(P.likes)}</p>` },
      { label: "note.dislikes", html: `<p>${t(P.dislikes)}</p>` },
    ]
      .map(
        (n, i) => `
        <li class="sticky sticky--${i % 4}">
          <h4>${esc(ui(n.label))}</h4>
          ${n.html}
        </li>`,
      )
      .join("");
    const callouts = P.callouts
      .map((c) => `<span class="callout" style="--x:${c.x};--y:${c.y}"><span>${esc(txt(c.text))}</span></span>`)
      .join("");
    // Only the English page needs to say why the details are in Thai.
    const thaiOnly = window.Cupid.state.lang === "en" ? ui("profile.thaiOnly") : "";

    let secret = "";
    if (isVisible(P.secret) && img(P.secret.image)) {
      secret = `
        <aside class="secret reveal" aria-labelledby="secret-title">
          <figure class="secret__art">${img(P.secret.image, { sizes: "(max-width: 860px) 90vw, 460px" })}</figure>
          <div class="secret__text">
            <p class="kicker kicker--dark">${icon.lock} ${esc(ui("profile.secretKicker"))}</p>
            <h3 id="secret-title" class="secret__title">${t(P.secret.title)}</h3>
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
          ${thaiOnly ? `<p class="profile__note">${esc(thaiOnly)}</p>` : ""}
          <section class="index-card" aria-labelledby="facts-title">
            <h3 id="facts-title" class="card-title">${esc(ui("profile.facts"))}</h3>
            <dl class="facts">${facts}</dl>
          </section>
          <section class="outfit" aria-labelledby="outfit-title">
            <span class="tape tape--top" aria-hidden="true"></span>
            <h3 id="outfit-title" class="card-title">${esc(ui("profile.outfit"))}</h3>
            <p>${t(P.outfit)}</p>
          </section>
          <section aria-labelledby="palette-title">
            <h3 id="palette-title" class="card-title">${esc(ui("profile.palette"))}</h3>
            <ul class="chips">${chips}</ul>
          </section>
        </div>
      </div>
      ${traits("abilities", P.abilities)}
      ${traits("personality", P.personality)}
      <section class="notes" aria-label="${esc(ui("profile.notes"))}">
        <ul class="notes__list">${notes}</ul>
      </section>
      <section class="story reveal" aria-labelledby="story-title">
        <h3 id="story-title" class="card-title card-title--center">${esc(ui("profile.story"))}</h3>
        <p class="story__text">${t(P.story)}</p>
        <figure class="testimony tilt-r">
          <span class="tape tape--top" aria-hidden="true"></span>
          <figcaption class="testimony__source">${t(P.testimony.source)}</figcaption>
          <blockquote class="testimony__quote hand">${t(P.testimony.quote)}</blockquote>
          <span class="testimony__heart" aria-hidden="true">${icon.heart}</span>
        </figure>
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
            ${r.appearance ? `<p class="rel-card__looks"><span class="label">${esc(ui("rel.looks"))}</span> ${t(r.appearance)}</p>` : ""}
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
