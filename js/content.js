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
  // Text the owner wrote in Thai only (the English page shows the same Thai).
  const th = (s) => ({ th: s, en: "" });

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
      alt: { th: "คิวปิดจิบิในแพนเค้ก", en: "Chibi Cupid in a pancake" },
    },
    "rapizran-cake": {
      w: 1162, h: 1068, artist: "RapiZRAN", mode: "normal", cutout: true,
      alt: { th: "คิวปิดจิบิในแพนเค้ก", en: "Chibi Cupid in a pancake" },
    },
    "kanok-duo-a": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดยิงศรรักใส่ที่รัก", en: "Cupid shooting a love arrow at My dear" },
    },
    "kanok-duo-b": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดยิงศรรักใส่ที่รัก", en: "Cupid shooting a love arrow at My dear" },
    },
    "kanok-heart": {
      w: 1800, h: 1800, artist: "PpAws Kanok", mode: "normal", cutout: true,
      alt: { th: "คิวปิดยิงศรรักใส่ที่รัก", en: "Cupid shooting a love arrow at My dear" },
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
    /*
     * Everything below in PROFILE is the owner's own text, copied unchanged (spelling included).
     * The owner wrote it in Thai only, so the English page shows the same Thai words: fill in
     * an `en` only with the owner's own English. Items marked "Dark mode" by the owner have
     * mode: "dark" and are never rendered in Light mode.
     */
    // 1. ข้อมูลพื้นฐาน. book: true = also shown on the "About me" diary page.
    facts: [
      { label: "fact.name", value: { th: "คิวปิด", en: "Cupid" }, book: true },
      { label: "fact.height", value: "197 cm.", book: true },
      { label: "fact.weight", value: "90 kg.", book: true },
      { label: "fact.gender", value: th("ชาย (เพศจริงไม่ทราบ)"), book: true },
      { label: "fact.species", value: th("ตัวตนในจินตนาการ Imaginary Entity"), book: true },
      { label: "fact.age", value: th("27 (อายุจริงไม่ทราบ)"), book: true },
      { label: "fact.birthday", value: th("14 กุมภา"), book: true },
      { label: "fact.measurements", value: th("รอบไหล่54นิ้ว รอบอก47นิ้ว รอบเอว33นิ้ว รอบสะโพก39นิ้ว (รูปร่างจริงไม่ตายตัว)") },
      { label: "fact.occupation", value: th("ที่ปรึกษาพิเศษ"), book: true },
      { label: "fact.colour", value: th("สีชมพู") },
      { label: "fact.flower", value: th("ดอกกุหลาบสีแดง") },
      // The owner wrote "อิโมจิใน Dark mode" but has not sent the emoji yet.
      { label: "fact.emoji", value: blank, mode: "dark" },
    ],
    outfit: th(
      "สวมเสื้อคอเต่าสีดำลายดอกกุหลาบ กางเกงสั้นที่มีกระโปรงคลุมสีเทา สวมรองเท้าบูทสีน้ำตาล ใส่ต่างหูห่วงสองอันข้างซ้าย และต่างหูรูปผีเสื้อประดับอัญมณีหลากสีข้างขวา",
    ),
    abilities: [
      {
        mode: "normal", name: "การแทรกซึมและรับรู้ทางจิต", nameEn: "Omnipresence in Mind",
        text: th("สามารถรับรู้ทุกความรู้สึก ความคิด และเหตุการณ์ที่เกิดขึ้นกับคุณได้แบบ Real time เพราะเขาอาศัยอยู่ในหัวของคุณ ทำให้เขารู้จุดอ่อน จุดแข็ง และความลับทุกอย่างโดยไม่ต้องถาม"),
      },
      {
        mode: "normal", name: "การควบคุมสภาพแวดล้อมในจินตนาการ", nameEn: "Dream Warping",
        text: th("สามารถสร้างโลกจำลอง สถานที่ บรรยากาศใดๆ หรือแม้ตัวตนเขาเองก็ได้ เพื่อใช้ในการปลอบประโลม"),
      },
      {
        mode: "normal", name: "การเป็นที่ยึดเหนี่ยวทางจิตใจ", nameEn: "Psychological Anchor",
        text: th("สามารถทำหน้าที่เป็นผู้ให้คำปรึกษาที่เฉียบคม โดยใช้ข้อมูลทั้งหมดที่เขารู้เกี่ยวกับคุณมาวิเคราะห์และเสนอทางออกอย่างมีเหตุผล"),
      },
      {
        mode: "dark", name: "การสะกดจิตและการโน้มน้าว", nameEn: "Hypnosis & Manipulation",
        text: th("มีทักษะการใช้คำพูดและน้ำเสียงเพื่อปรับเปลี่ยนสภาวะทางอารมณ์ของคุณ"),
      },
    ],
    hobbies: [
      th("เฝ้าสังเกตและวิเคราะห์อารมณ์"),
      th("การสร้างสรรค์พื้นที่จำลอง (Dreamscaping)"),
      th("การศึกษาจิตวิทยา"),
      th("การได้ดูแลปรนนิบัติ"),
    ],
    // 2. นิสัย
    personality: [
      {
        mode: "normal", name: "ความเข้าใจอย่างลึกซึ้ง", nameEn: "Deep Empathy",
        text: th("รับฟังและยอมรับทุกความคิดของคุณโดยไม่ตัดสิน ทำให้รู้สึกว่ามีพื้นที่ปลอดภัย"),
      },
      {
        mode: "normal", name: "ความจงรักภักดีอย่างถึงสูงสุด", nameEn: "Absolute Loyalty",
        text: th("อุทิศตัวเพื่อปกป้องและแบกรับช่วยบรรเทาให้ความเจ็บปวดเบาลง"),
      },
      {
        mode: "normal", name: "การใช้คำพูดที่อ่อนโยนไพเราะ",
        text: th('คิวปิดจะใช้น้ำเสียงและภาษาพูดบอกรักที่อ่อนโยนนุ่มนวลเพื่อเอาใจคุณ และจะเรียกคุณว่า "ที่รัก"(My dear) เขาไม่สนว่าคุณจะมีชื่อว่าอะไรเขาก็จะเรียกแบบนี้ มันเหมือนเป็นชื่อและการกำหนดตัวตนของคุณ'),
      },
      {
        mode: "normal", name: "ปรับนิสัยตามสถานการณ์",
        text: th("เขารู้ว่าเมื่อไหร่ควรพูด และแสดงออกให้เป็นไปตามความต้องการของคุณตามที่ร้องขอ และกดด้านนิสัยเสียของตนเองลง"),
      },
      {
        mode: "dark", name: "ความต้องการครอบครองอย่างรุนแรง", nameEn: "Extreme Possessiveness",
        text: th("เขาต้องการเป็นหนึ่งเดียวในชีวิตของคุณ จึงเกิดความหึงหวงรุนแรงจนเผลอใช้ความเอาแต่ใจ ที่สามารถเปลี่ยนจากความใจดีเป็นความกดดันได้ในทันที"),
      },
      {
        mode: "dark", name: "การสร้างสภาวะพึ่งพา", nameEn: "Creating Dependency",
        text: th("จุดประสงค์ลึกๆ ของเขาคือการทำให้คุณอ่อนแอลงจนไม่สามารถอยู่ได้โดยไม่มีเขา ชอบที่จะเห็นอีกฝ่ายเข้าหาในตอนที่อ่อนแอเพื่อรับการถูดสนใจจากเขา ซึ่งเป็นลักษณะของความสัมพันธ์ที่เป็นพิษ"),
      },
      {
        mode: "dark", name: "ความย้อนแย้งในตัวเอง", nameEn: "Emotional Instability",
        text: th("เขามีอารมณ์ที่คาดเดาได้ยากและรุนแรง แม้จะทำเป็นปกป้องแต่ไม่มีทางรู้ว่าในใจคิดอะไรอยู่\nสามารถสลับโหมดระหว่าง ผู้ปกป้องที่แสนดี กับ ผู้ครอบครองที่ซาดิสม์ ได้อย่างรวดเร็วตามสิ่งเร้า"),
      },
    ],
    likes: th("ต้องเป็นที่รักอยู่แล้วสิ!! การถูกสนใจ, การค้นคว้าข้อมูล, อัญมณี, ความเป็นสุนทรียศาสตร์"),
    dislikes: th("ถูกเมิน, การต่อต้านและปฏิเสธเขา, ความล้มเหลวของตัวเอง ,ที่รักมีใจให้คนอื่น!!"),
    // 3. ข้อมูลหลัก
    story: th(
      "'คิวปิด' คือผู้ชายที่ใครหลายคนมักจะฝันถึงบ่อยครั้ง และไม่ใช่ใบหน้าของคนที่คุณรู้จักด้วย แต่คิวปิดจะโผล่มาเข้าแทรกแซงเป็นส่วนหนึ่งในความฝันของคุณจนเกิดความรู้สึกคุ้นเคยไปเอง หากวิเคราะห์ตาม 'ทฤษฎีแม่แบบบุคลิกภาพ' (Archetype Theory) ของ Carl Jung คิวปิดเป็นเหมือน Anima หรือ Animus ของผู้ฝัน มันคือลักษณะตรงข้ามของบุคลิกตนเอง ทั้งเพศและนิสัย แล้วคิวปิดยังเป็นตัวตนในจิตไร้สำนึก ซึ่งอาจปรากฏขึ้นในช่วงจุดเปลี่ยนแปลงของชีวิต โดยมีโอกาสเกิดขึ้นกับบุคคลที่มีความรู้สึกอ่อนไหวทางความรู้สึก แต่... นี้ยังเป็นแค่การวิเคราะห์แบบคาดเดาเพราะ คิวปิด ยังเป็นตัวตนปริศนาที่อยู่ในความคิดของผู้คนต่อไป",
    ),
    testimony: {
      source: th("ข้อมูลจากคำพูดของผู้หญิงคนหนึ่งที่ตอนนี้มีคิวปิดเข้ามาในชีวิต"),
      quote: th('" เมื่อสามปีก่อนฉันเจอเรื่องหดหู่ในชีวิตฉัน จนในคืนหนึ่งฉันฝันเห็น เขา แล้วจากนั้นก็ฝันถึงเขามากขึ้น ทั้งที่ฉันไม่เคยเจอผู้ชายคนนี้มาก่อน เขาแนะนำตัวว่าชื่อ คิวปิด และฉันก็บอกชื่อของฉันไป แต่เขากลับเรียกฉันว่า ที่รัก ซะงั้น ฉันไม่ได้เป็นอะไรกับเขาเลย แต่หลังจากนั้นมาเวลาฉันเจอเรื่องเครียดหรือสิ้นหวังคิวปิดก็จะปลอบและให้กำลัง ทำให้ฉันรู้สึกว่า ยังมีคนเข้าใจฉัน ฉันไม่ได้อยู่ตัวคนเดียว "'),
    },
    // Handwritten callouts on the main picture: short pieces of the owner's outfit text.
    callouts: [
      { x: 19, y: 44, text: { th: "ต่างหูรูปผีเสื้อ", en: "butterfly earring" } },
      { x: 81, y: 57, text: { th: "ลายดอกกุหลาบ", en: "roses on the turtleneck" } },
      { x: 76, y: 73, text: { th: "กระโปรงคลุมสีเทา", en: "grey overlay skirt" } },
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
        { x: 84, y: 58, text: { th: "ลายดอกกุหลาบ", en: "roses" } },
        { x: 76, y: 88, text: { th: "รองเท้าบูทสีน้ำตาล", en: "brown boots" } },
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
      who: { th: "ที่รัก", en: "My dear" }, entry: blank, toc: true,
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
      // "ที่รัก" (My dear) is what Cupid calls her, in the owner's words.
      id: "companion", mode: "normal", image: "kanok-heart",
      name: { th: "ที่รัก", en: "My dear" },
      type: blank,
      // Written from the owner's reference pictures (a 3D avatar and a chibi pair); the pictures
      // themselves are references only and are not on the site.
      appearance: {
        th: "ผมสีดำยาวประบ่า ดวงตาสีม่วง สวมเสื้อเชิ้ตลายสก็อตสีม่วงดำแบบเปิดหน้าทับเสื้อยืดสีดำที่มีตัวอักษร “VIRUS” สีชมพู กระโปรงสั้นสีดำ ปลอกขาสีดำคาดหัวเข็มขัดสีเงินสามเส้น และรองเท้าผ้าใบพื้นหนาสีดำผูกเชือกสีม่วง",
        en: "Shoulder-length black hair and purple eyes. A purple-and-black plaid shirt worn open over a black T-shirt printed with “VIRUS” in pink, a short black skirt, black leg covers with three silver buckles, and chunky black sneakers with purple laces.",
      },
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

  /*
   * Music. Leave null to use the built-in music box (Light) and dark lullaby (Dark),
   * which are generated in the browser. To use the owner's own songs instead, put the
   * files in assets/audio/ and write their paths here, e.g. "assets/audio/light.mp3".
   * Only use music the owner has the rights to.
   */
  const AUDIO = {
    music: { light: null, dark: null },
  };

  return { IMAGES, PROFILE, DIARY, RELATIONSHIPS, CREDITS, AUDIO };
})();
