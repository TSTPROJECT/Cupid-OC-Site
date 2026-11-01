/*
 * A small page-turning book, written for this site (no library).
 *
 * Desktop ("spread"): two pages side by side; the cover sits alone on the right and the
 * back cover alone on the left, like a real book. Phones ("single"): one page at a time.
 *
 * A turning sheet ("leaf") always hinges on its left edge. Forward it rotates 0 → -180°
 * (showing the old right page, then the new left page on its back); backward it rotates
 * -180° → 0. Drag, swipe, page-corner clicks, buttons and arrow keys all drive the same turn.
 */
window.CupidFlipbook = function (root, opts) {
  const stage = root.querySelector(".book__stage");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  stage.innerHTML =
    '<div class="book__page book__page--left"></div>' +
    '<div class="book__page book__page--right"></div>' +
    '<div class="leaf" hidden><div class="leaf__face leaf__front"></div><div class="leaf__face leaf__back"></div></div>';
  const slotL = stage.querySelector(".book__page--left");
  const slotR = stage.querySelector(".book__page--right");
  const leaf = stage.querySelector(".leaf");
  const front = leaf.querySelector(".leaf__front");
  const back = leaf.querySelector(".leaf__back");

  let pages = []; // [{id, label, html}]
  let single = false;
  let pos = 0; // spread index (spread mode) or page index (single mode)
  let turning = null; // active turn

  const n = () => pages.length;
  const html = (i) => (i >= 0 && i < n() ? pages[i].html : "");
  const lastPos = () => (single ? n() - 1 : Math.floor(n() / 2));
  // page indexes shown in spread s: left = 2s-1, right = 2s
  const firstPageOf = (p) => (single ? p : Math.max(0, 2 * p - 1));
  const posOfPage = (i) => (single ? i : Math.floor((i + 1) / 2));

  function fill(slot, i) {
    slot.innerHTML = html(i);
    slot.classList.toggle("is-empty", !html(i));
  }

  function shiftFor(p) {
    if (single) return "";
    if (p === 0) return "at-start";
    if (p === lastPos() && n() % 2 === 0) return "at-end";
    return "";
  }

  function setShift(cls) {
    root.classList.toggle("at-start", cls === "at-start");
    root.classList.toggle("at-end", cls === "at-end");
  }

  function render() {
    if (single) {
      fill(slotR, pos);
      slotL.innerHTML = "";
    } else {
      fill(slotL, 2 * pos - 1);
      fill(slotR, 2 * pos);
    }
    setShift(shiftFor(pos));
    // empty the turning sheet so no page (e.g. a dark-only one) lingers hidden in the DOM
    leaf.hidden = true;
    front.innerHTML = "";
    back.innerHTML = "";
    opts.onChange && opts.onChange(status());
  }

  function status() {
    const shown = single ? [pos] : [2 * pos - 1, 2 * pos].filter((i) => i >= 0 && i < n());
    return {
      labels: shown.map((i) => pages[i].label),
      ids: shown.map((i) => pages[i].id),
      atStart: pos === 0,
      atEnd: pos === lastPos(),
      single,
    };
  }

  // ---------- turning ----------

  function begin(dir) {
    if (turning) return null;
    if (dir > 0 && pos >= lastPos()) return null;
    if (dir < 0 && pos <= 0) return null;
    const target = pos + dir;

    if (single) {
      if (dir > 0) {
        front.innerHTML = html(pos);
        fill(slotR, pos + 1);
      } else {
        front.innerHTML = html(pos - 1);
        fill(slotR, pos);
      }
      back.innerHTML = '<div class="page page--reverse"></div>';
    } else if (dir > 0) {
      front.innerHTML = html(2 * pos);
      back.innerHTML = html(2 * pos + 1) || '<div class="page page--reverse"></div>';
      fill(slotR, 2 * pos + 2);
    } else {
      front.innerHTML = html(2 * pos - 2);
      back.innerHTML = html(2 * pos - 1);
      fill(slotL, 2 * pos - 3);
    }
    leaf.classList.toggle("leaf--hard", !!leaf.querySelector(".page--hard"));
    leaf.hidden = false;
    setShift(shiftFor(target));
    turning = { dir, target, progress: 0 };
    draw(0);
    if (opts.onTurn) opts.onTurn(dir);
    return turning;
  }

  /** progress 0 = not turned, 1 = fully turned */
  function draw(progress) {
    turning.progress = progress;
    const angle = turning.dir > 0 ? -180 * progress : -180 * (1 - progress);
    const lift = Math.sin(Math.PI * progress);
    leaf.style.transform = `perspective(2400px) rotateY(${angle}deg)`;
    root.style.setProperty("--fold", lift.toFixed(3));
    // which half of the leaf faces the reader (for the shading gradient direction)
    root.style.setProperty("--fold-side", angle < -90 ? "1" : "0");
    if (single) leaf.style.opacity = String(angle < -90 ? Math.max(0, 1 + (angle + 90) / 60) : 1);
  }

  function finish(done) {
    const t = turning;
    turning = null;
    root.style.removeProperty("--fold");
    leaf.style.opacity = "";
    if (done) pos = t.target;
    else setShift(shiftFor(pos));
    render();
  }

  function animateTo(goal, ms) {
    return new Promise((resolve) => {
      const t = turning;
      if (!t) return resolve();
      const from = t.progress;
      const dur = reduce.matches ? 0 : ms * Math.abs(goal - from);
      if (dur < 16) {
        draw(goal);
        return resolve();
      }
      const t0 = performance.now();
      const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      function frame(now) {
        if (turning !== t) return resolve(); // pages were replaced mid-turn
        const k = Math.min(1, (now - t0) / dur);
        draw(from + (goal - from) * ease(k));
        if (k < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  async function turn(dir) {
    const t = begin(dir);
    if (!t) return;
    await animateTo(1, 820);
    if (turning === t) finish(true);
  }

  // ---------- pointer: drag, swipe, tap ----------

  let drag = null;
  const THRESHOLD = 8;

  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || turning) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, dir: 0, t: performance.now(), target: e.target };
  });

  stage.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
        if (Math.abs(dy) > THRESHOLD * 2) drag = null; // vertical scroll — let the page scroll
        return;
      }
      drag.moved = true;
      drag.dir = dx < 0 ? 1 : -1;
      if (!begin(drag.dir)) {
        drag = null;
        return;
      }
      stage.setPointerCapture(e.pointerId);
    }
    if (!turning) return;
    const width = slotR.getBoundingClientRect().width * (single ? 1 : 1.3);
    const progress = Math.min(1, Math.max(0, (-dx * drag.dir) / width));
    draw(progress);
  });

  async function release(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (d.moved && turning) {
      const dt = performance.now() - d.t;
      const fast = dt < 300 && Math.abs(e.clientX - d.x) > 30; // a flick
      const t = turning;
      const done = t.progress > 0.3 || fast;
      await animateTo(done ? 1 : 0, 700);
      if (turning === t) finish(done);
      return;
    }
    if (e.type === "pointercancel") return;
    tap(e, d.target);
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  function tap(e, target) {
    const goto = target.closest && target.closest("[data-goto]");
    if (goto) return go(goto.getAttribute("data-goto"));
    const zoom = target.closest && target.closest("[data-zoom]");
    if (zoom) return opts.onZoom && opts.onZoom(zoom.getAttribute("data-zoom"));
    // page corners / outer edges turn the page
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const edge = single ? 0.3 : 0.16;
    if (x > 1 - edge) turn(1);
    else if (x < edge) turn(-1);
  }

  // Corner buttons are for keyboard and screen readers too.
  root.addEventListener("keydown", (e) => {
    if (e.target.closest("button, a, input")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      turn(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      turn(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      jump(0);
    } else if (e.key === "End") {
      e.preventDefault();
      jump(lastPos());
    }
  });

  // ---------- public ----------

  function jump(p) {
    if (turning) return;
    pos = Math.max(0, Math.min(lastPos(), p));
    render();
  }

  /** Go to a page by id; turns once if it is the next/previous spread, else jumps. */
  function go(id) {
    const i = pages.findIndex((p) => p.id === id);
    if (i < 0) return;
    const p = posOfPage(i);
    if (p === pos + 1) turn(1);
    else if (p === pos - 1) turn(-1);
    else jump(p);
  }

  /** Replace the pages (theme or language changed), staying on the same page if it still exists. */
  function setPages(list, keepIds) {
    const prev = pages;
    const curFirst = prev.length ? prev[firstPageOf(pos)] : null;
    pages = list;
    let i = -1;
    // keep the page the reader was on; if it was a dark page that just vanished,
    // fall back to the nearest earlier page that still exists
    const ids = keepIds || (curFirst ? [curFirst.id] : []);
    for (const id of ids) {
      i = list.findIndex((p) => p.id === id);
      if (i >= 0) break;
    }
    if (i < 0 && curFirst) {
      const prevIdx = prev.indexOf(curFirst);
      for (let k = prevIdx; k >= 0 && i < 0; k--) i = list.findIndex((p) => p.id === prev[k].id);
    }
    if (turning) {
      turning = null;
      root.style.removeProperty("--fold");
    }
    pos = i >= 0 ? posOfPage(i) : 0;
    pos = Math.min(pos, lastPos());
    render();
  }

  function setSingle(on) {
    if (on === single) return;
    const curPage = pages.length ? firstPageOf(pos) : 0;
    // when going to two pages, keep the right-hand page of the spread visible
    single = on;
    root.classList.toggle("is-single", on);
    pos = posOfPage(curPage);
    pos = Math.min(pos, lastPos());
    if (pages.length) render();
  }

  return {
    next: () => turn(1),
    prev: () => turn(-1),
    first: () => jump(0),
    go,
    setPages,
    setSingle,
    status,
    get currentIds() {
      return pages.length ? status().ids : [];
    },
  };
};
