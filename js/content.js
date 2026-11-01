/*
 * Cupid — all character content lives here.
 *
 * Edit this file to change what the site says; the layout code never needs to change.
 *
 *  - Every text field is { th: "...", en: "..." }. An empty string shows a clearly
 *    marked "waiting for the owner" blank instead of made-up lore.
 *  - mode: "normal" = shown in Light and Dark mode
 *          "dark"   = only rendered in Dark mode (never placed in the page in Light mode)
 *  - Images are referenced by key from IMAGES below.
 *
 * PROVISIONAL: the red-circled reference that marks the Dark-mode photos was not in the
 * Google Drive folder. Images marked dark below were chosen by mood. To move an image,
 * change its mode here (and the mode of any diary page that shows it).
 */
window.CUPID_CONTENT = (function () {
  const blank = { th: "", en: "" };

  const IMAGES = {
    "fahsan-chibi-wink": {
      w: 1419, h: 1800, artist: "Fahsan", mode: "normal", cutout: true,
      alt: { th: "คิวปิดแบบจิบิ ขยิบตาพร้อมหัวใจ", en: "Chibi Cupid winking beside a heart" },
    },
    "father-portrait": {
      w: 1170, h: 1800, artist: "Father", mode: "normal",
      alt: { th: "ภาพเหมือนคิวปิดในเสื้อดำลาย DIE ALONE", en: "Portrait of Cupid in a black DIE ALONE top" },
    },
    "rapizran-chibi-full": {
      w: 1800, h: 1800, artist: "RapiZRAN", mode: "normal", cutout: true,
      alt: { th: "คิวปิดแบบจิบิเต็มตัว ด้านหน้า", en: "Full-body chibi Cupid, front view" },
    },
    "rapizran-night": {
      w: 1800, h: 1251, artist: "RapiZRAN", mode: "normal",
      alt: { th: "คิวปิดเอานิ้วแตะริมฝีปากบนพื้นดำ", en: "Cupid with a finger to the lips, on a black background" },
    },
    "rapizran-cake-card": {
      w: 1162, h: 1068, artist: "RapiZRAN", mode: "normal",
      alt: { th: "คิวปิดจิบิในเค้กสตรอว์เบอร์รี", en: "Chibi Cupid tucked inside a strawberry cake" },
    },
    "rapizran-cake": {
      w: 1162, h: 1068, artist: "RapiZRAN", mode: "normal", cutout: true,
      alt: { th: "สติกเกอร์คิวปิดในเค้ก", en: "Cake sticker of Cupid" },
    },
    "kanok-duo-a": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดยื่นของให้อีกคนหนึ่ง", en: "Cupid handing something to a companion" },
    },
    "kanok-duo-b": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดกับคนสำคัญ แบบสติกเกอร์", en: "Sticker of Cupid with a companion" },
    },
    "kanok-heart": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดกับคนสำคัญในกรอบหัวใจ", en: "Cupid and a companion inside a heart frame" },
    },
    // ---- dark mode only (provisional, see note at the top) ----
    "emakai-heart": {
      w: 1770, h: 1800, artist: "emakai", mode: "dark",
      alt: { th: "คิวปิดถือหัวใจไว้ในมือ ท่ามกลางเส้นสีแดง", en: "Cupid holding a heart among red veins" },
    },
    "maya-monochrome": {
      w: 1280, h: 1225, artist: "Maya Alphax", mode: "dark",
      alt: { th: "คิวปิดขาวดำ ยื่นมือออกไปในแสง", en: "Monochrome Cupid reaching into the light" },
    },
    "rapizran-pale-full": {
      w: 1251, h: 1800, artist: "RapiZRAN", mode: "dark", cutout: true,
      alt: { th: "ร่างผิวซีดผมยาวสีฟ้าชมพู มีผีเสื้อล้อมรอบ", en: "Pale long-haired figure with butterflies" },
    },
    "rapizran-butterflies": {
      w: 1800, h: 1251, artist: "RapiZRAN", mode: "dark",
      alt: { th: "ภาพขาวดำ ผีเสื้อและผมยาว", en: "Black-and-white drawing with butterflies and long hair" },
    },
  };

  const PROFILE = {
    name: "Cupid",
    nameTh: "คิวปิด",
    mainImage: "rapizran-chibi-full",
    intro: blank,
    // Basic information: label keys are translated in i18n.js; values are the owner's.
    facts: [
      { label: "fact.fullName", value: blank },
      { label: "fact.pronouns", value: blank },
      { label: "fact.age", value: blank },
      { label: "fact.birthday", value: blank },
      { label: "fact.height", value: blank },
      { label: "fact.species", value: blank },
      { label: "fact.occupation", value: blank },
    ],
    // Small notes pinned around the profile.
    notes: [
      { label: "note.personality", value: blank },
      { label: "note.likes", value: blank },
      { label: "note.dislikes", value: blank },
      { label: "note.trivia", value: blank },
    ],
    // Handwritten callouts on the main picture. These describe what is drawn, not lore.
    callouts: [
      { x: 19, y: 44, text: { th: "ต่างหูผีเสื้อ", en: "butterfly earring" } },
      { x: 81, y: 57, text: { th: "ลายกุหลาบที่แขนเสื้อ", en: "roses on the sleeves" } },
      { x: 76, y: 73, text: { th: "กระโปรงพันผูกข้าง", en: "wrap skirt, tied" } },
    ],
    palette: [
      { hex: "#b8bdc6", name: { th: "เทาเย็น", en: "Cool Gray" } },
      { hex: "#ff7593", name: { th: "ชมพูอ่อน", en: "Soft Pink" } },
      { hex: "#2c2930", name: { th: "ถ่านเข้ม", en: "Dark Charcoal" } },
      { hex: "#49363e", name: { th: "ม่วงน้ำตาลเข้ม", en: "Deep Brownish Purple" } },
      { hex: "#c9b9bc", name: { th: "เทากุหลาบ", en: "Dusty Rose Gray" } },
      { hex: "#994bdb", name: { th: "ม่วง", en: "Purple Accent" } },
      { hex: "#ffc271", name: { th: "เหลืองอุ่น", en: "Warm Yellow" } },
    ],
    // Shown only in Dark mode, under the profile.
    secret: {
      mode: "dark",
      image: "emakai-heart",
      title: { th: "อีกด้านหนึ่ง", en: "The other side" },
      text: blank,
    },
  };

  /*
   * Diary pages, in reading order. The book adds page numbers itself and skips
   * dark pages in Light mode. Keep the total of normal pages even and the total of
   * dark pages even, so the back cover always lands on a left-hand page.
   *
   * layouts: cover, bookplate, contents, portrait, about, polaroid, entry, duo,
   *          collage, bleed, torn, pair, memories, end, back
   */
  const DIARY = [
    { id: "cover", layout: "cover", mode: "normal", image: "fahsan-chibi-wink" },
    {
      id: "bookplate", layout: "bookplate", mode: "normal",
      note: blank, // a dedication line from the owner, if wanted
    },
    { id: "contents", layout: "contents", mode: "normal" },
    {
      id: "portrait", layout: "portrait", mode: "normal", image: "rapizran-chibi-full",
      title: { th: "ตัวฉันเอง", en: "Me, as drawn" },
      callouts: [
        { x: 17, y: 42, text: { th: "ผีเสื้อ ♡", en: "a butterfly ♡" } },
        { x: 84, y: 58, text: { th: "กุหลาบปัก", en: "stitched roses" } },
        { x: 76, y: 88, text: { th: "รองเท้าบู๊ตสีน้ำตาล", en: "brown boots" } },
      ],
      toc: true,
    },
    { id: "about", layout: "about", mode: "normal", title: { th: "เกี่ยวกับฉัน", en: "About me" }, toc: true },
    {
      id: "polaroid", layout: "polaroid", mode: "normal", image: "father-portrait",
      title: { th: "รูปที่ชอบที่สุด", en: "A favourite photo" },
      caption: { th: "DIE ALONE — ตัวหนังสือบนเสื้อ", en: "DIE ALONE — written on the shirt" },
      date: blank, entry: blank, toc: true,
    },
    {
      id: "entry-1", layout: "entry", mode: "normal", image: "rapizran-night",
      title: { th: "บันทึกหน้าแรก", en: "First entry" },
      date: blank, entry: blank, toc: true,
    },
    // ---- dark pages (only in Dark mode) ----
    {
      id: "torn-heart", layout: "bleed", mode: "dark", image: "emakai-heart",
      note: { th: "หน้านี้ถูกฉีกออก… แล้วแอบเย็บกลับมา", en: "this page was torn out… and sewn back in" },
      toc: true, title: { th: "หน้าที่ถูกฉีก", en: "The torn page" },
    },
    {
      id: "secret-entry", layout: "torn", mode: "dark", image: "maya-monochrome",
      title: { th: "อย่าอ่าน", en: "Don't read this" },
      date: blank, entry: blank,
    },
    // ---- back to normal pages ----
    {
      id: "duo", layout: "duo", mode: "normal", image: "kanok-duo-b", second: "kanok-duo-a",
      title: { th: "คนสำคัญ", en: "Someone dear" },
      who: blank, entry: blank, toc: true,
    },
    {
      id: "collage", layout: "collage", mode: "normal",
      images: ["kanok-heart", "rapizran-cake-card", "fahsan-chibi-wink", "rapizran-cake"],
      title: { th: "วันหวาน ๆ", en: "Sweet days" }, toc: true,
    },
    // ---- dark pages ----
    {
      id: "other-me", layout: "pair", mode: "dark", image: "rapizran-pale-full",
      title: { th: "เงาในกระจก", en: "In the mirror" }, entry: blank, toc: true,
    },
    {
      id: "butterflies", layout: "bleed", mode: "dark", image: "rapizran-butterflies",
      note: { th: "ผีเสื้อพวกนี้ไม่เคยบินหนีไปไหน", en: "the butterflies never fly away" },
    },
    // ---- ending ----
    { id: "memories", layout: "memories", mode: "normal", title: { th: "ความทรงจำที่เก็บไว้", en: "Kept memories" }, toc: true },
    { id: "end", layout: "end", mode: "normal", note: blank },
    { id: "back", layout: "back", mode: "normal" },
  ];

  const RELATIONSHIPS = [
    {
      id: "companion", mode: "normal", image: "kanok-heart",
      name: blank,
      type: blank,
      description: blank,
      sticker: "heart",
    },
    // Add more people by copying the block above. Use mode: "dark" for a secret one.
  ];

  const CREDITS = {
    owner: blank,
    // Artists come from the file names in the client's folder ("Cr. <name>").
    artists: ["RapiZRAN", "PpAws Kanok", "Fahsan", "Father", "Maya Alphax", "emakai"],
    designer: { th: "TST Project", en: "TST Project" },
    thanks: blank,
    assets: [
      { th: "ฟอนต์: Cormorant Garamond, EB Garamond, Caveat, Pinyon Script, Noto Serif Thai, Mali (Google Fonts, SIL OFL)", en: "Fonts: Cormorant Garamond, EB Garamond, Caveat, Pinyon Script, Noto Serif Thai, Mali (Google Fonts, SIL OFL)" },
      { th: "ลวดลายกระดาษ เทป หัวใจ และสติกเกอร์ วาดด้วยโค้ดสำหรับเว็บนี้", en: "Paper, tape, hearts and stickers drawn in code for this site" },
    ],
  };

  return { IMAGES, PROFILE, DIARY, RELATIONSHIPS, CREDITS };
})();
