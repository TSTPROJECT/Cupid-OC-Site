/*
 * Music and sound effects, made in the browser with the Web Audio API (no audio files,
 * so nothing to license). Light mode plays a music-box waltz in F major; Dark mode plays
 * the same story in D minor — slower, slightly out of tune, with a drone and a heartbeat.
 * Switching theme crossfades between them.
 *
 * Sound only starts after the reader clicks something (browsers block autoplay), and the
 * choice to mute is remembered. If the owner later supplies real music, set
 * CUPID_CONTENT.AUDIO.music.light / .dark to file paths and those play instead.
 */
window.CupidAudio = (function () {
  const { C, store } = window.Cupid;
  const AC = window.AudioContext || window.webkitAudioContext;

  let ctx = null;
  let master, musicBus, sfxBus, reverb, reverbSend, noise;
  let enabled = store.get("cupid.sound") !== "off";
  let mode = "light";
  let started = false; // music started after the first click
  const tracks = {}; // mode -> { bus, start(t), stop() }

  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  // ---------- setup ----------

  function init() {
    if (ctx || !AC) return !!ctx;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 1 : 0;
    master.connect(ctx.destination);

    musicBus = ctx.createGain();
    musicBus.gain.value = 0.42;
    musicBus.connect(master);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.7;
    sfxBus.connect(master);

    // a soft room: convolution with a decaying noise burst
    reverb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.8);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    reverb.buffer = ir;
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.55;
    reverbSend.connect(reverb);
    reverb.connect(master);

    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (enabled) ctx.resume();
    });
    return true;
  }

  function out(node, bus, wet) {
    node.connect(bus);
    if (wet) {
      const s = ctx.createGain();
      s.gain.value = wet;
      node.connect(s);
      s.connect(reverbSend);
    }
  }

  // ---------- instruments ----------

  /** A music-box tine: a sine with two quiet overtones and a long ringing decay. */
  function bell(t, midi, vel, bus, o) {
    o = o || {};
    const f = hz(midi) * (o.detune || 1);
    const g = ctx.createGain();
    const decay = o.decay || Math.max(0.9, 2.6 - (midi - 60) * 0.04);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    out(g, bus, o.wet == null ? 0.5 : o.wet);
    [
      [1, 1],
      [2, 0.22],
      [4.02, 0.06],
    ].forEach(([mult, amp]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f * mult;
      if (o.wobble) {
        // a tired, slightly bent tine
        osc.frequency.setValueAtTime(f * mult * (1 - o.wobble), t);
        osc.frequency.linearRampToValueAtTime(f * mult, t + 0.12);
      }
      const a = ctx.createGain();
      a.gain.value = amp;
      osc.connect(a);
      a.connect(g);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });
  }

  /** A soft sustained chord under the melody. */
  function pad(t, midis, dur, vel, bus, cutoff) {
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = cutoff || 900;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + Math.min(0.8, dur * 0.3));
    g.gain.setValueAtTime(vel, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    lp.connect(g);
    out(g, bus, 0.35);
    midis.forEach((m, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.value = hz(m);
      osc.detune.value = (i % 2 ? 6 : -6);
      osc.connect(lp);
      osc.start(t);
      osc.stop(t + dur + 0.7);
    });
  }

  /** A low heartbeat thump (dark mode). */
  function thump(t, vel, bus) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(78, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.22);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    osc.connect(g);
    out(g, bus, 0.15);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  function noiseHit(t, o) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = o.type || "bandpass";
    f.Q.value = o.q || 0.8;
    f.frequency.setValueAtTime(o.from, t);
    f.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vel, t + (o.attack || 0.03));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f);
    f.connect(g);
    out(g, sfxBus, o.wet || 0.1);
    src.start(t, Math.random() * 0.5);
    src.stop(t + o.dur + 0.05);
  }

  // ---------- the two pieces ----------

  // [beat, midi, length] — 3/4 time, 8 bars (24 beats), then it loops.
  const LIGHT = {
    bpm: 88,
    melody: [
      [0, 72, 1], [1, 69, 0.5], [1.5, 72, 0.5], [2, 77, 1],
      [3, 76, 1], [4, 74, 1], [5, 69, 1],
      [6, 74, 1.5], [7.5, 72, 0.5], [8, 70, 1],
      [9, 69, 1], [10, 67, 1], [11, 72, 1],
      [12, 72, 1], [13, 69, 0.5], [13.5, 72, 0.5], [14, 81, 1],
      [15, 79, 1], [16, 76, 1], [17, 72, 1],
      [18, 74, 1], [19, 77, 0.5], [19.5, 76, 0.5], [20, 79, 1],
      [21, 77, 2], [23, 72, 1],
    ],
    // one chord per bar: [root, chord tones]
    chords: [
      [41, [53, 57, 60]], [38, [50, 53, 57]], [46, [50, 53, 58]], [36, [48, 52, 55]],
      [41, [53, 57, 60]], [45, [52, 57, 60]], [46, [50, 53, 58]], [41, [53, 57, 60]],
    ],
  };

  const DARK = {
    bpm: 66,
    melody: [
      [0, 69, 1], [1, 65, 0.5], [1.5, 69, 0.5], [2, 74, 1],
      [3, 74, 1], [4, 72, 1], [5, 65, 1],
      [6, 70, 1.5], [7.5, 69, 0.5], [8, 67, 1],
      [9, 64, 1], [10, 69, 1], [11, 73, 1],
      [12, 74, 1], [13, 69, 0.5], [13.5, 65, 0.5], [14, 77, 1],
      [15, 76, 1], [16, 72, 1], [17, 69, 1],
      [18, 70, 1], [19, 74, 0.5], [19.5, 73, 0.5], [20, 76, 1],
      [21, 74, 3],
    ],
    chords: [
      [38, [50, 53, 57]], [34, [50, 53, 58]], [43, [50, 55, 58]], [33, [49, 52, 57]],
      [38, [50, 53, 57]], [41, [48, 53, 57]], [43, [50, 55, 58]], [38, [50, 53, 57]],
    ],
  };

  function synthTrack(piece, dark) {
    const bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.connect(musicBus);
    const beat = 60 / piece.bpm;
    const LOOP = 24;
    const events = [];
    piece.melody.forEach(([b, m, len], i) =>
      events.push({ b, fn: (t) => bell(t, m, 0.16 + (i % 3 === 0 ? 0.05 : 0), bus, dark ? { wobble: 0.012, detune: 0.997, decay: 2.8 } : {}) }),
    );
    piece.chords.forEach(([root, tones], bar) => {
      const b0 = bar * 3;
      events.push({ b: b0, fn: (t) => bell(t, root + 12, 0.1, bus, { decay: 2.2, wet: 0.3 }) });
      if (!dark) {
        // oom-pah-pah on beats 2 and 3
        events.push({ b: b0 + 1, fn: (t) => tones.slice(1).forEach((m) => bell(t, m, 0.035, bus, { decay: 0.9, wet: 0.3 })) });
        events.push({ b: b0 + 2, fn: (t) => tones.slice(1).forEach((m) => bell(t, m, 0.03, bus, { decay: 0.9, wet: 0.3 })) });
        events.push({ b: b0, fn: (t) => pad(t, tones, 3 * beat, 0.025, bus, 1100) });
      } else {
        events.push({ b: b0, fn: (t) => pad(t, [root, root + 7, ...tones], 3 * beat, 0.04, bus, 520) });
        if (bar % 2 === 0) {
          events.push({ b: b0, fn: (t) => thump(t, 0.32, bus) });
          events.push({ b: b0 + 0.35, fn: (t) => thump(t + 0, 0.2, bus) });
        }
      }
    });
    events.sort((a, b) => a.b - b.b);

    let timer = null;
    let idx = 0;
    let loopStart = 0;
    function tick() {
      const horizon = ctx.currentTime + 0.3;
      for (;;) {
        const e = events[idx];
        const t = loopStart + e.b * beat;
        if (t > horizon) break;
        if (t >= ctx.currentTime - 0.05) e.fn(t);
        idx++;
        if (idx >= events.length) {
          idx = 0;
          loopStart += LOOP * beat;
        }
      }
    }
    return {
      bus,
      start(t) {
        if (timer) return;
        idx = 0;
        loopStart = t;
        tick();
        timer = setInterval(tick, 50);
      },
      stop() {
        clearInterval(timer);
        timer = null;
      },
    };
  }

  /** A looping audio file supplied by the owner. */
  function fileTrack(src) {
    const bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.connect(musicBus);
    const el = new Audio(src);
    el.loop = true;
    el.preload = "none";
    el.crossOrigin = "anonymous";
    ctx.createMediaElementSource(el).connect(bus);
    return {
      bus,
      start() {
        el.play().catch(() => {});
      },
      stop() {
        el.pause();
      },
    };
  }

  function track(m) {
    if (!tracks[m]) {
      const files = C.AUDIO && C.AUDIO.music;
      tracks[m] = files && files[m] ? fileTrack(files[m]) : synthTrack(m === "dark" ? DARK : LIGHT, m === "dark");
    }
    return tracks[m];
  }

  function fade(param, to, secs) {
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    // linear, so the incoming piece is heard at once and the two overlap evenly
    param.linearRampToValueAtTime(to, now + secs);
  }

  // ---------- public ----------

  /** Start the music (must be called from a click or key press). */
  function start(theme) {
    mode = theme;
    if (!enabled || !init()) return;
    ctx.resume();
    if (started) return;
    started = true;
    const tr = track(mode);
    tr.start(ctx.currentTime + 0.4);
    fade(tr.bus.gain, 1, 2.5);
  }

  /** Crossfade to the other piece when the theme changes. */
  function setMode(theme) {
    if (theme === mode) return;
    const prev = mode;
    mode = theme;
    if (!ctx || !started) return;
    const old = tracks[prev];
    if (old) {
      fade(old.bus.gain, 0.0001, 1.6);
      setTimeout(() => {
        if (mode !== prev) old.stop();
      }, 1700);
    }
    const tr = track(mode);
    tr.stop();
    tr.start(ctx.currentTime + 0.25);
    fade(tr.bus.gain, 1, 2.2);
  }

  function setEnabled(on) {
    enabled = on;
    store.set("cupid.sound", on ? "on" : "off");
    if (!on) {
      if (ctx) {
        fade(master.gain, 0.0001, 0.3);
        setTimeout(() => !enabled && ctx.suspend(), 350);
      }
      return;
    }
    if (!init()) return;
    ctx.resume();
    fade(master.gain, 1, 0.4);
  }

  const sfx = {
    page() {
      if (!ready()) return;
      const t = ctx.currentTime;
      noiseHit(t, { from: 700, to: 2600, dur: 0.32, vel: 0.22, q: 0.7 });
      noiseHit(t + 0.2, { type: "highpass", from: 2500, to: 4200, dur: 0.12, vel: 0.06, q: 0.5 });
    },
    tick() {
      if (!ready()) return;
      bell(ctx.currentTime, 96, 0.05, sfxBus, { decay: 0.25, wet: 0.2 });
    },
    theme(dark) {
      if (!ready()) return;
      const t = ctx.currentTime;
      const notes = dark ? [86, 81, 77, 74] : [77, 81, 84, 89];
      notes.forEach((m, i) => bell(t + i * 0.09, m, 0.09, sfxBus, { decay: 1.6, wet: 0.7, wobble: dark ? 0.01 : 0 }));
      noiseHit(t, { type: "lowpass", from: dark ? 3000 : 600, to: dark ? 400 : 3200, dur: 0.6, vel: 0.05, wet: 0.5 });
    },
    open() {
      if (!ready()) return;
      const t = ctx.currentTime;
      thump(t, 0.25, sfxBus);
      noiseHit(t + 0.02, { type: "lowpass", from: 400, to: 1800, dur: 0.5, vel: 0.08, wet: 0.3 });
      [77, 81, 84, 89].forEach((m, i) => bell(t + 0.25 + i * 0.11, m, 0.08, sfxBus, { decay: 1.8, wet: 0.7 }));
    },
    zoom() {
      if (!ready()) return;
      const t = ctx.currentTime;
      noiseHit(t, { type: "lowpass", from: 500, to: 2400, dur: 0.22, vel: 0.07 });
      bell(t + 0.04, 89, 0.05, sfxBus, { decay: 0.8, wet: 0.5 });
    },
  };

  function ready() {
    return enabled && ctx && ctx.state !== "closed";
  }

  return {
    start,
    setMode,
    setEnabled,
    sfx,
    get enabled() {
      return enabled;
    },
    /** For checking in the browser console. */
    get status() {
      const g = (m) => (tracks[m] ? +tracks[m].bus.gain.value.toFixed(3) : null);
      return { context: ctx ? ctx.state : "none", mode, started, light: g("light"), dark: g("dark"), master: ctx ? +master.gain.value.toFixed(3) : null };
    },
    supported: !!AC,
  };
})();
