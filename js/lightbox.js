/* Photo viewer. Only opens images that are visible in the current theme. */
window.CupidLightbox = (function () {
  const { esc, ui, txt, image } = window.Cupid;
  let dialog = null;
  let lastFocus = null;

  function ensure() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.addEventListener("click", (e) => {
      // click on the backdrop (outside the photo card) closes
      if (e.target === dialog || e.target.closest("[data-close]")) close();
    });
    dialog.addEventListener("close", () => {
      dialog.innerHTML = "";
      document.documentElement.classList.remove("has-lightbox");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    document.body.appendChild(dialog);
    return dialog;
  }

  function open(key) {
    const im = image(key);
    if (!im) return;
    const d = ensure();
    lastFocus = document.activeElement;
    d.innerHTML = `
      <figure class="lightbox__card">
        <img src="assets/img/art/${esc(key)}.webp" width="${im.w}" height="${im.h}" alt="${esc(txt(im.alt))}">
        <figcaption><span class="hand">${esc(txt(im.alt))}</span><span class="lightbox__by">${esc(ui("lightbox.by"))} ${esc(im.artist)}</span></figcaption>
        <button type="button" class="icon-btn lightbox__close" data-close aria-label="${esc(ui("lightbox.close"))}">${window.Cupid.icon.close}</button>
      </figure>`;
    document.documentElement.classList.add("has-lightbox");
    d.showModal();
    d.querySelector("[data-close]").focus();
  }

  function close() {
    if (dialog && dialog.open) dialog.close();
  }

  /** Called on theme change: never leave a dark-only photo open in Light mode. */
  function refresh() {
    if (!dialog || !dialog.open) return;
    const src = dialog.querySelector("img");
    const key = src && src.getAttribute("src").replace(/^.*\/|\.webp$/g, "");
    if (!key || !image(key)) close();
  }

  return { open, close, refresh };
})();
