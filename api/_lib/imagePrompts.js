/**
 * GET /api/orders/:id/prompts
 *
 * Returns the full structured image-prompt payload for an order.
 * Layers: Character Bible → Scene Extraction → Prompt Generator → Cover Prompt
 *
 * Output shape:
 * {
 *   order_id, child_name, theme, style_lock,
 *   character_bible: { description, visual_tags },
 *   cover_prompt: "...",
 *   page_prompts: [
 *     { page_number, prompt, scene_summary, emotion, environment, characters_present }
 *     × 16
 *   ]
 * }
 *
 * ?save=1  → also PATCH the order row with image_prompts JSON (requires
 *             image_prompts jsonb column in Supabase orders table)
 */

// ---------------------------------------------------------------------------
// STYLE LOCK — injected into every prompt for visual consistency
// ---------------------------------------------------------------------------
const STYLE_LOCK =
  "cinematic children's book illustration, soft warm lighting, magical atmosphere, " +
  "ultra detailed 4k, premium storybook style, expressive character face, " +
  "rich saturated colors, consistent character design throughout, " +
  "painterly digital art, wide-angle composition, " +
  "NO text, NO letters, NO words, NO typography, NO signs, NO labels, NO captions, NO titles, purely visual storytelling"

// ---------------------------------------------------------------------------
// CHARACTER DIVERSITY SYSTEM
//
// Produces a stable, visually unique character identity per order.
// Two different children will have clearly different faces — not just
// different hair/eye colors, but different face shapes, proportions,
// expressions, and overall visual energy.
//
// Architecture:
//   1. Strong multi-field hash → deterministic seed
//   2. Seed selects 1 of 10 distinct facial archetypes
//   3. Appearance fields (skin/hair/eyes) layer on top of archetype
//   4. Every prompt receives full archetype + appearance + consistency lock
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// STEP 1 — Strong deterministic hash
// Combines child_name + gender + age_group + theme + order_id (if available)
// so that even identical names produce different characters when other
// inputs differ.
// ---------------------------------------------------------------------------
function strongHash(str) {
  // FNV-1a 32-bit — much better distribution than the old x*31 hash
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h
}

function deriveSeed(child_name, gender, age_group, theme, orderId) {
  // Mix all available signals — order ID gives per-order entropy even
  // when names repeat (e.g. two children named "سارة" get different faces)
  const raw = [
    child_name.trim().toLowerCase(),
    gender || 'unknown',
    age_group || 'unknown',
    theme || 'unknown',
    // Take last 8 chars of orderId to add per-order uniqueness
    (orderId || '').slice(-8),
  ].join('|')
  return strongHash(raw)
}

// ---------------------------------------------------------------------------
// STEP 2 — 10 Distinct Facial Archetypes
//
// Each archetype defines a completely different visual identity:
// face shape, proportions, eye style, cheek/nose structure, emotional vibe.
// These are the core — appearance fields (skin/hair/eyes) layer on top.
// ---------------------------------------------------------------------------
const ARCHETYPES = [
  {
    id: 'A1',
    name: 'The Dreamer',
    face: 'softly rounded face with gently wide-set large almond eyes, full soft cheeks, small delicate nose, slightly parted lips in a quiet wonder expression',
    proportions: 'large forehead, small chin, wide face relative to height, eyes taking up significant proportion of face',
    vibe: 'calm, gentle, introspective — as if always thinking about something magical',
    eye_style: 'large wide-open almond-shaped eyes with long lashes and a soft dreamy gaze',
  },
  {
    id: 'A2',
    name: 'The Bold Explorer',
    face: 'strong square-ish jaw, high cheekbones, alert narrow eyes full of intensity, defined brow ridge, prominent nose bridge, determined set mouth',
    proportions: 'face longer than wide, strong angular features for a child, chin slightly prominent, eyebrows thick and expressive',
    vibe: 'confident, brave, action-ready — radiates leadership and fearlessness',
    eye_style: 'sharp narrow eyes that always look like they are scanning for the next challenge',
  },
  {
    id: 'A3',
    name: 'The Joyful Spark',
    face: 'perfectly round chubby face, button nose, apple cheeks that push up the eyes when smiling, wide mouth with an infectious huge grin, dimples',
    proportions: 'very round head, wide cheeks, small nose and chin, face almost as wide as it is tall, ears visible',
    vibe: 'radiantly happy, energetic, magnetic — the child who lights up every room',
    eye_style: 'crinkled upward-curved eyes that nearly close when smiling, full of sparkle',
  },
  {
    id: 'A4',
    name: 'The Wise One',
    face: 'oval refined face with a calm composed expression, slightly narrower eyes with an intelligent steady gaze, straight refined nose, closed-lip thoughtful smile',
    proportions: 'face taller than wide, balanced features, eyes at precise midpoint of face, mature proportions for a child',
    vibe: 'old-soul calm, quietly wise, observant — someone who understands more than they say',
    eye_style: 'steady half-lidded dark eyes with a calm knowing quality, not wide open',
  },
  {
    id: 'A5',
    name: 'The Wild Spirit',
    face: 'angular asymmetric face with character, one slightly raised eyebrow always, sharp expressive features, strong jaw, animated and slightly mischievous mouth',
    proportions: 'face slightly narrow and long, angular cheekbones, strong defined chin, expressive forehead',
    vibe: 'unpredictable, energetic, mischievous, full of life and surprises',
    eye_style: 'asymmetric lively eyes — one slightly wider than the other, always glinting with plans',
  },
  {
    id: 'A6',
    name: 'The Gentle Giant',
    face: 'broad wide face with a large kind forehead, wide-set soft deep eyes, rounded broad nose, gentle soft jaw, warm encompassing expression',
    proportions: 'face very wide and broad, large head, wide-set eyes far apart, broad forehead dominant',
    vibe: 'gentle, warm, protective, trustworthy — big heart visible in every feature',
    eye_style: 'wide-set deep-set gentle eyes with a warm protective quality, slightly downturned at outer corners',
  },
  {
    id: 'A7',
    name: 'The Fierce Dreamer',
    face: 'heart-shaped face with pointed chin, very large expressive eyes, high arched brows, delicate small nose, slightly pouty dramatic mouth',
    proportions: 'wide upper face narrowing sharply to pointed chin, large eyes dominate the face, high forehead',
    vibe: 'emotional, dramatic, passionate — feels everything deeply and shows it',
    eye_style: 'very large upward-tilted eyes with heavy upper lashes, intensely expressive and emotive',
  },
  {
    id: 'A8',
    name: 'The Quiet Rebel',
    face: 'sharp angular features with strong cheekbones, slightly sunken cheeks, intense direct gaze, straight serious mouth, strong brow',
    proportions: 'narrow face, prominent cheekbones, slightly gaunt angular quality, strong chin, face longer than wide',
    vibe: 'independent, determined, slightly serious — marches to their own beat',
    eye_style: 'direct intense eyes that look straight at you, slightly narrowed with focus and resolve',
  },
  {
    id: 'A9',
    name: 'The Sunshine Child',
    face: 'soft triangular face with high rounded cheeks, upturned small nose, large round bright eyes, always slightly open mouth as if about to laugh, rosy flush on cheeks',
    proportions: 'wider in the middle of the face at cheek level, narrowing gently to forehead and chin, cheeks prominent',
    vibe: 'warm, optimistic, radiantly friendly — makes everyone feel welcome',
    eye_style: 'large perfectly round bright eyes with a warm sunny sparkle, always looking slightly upward with optimism',
  },
  {
    id: 'A10',
    name: 'The Mysterious Wanderer',
    face: 'long angular face with deep-set hooded eyes, strong defined nose, serious set jaw, minimal expression masking great depth',
    proportions: 'face notably long and narrow, deep-set eyes under prominent brow, long nose, angular jaw structure',
    vibe: 'mysterious, contemplative, deeply curious — carries a sense of hidden adventures',
    eye_style: 'deep-set hooded eyes that seem to hold secrets, heavy-lidded with an intense interior gaze',
  },
]

// ---------------------------------------------------------------------------
// STEP 3 — Select archetype deterministically
// ---------------------------------------------------------------------------
function selectArchetype(seed) {
  return ARCHETYPES[seed % ARCHETYPES.length]
}

// ---------------------------------------------------------------------------
// CHARACTER BIBLE BUILDER
// ---------------------------------------------------------------------------
function buildCharacterBible(child_name, gender, age_group, theme, appearance, orderId) {
  const isMale = gender === 'male' || gender === 'boy' || gender === 'ذكر'
  const pronoun = isMale ? 'boy' : 'girl'

  // Deterministic seed from all available signals
  const seed = deriveSeed(child_name, gender, age_group, theme, orderId)

  // Select unique facial archetype for this child
  const archetype = selectArchetype(seed)

  // ── Age ──────────────────────────────────────────────────────────────────
  const ageMap = {
    '2-4':  { label: '3-year-old toddler',    size: 'tiny child' },
    '3-5':  { label: '4-year-old',            size: 'small child' },
    '4-6':  { label: '5-year-old',            size: 'small curious child' },
    '5-7':  { label: '6-year-old',            size: 'young school-age child' },
    '6-8':  { label: '7-year-old',            size: 'adventurous child' },
    '7-10': { label: '8-to-9-year-old',       size: 'confident young child' },
    '8-10': { label: '9-year-old',            size: 'confident young child' },
  }
  const age = ageMap[age_group] || { label: '6-year-old', size: 'young child' }

  // ── Skin tone ─────────────────────────────────────────────────────────────
  const skinLabel = {
    fair:   'fair light skin with rosy cheeks',
    medium: 'warm medium-olive skin',
    olive:  'warm olive skin',
    brown:  'rich medium-brown skin',
    dark:   'deep warm dark-brown skin',
  }
  const DEFAULT_SKINS = [
    'warm golden-olive skin',
    'medium brown skin',
    'light olive skin',
    'warm tan skin',
    'rich dark brown skin',
    'warm caramel skin',
    'golden-brown skin',
  ]
  const skin = appearance?.skin_tone
    ? (skinLabel[appearance.skin_tone] || 'warm olive skin')
    : DEFAULT_SKINS[(seed >> 3) % DEFAULT_SKINS.length]

  // ── Hair ──────────────────────────────────────────────────────────────────
  const hairColorLabel = {
    black:        'black',
    'dark brown': 'dark brown',
    brown:        'light brown',
    blonde:       'golden-blonde',
    red:          'auburn-red',
  }
  const hairTypeLabel = {
    straight: 'straight',
    wavy:     'wavy',
    curly:    'curly',
  }
  const DEFAULT_HAIR_M = [
    'very short cropped black hair',
    'short dark brown curly hair',
    'short wavy black hair with a side part',
    'short straight dark hair swept to one side',
    'tightly curled black hair kept short',
    'short dark wavy hair with loose curls at the forehead',
    'shaved sides with short curly black hair on top',
  ]
  const DEFAULT_HAIR_F = [
    'long black hair in a thick braid down the back',
    'long dark brown wavy hair worn loose',
    'shoulder-length black curly hair',
    'long straight dark hair tied in a high ponytail',
    'long thick black hair with a colorful headband',
    'half-up half-down dark wavy hair',
    'two loose buns of dark curly hair on top of head',
  ]

  let hair, hairColorExplicit
  if (appearance?.hair_color || appearance?.hair_type) {
    hairColorExplicit = hairColorLabel[appearance.hair_color] || 'dark'
    const type        = hairTypeLabel[appearance.hair_type] || (isMale ? 'short' : 'long')
    hair = isMale
      ? `short ${type} ${hairColorExplicit} hair`
      : `${type} ${hairColorExplicit} hair${appearance.hair_type === 'curly' ? ', worn loose' : ' in a loose braid'}`
  } else {
    hairColorExplicit = null
    const defaults = isMale ? DEFAULT_HAIR_M : DEFAULT_HAIR_F
    hair = defaults[(seed >> 5) % defaults.length]
  }

  // ── Eyes ──────────────────────────────────────────────────────────────────
  const eyeLabel = {
    'dark brown': 'deep dark-brown eyes',
    brown:        'warm brown eyes',
    hazel:        'bright hazel eyes',
    green:        'striking green eyes',
    blue:         'clear blue eyes',
  }
  const DEFAULT_EYES = [
    'dark brown eyes',
    'warm deep brown eyes',
    'rich black-brown eyes',
    'bright amber-brown eyes',
    'deep espresso-brown eyes',
    'warm hazel-brown eyes',
    'striking dark eyes with golden flecks',
  ]
  const eyes = appearance?.eye_color
    ? (eyeLabel[appearance.eye_color] || 'dark brown eyes')
    : DEFAULT_EYES[(seed >> 7) % DEFAULT_EYES.length]

  // ── Outfit (theme-specific) ────────────────────────────────────────────────
  const outfitMap = {
    jungle:  isMale ? 'khaki explorer shorts and an olive green shirt, small backpack' : 'teal adventure dress, small backpack, sandals',
    space:   isMale ? 'silver and white junior astronaut suit, round helmet visor' : 'purple and white junior astronaut suit, round helmet visor',
    ocean:   isMale ? 'bright blue swim shorts and a yellow rash guard' : 'turquoise swimsuit with a starfish clip in hair',
    forest:  isMale ? 'forest-green linen tunic and brown trousers, leather boots' : 'sage-green dress with embroidered leaves, brown ankle boots',
    desert:  isMale ? 'white cotton tunic and loose trousers, dusty boots, small leather satchel' : 'white and gold embroidered dress, sandals, headscarf edges showing',
    farm:    isMale ? 'denim overalls, red flannel shirt, straw hat, rubber boots' : 'floral dress under denim dungarees, straw hat, rubber boots',
  }
  const outfit = outfitMap[theme] || outfitMap.forest

  // ── Assemble full character description ───────────────────────────────────
  const description =
    `UNIQUE CHARACTER IDENTITY [${archetype.id} — ${archetype.name}]: ` +
    `${child_name} is a ${age.label} Arabic ${pronoun} with a ${archetype.face}. ` +
    `Face proportions: ${archetype.proportions}. ` +
    `Eye style: ${archetype.eye_style}. ` +
    `Overall visual energy: ${archetype.vibe}. ` +
    `Skin: ${skin}. Hair: ${hair}. Eyes: ${eyes}. ` +
    `Wearing: ${outfit}. ` +
    `CRITICAL: This EXACT face must appear identically on EVERY page — ` +
    `same unique facial structure, same proportions, same eye shape, same identity. ` +
    `DO NOT draw a generic or average child face. ` +
    `This character is visually distinct and must look nothing like a default illustration child.`

  // ── Identity lock — short-form, appearance-only.
  // Injected at the START of every prompt (before the scene) so the image
  // model anchors on these attributes first, and again at the END as a
  // hard "must not change" reinforcement after the event description.
  const hairLockPhrase = hairColorExplicit
    ? `HAIR COLOR: ${hairColorExplicit} (MANDATORY — must match exactly) | hair style: ${hair} | `
    : `hair: ${hair} | `

  const identity_lock =
    `LOCKED CHARACTER — NEVER CHANGE THESE ON ANY PAGE: ` +
    `${child_name} | ${age.label} Arabic ${pronoun} | ` +
    `skin: ${skin} | ` +
    hairLockPhrase +
    `eyes: ${eyes} | ` +
    `outfit: ${outfit} | ` +
    `face structure [${archetype.id}]: ${archetype.face.split(',').slice(0, 2).join(',')}. ` +
    `Same skin tone, same hair color, same hair shape, same eye color, same gender, same face — every page.`

  const visual_tags = [
    `${child_name}`,
    `${age.label} Arabic ${pronoun}`,
    archetype.name,
    archetype.face.split(',')[0],
    hair,
    eyes,
    skin,
    outfit,
    'strict character consistency across all pages',
  ]

  return {
    description,
    identity_lock,
    skin,
    hair,
    hair_color: hairColorExplicit,
    eyes,
    visual_tags,
    archetype_id:   archetype.id,
    archetype_name: archetype.name,
  }
}

// ---------------------------------------------------------------------------
// SCENE METADATA — per-theme, 17 entries (index 0 = cover, 1–16 = pages)
// Fields: summary (Arabic), emotion, environment, key_action, characters
// ---------------------------------------------------------------------------
const SCENE_METADATA = {
  jungle: [
    { summary: 'البطل على حافة الغابة عند الفجر', emotion: 'دهشة وإثارة', environment: 'حافة الغابة المدارية', key_action: 'الوقوف والتطلع', characters: ['hero'] },
    { summary: 'البطل يستيقظ على أصوات الغابة', emotion: 'فضول وترقب', environment: 'غرفة نوم بنافذة مطلة على الغابة', key_action: 'الاستيقاظ', characters: ['hero'] },
    { summary: 'البطل يدخل الغابة الزمردية', emotion: 'مغامرة وشجاعة', environment: 'قلب الغابة المضيئة', key_action: 'الدخول والاستكشاف', characters: ['hero'] },
    { summary: 'البطل يجد ببغاءً صغيراً مصاباً', emotion: 'حنان وتعاطف', environment: 'غصن شجرة في الغابة', key_action: 'تمديد اليد بلطف', characters: ['hero', 'parrot'] },
    { summary: 'البطل يحمل الببغاء ويكمل الطريق', emotion: 'عزم وتصميم', environment: 'ممر الغابة', key_action: 'المشي بثقة', characters: ['hero', 'parrot'] },
    { summary: 'البطل يواجه جدار الكروم الكثيفة', emotion: 'تحدٍّ وإصرار', environment: 'جدار كروم يعترض الطريق', key_action: 'البحث عن مخرج', characters: ['hero', 'parrot'] },
    { summary: 'البطل يصادق فيلاً عملاقاً طيباً', emotion: 'ذهول وبهجة', environment: 'فسحة مضاءة بالشمس', key_action: 'الاقتراب بثقة', characters: ['hero', 'elephant', 'parrot'] },
    { summary: 'البطل يعبر الجسر الخشبي فوق النهر', emotion: 'خوف وشجاعة في آنٍ معاً', environment: 'جسر معلق فوق نهر سريع', key_action: 'العبور الحذر', characters: ['hero', 'parrot'] },
    { summary: 'عاصفة مطرية فوق الجسر', emotion: 'توتر وتصميم', environment: 'جسر معلق في وسط عاصفة', key_action: 'التمسك والمضي قدماً', characters: ['hero', 'parrot'] },
    { summary: 'البطل يحتمي تحت ورقة عملاقة في المطر', emotion: 'راحة وأمان', environment: 'ملجأ طبيعي في الغابة المطيرة', key_action: 'الاحتماء والتأمل', characters: ['hero', 'parrot'] },
    { summary: 'البطل يكتشف آثار أقدام الطيور', emotion: 'إثارة ويقظة', environment: 'أرض الغابة الطينية', key_action: 'الركوع وتتبع الأثر', characters: ['hero', 'parrot'] },
    { summary: 'البطل يتبع الطريق بثقة', emotion: 'تفاؤل وعزم', environment: 'ممر الغابة', key_action: 'المشي بخطوات واثقة', characters: ['hero', 'parrot'] },
    { summary: 'البطل يصعد تلة فيها الشجرة العجيبة', emotion: 'شوق وأمل', environment: 'تلة صغيرة مع شجرة عملاقة', key_action: 'التسلق والصعود', characters: ['hero', 'parrot'] },
    { summary: 'لمّ شمل الببغاء بعائلته في القمة', emotion: 'فرح غامر ودموع سعادة', environment: 'قمة الشجرة المقدسة', key_action: 'إعادة الببغاء لعائلته', characters: ['hero', 'parrot', 'bird_family'] },
    { summary: 'البطل يجلس تحت الشجرة محاطاً بالطيور', emotion: 'رضا وسكينة', environment: 'تحت الشجرة العجيبة عند الغروب', key_action: 'الجلوس والاستراحة', characters: ['hero', 'birds', 'elephant'] },
    { summary: 'البطل يعود للمنزل عبر الغابة عند الغروب', emotion: 'امتنان وسعادة', environment: 'الغابة عند الغروب', key_action: 'العودة للمنزل', characters: ['hero'] },
    { summary: 'البطل ينام مبتسماً بعد المغامرة', emotion: 'رضا وحلم سعيد', environment: 'غرفة النوم ليلاً', key_action: 'النوم الهانئ', characters: ['hero'] },
  ],
  space: [
    { summary: 'البطل يرصد النجوم من السطح', emotion: 'فضول وحلم', environment: 'سطح المنزل ليلاً', key_action: 'التحديق في السماء', characters: ['hero'] },
    { summary: 'البطل يكتشف رسالة في السماء', emotion: 'دهشة وإثارة', environment: 'نافذة غرفة النوم ليلاً', key_action: 'قراءة رسالة النجوم', characters: ['hero'] },
    { summary: 'البطل يدخل الصاروخ الفضي', emotion: 'جرأة وتصميم', environment: 'منصة الإطلاق المضيئة', key_action: 'الدخول للصاروخ', characters: ['hero'] },
    { summary: 'الإطلاق عبر الغلاف الجوي', emotion: 'بهجة وإثارة قصوى', environment: 'الصاروخ يخترق الغلاف الجوي', key_action: 'الانطلاق', characters: ['hero'] },
    { summary: 'البطل يطفو بعديم الجاذبية', emotion: 'ضحك وبهجة', environment: 'كابينة الصاروخ في الفضاء', key_action: 'الطيران الحر', characters: ['hero'] },
    { summary: 'البطل يعثر على روبوت رفيق', emotion: 'مفاجأة وصداقة', environment: 'كابينة الصاروخ', key_action: 'اكتشاف الروبوت', characters: ['hero', 'robot'] },
    { summary: 'البطل والروبوت يشاهدان الكوكب المسرج', emotion: 'إعجاب وخشوع', environment: 'نافذة الصاروخ', key_action: 'التأمل والتعجب', characters: ['hero', 'robot'] },
    { summary: 'الملاحة بين حزام الكويكبات', emotion: 'تركيز وإثارة', environment: 'حزام الكويكبات الملوّن', key_action: 'قيادة الصاروخ بمهارة', characters: ['hero', 'robot'] },
    { summary: 'البطل والروبوت وسط زخة النيازك', emotion: 'خوف وشجاعة', environment: 'زخة نيازك مضيئة', key_action: 'التمسك والمواجهة', characters: ['hero', 'robot'] },
    { summary: 'الإبحار قرب السديم الكوني الملوّن', emotion: 'ذهول وإلهام', environment: 'سديم وردي وأزرق الألوان', key_action: 'التأمل في الجمال الكوني', characters: ['hero', 'robot'] },
    { summary: 'البطل يهبط على القمر البلوري', emotion: 'تميز وفخر', environment: 'سطح القمر الفضي', key_action: 'الهبوط الأول', characters: ['hero', 'robot'] },
    { summary: 'البطل يغرز علمه في القمر', emotion: 'انتصار وفخر', environment: 'سطح القمر بشروق الأرض خلفه', key_action: 'غرز العلم', characters: ['hero', 'robot'] },
    { summary: 'البطل والروبوت يتأملان مجرة درب التبانة', emotion: 'هدوء وتأمل', environment: 'سطح القمر بالليل', key_action: 'الجلوس والتأمل', characters: ['hero', 'robot'] },
    { summary: 'العودة إلى الأرض', emotion: 'شوق للوطن وامتنان', environment: 'الصاروخ متجهاً نحو الأرض', key_action: 'القيادة للعودة', characters: ['hero', 'robot'] },
    { summary: 'الهبوط على المحيط عند الفجر', emotion: 'راحة وانتصار', environment: 'مياه المحيط عند الشروق', key_action: 'الهبوط الآمن', characters: ['hero', 'robot'] },
    { summary: 'البطل يتأمل النجوم من أرضه مرة أخرى', emotion: 'امتنان ورؤية جديدة', environment: 'العشب ليلاً', key_action: 'التأمل بعيون جديدة', characters: ['hero', 'robot'] },
  ],
  ocean: [
    { summary: 'البطل على الرصيف عند الشروق', emotion: 'هدوء وشوق', environment: 'رصيف خشبي على البحر', key_action: 'التطلع للأفق', characters: ['hero'] },
    { summary: 'البطل يجد رسالة في زجاجة', emotion: 'دهشة وفضول', environment: 'شاطئ بضباب الصباح', key_action: 'فتح الزجاجة الغامضة', characters: ['hero'] },
    { summary: 'البطل يغطس في البحر الكريستالي', emotion: 'جرأة وإثارة', environment: 'المياه الفيروزية الضحلة', key_action: 'الغطس الأول', characters: ['hero'] },
    { summary: 'البطل تحت الماء وسط الأسماك الملوّنة', emotion: 'بهجة ودهشة', environment: 'الشعاب المرجانية الزاهية', key_action: 'السباحة والاستكشاف', characters: ['hero', 'fish'] },
    { summary: 'البطل يصادق دولفيناً ودوداً', emotion: 'صداقة وسعادة', environment: 'الشعاب المرجانية', key_action: 'التعارف بالعيون', characters: ['hero', 'dolphin'] },
    { summary: 'البطل يركب ظهر الدولفين', emotion: 'إثارة وحرية', environment: 'المياه الضحلة المضيئة', key_action: 'الإبحار معاً بسرعة', characters: ['hero', 'dolphin'] },
    { summary: 'البطل يدخل قصر مائي قديم', emotion: 'خشوع وإعجاب', environment: 'قصر مرجاني قديم تحت الماء', key_action: 'الدخول باحترام', characters: ['hero', 'dolphin'] },
    { summary: 'البطل في كهف أثناء تيار مفاجئ', emotion: 'توتر وشجاعة', environment: 'كهف تحت مائي مع تيارات', key_action: 'التمسك والتصدي', characters: ['hero'] },
    { summary: 'البطل محاصر بالتيار والدولفين ينقذه', emotion: 'خوف ثم امتنان', environment: 'التيارات المائية العميقة', key_action: 'الإنقاذ', characters: ['hero', 'dolphin'] },
    { summary: 'البطل والدولفين في غابة الأعشاب البحرية', emotion: 'سحر وهدوء', environment: 'غابة الأعشاب البحرية الذهبية', key_action: 'الإبحار بين الأعشاب', characters: ['hero', 'dolphin'] },
    { summary: 'البطل يكتشف حديقة المحيط الخفية', emotion: 'بهجة وإعجاب', environment: 'حديقة الشقائق البحرية المضيئة', key_action: 'الاستكشاف', characters: ['hero', 'dolphin'] },
    { summary: 'البطل يحرر حوتاً صغيراً', emotion: 'تعاطف وشجاعة', environment: 'الأعشاب البحرية', key_action: 'تحرير الحوت بلطف', characters: ['hero', 'whale'] },
    { summary: 'البطل والدولفين يشاهدان الحوت وهو يقفز', emotion: 'فرح وانتصار', environment: 'السطح عند الغروب', key_action: 'مشاهدة قفزة الحوت', characters: ['hero', 'dolphin', 'whale'] },
    { summary: 'البطل يطفو عند السطح عند الغروب', emotion: 'راحة وامتنان', environment: 'السطح والسماء البرتقالية', key_action: 'الطفو والتنفس', characters: ['hero'] },
    { summary: 'البطل على الشاطئ عند الغسق يودع الدولفين', emotion: 'وداع حانٍ', environment: 'الشاطئ عند المساء', key_action: 'الوداع', characters: ['hero', 'dolphin'] },
    { summary: 'البطل ينام في أرجوحة على الشاطئ', emotion: 'رضا وحلم هادئ', environment: 'الشاطئ ليلاً بنجوم منعكسة', key_action: 'النوم الهادئ', characters: ['hero'] },
  ],
  forest: [
    { summary: 'البطل على حافة الغابة القديمة الضبابية', emotion: 'خشوع وترقب', environment: 'حافة الغابة القديمة عند الفجر', key_action: 'الوقوف والنظر', characters: ['hero'] },
    { summary: 'البطل يسمع همسة الشجرة القديمة', emotion: 'دهشة وتساؤل', environment: 'أمام الشجرة الأقدم في الغابة', key_action: 'إصغاء الأذن للقشرة', characters: ['hero'] },
    { summary: 'البطل يصادق أرنباً أبيض بعيون عسلية', emotion: 'بهجة وحب', environment: 'فسحة مضيئة بالزهور البرية', key_action: 'التعارف والصداقة', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يتبع الأرنب في الغابة', emotion: 'فضول ومغامرة', environment: 'ممر الغابة المحاط بالسراخس', key_action: 'اتباع الأرنب', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يعبر جسر الكروم فوق الوادي', emotion: 'خوف وشجاعة', environment: 'جسر كروم فوق وادٍ ضبابي', key_action: 'الخطوة الأولى الشجاعة', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يواجه أشجار الحارسين العملاقة', emotion: 'هيبة وعزم', environment: 'ثلاث أشجار عملاقة تسد الطريق', key_action: 'الوقوف والتحدث', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يتحدث بشجاعة للأشجار الحارسة', emotion: 'شجاعة وإقناع', environment: 'أمام الأشجار العملاقة المضيئة', key_action: 'التحدث باحترام وشجاعة', characters: ['hero', 'guardian_trees'] },
    { summary: 'البطل يكتشف النبع الخفي المضيء', emotion: 'إعجاب وخشوع', environment: 'النبع الخفي وسط الأزهار المضيئة', key_action: 'الاقتراب بتأنٍّ', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يملأ قارورة الكريستال من النبع', emotion: 'تركيز وقداسة', environment: 'النبع المضيء', key_action: 'ملء القارورة بحرص', characters: ['hero'] },
    { summary: 'البطل والأرنب يركضان عبر الغابة', emotion: 'إثارة وأمل', environment: 'الغابة والأضواء تشتد', key_action: 'الجري السريع', characters: ['hero', 'rabbit'] },
    { summary: 'البطل يسكب الماء على جذور شجرة القلب', emotion: 'تفاني وأمل', environment: 'جذور شجرة القلب', key_action: 'سكب الماء بحب', characters: ['hero', 'rabbit'] },
    { summary: 'شجرة القلب تزهر من جديد بشكل سحري', emotion: 'فرح غامر ودموع سعادة', environment: 'شجرة القلب تنبعث من جديد', key_action: 'مشاهدة الإحياء', characters: ['hero', 'rabbit', 'tree'] },
    { summary: 'البطل محاط بحيوانات الغابة المحتفلة', emotion: 'بهجة ومحبة', environment: 'حول شجرة القلب المعافاة', key_action: 'الاحتفال المشترك', characters: ['hero', 'forest_animals'] },
    { summary: 'البطل يتلقى هدية ورقة مضيئة من الشجرة', emotion: 'امتنان وتشريف', environment: 'تحت شجرة القلب', key_action: 'قبول الهدية', characters: ['hero', 'tree'] },
    { summary: 'البطل يعود للمنزل والورقة تضيء الطريق', emotion: 'سعادة وامتنان', environment: 'الغابة عند الغروب', key_action: 'العودة بالهدية', characters: ['hero', 'rabbit'] },
    { summary: 'البطل في غرفته والورقة تضيء المكان', emotion: 'دفء وإلهام', environment: 'مكتب غرفة النوم ليلاً', key_action: 'الكتابة في اليوميات', characters: ['hero'] },
  ],
  desert: [
    { summary: 'البطل على حافة الصحراء الذهبية عند الفجر', emotion: 'إقبال على المجهول', environment: 'حافة الصحراء عند الفجر', key_action: 'التطلع للكثبان', characters: ['hero'] },
    { summary: 'البطل يجد جرة طينية قديمة بين الكثبان', emotion: 'دهشة وفضول', environment: 'الكثبان الرملية عند الفجر', key_action: 'اكتشاف الجرة', characters: ['hero'] },
    { summary: 'البطل يدرس الخريطة مع شيوخ القرية', emotion: 'جدية وتعلم', environment: 'قرية صحراوية بنار الليل', key_action: 'الاستماع والتعلم', characters: ['hero', 'elders'] },
    { summary: 'البطل يغادر وحيداً عبر الصحراء', emotion: 'شجاعة وعزم', environment: 'الصحراء عند الشروق', key_action: 'الانطلاق وحيداً', characters: ['hero'] },
    { summary: 'البطل يتسلق كثيباً عملاقاً تحت الشمس الحارقة', emotion: 'جهد وإصرار', environment: 'كثيب رملي عملاق عند الظهيرة', key_action: 'التسلق بعزم', characters: ['hero'] },
    { summary: 'البطل يرتاح في ظل صخرة يراجع الخريطة', emotion: 'شك ثم عزم', environment: 'ظل صخرة رملية', key_action: 'المراجعة واتخاذ القرار', characters: ['hero'] },
    { summary: 'البطل يلتقي بثعلب الصحراء المرشد', emotion: 'دهشة وتعلق', environment: 'الصحراء الرملية', key_action: 'لحظة التعارف السحرية', characters: ['hero', 'fox'] },
    { summary: 'البطل يتبع الثعلب في الكانيون الصخري', emotion: 'فضول وثقة', environment: 'كانيون صخري ضيق أحمر', key_action: 'السير في الكانيون', characters: ['hero', 'fox'] },
    { summary: 'البطل يرى الواحة للمرة الأولى', emotion: 'انبهار وتصديق بصعوبة', environment: 'مخرج الكانيون المطل على الواحة', key_action: 'رؤية الواحة عن بعد', characters: ['hero', 'fox'] },
    { summary: 'البطل يصل إلى الواحة الخفية', emotion: 'راحة وإعجاب', environment: 'الواحة الخضراء بالنخيل والبرك', key_action: 'الوصول والدخول', characters: ['hero', 'fox'] },
    { summary: 'البطل يشرب من بركة الواحة الصافية', emotion: 'ارتواء وامتنان', environment: 'البركة الفيروزية في الواحة', key_action: 'الشرب والراحة', characters: ['hero', 'fox'] },
    { summary: 'البطل يجد دائرة الأحجار المنقوشة', emotion: 'تساؤل وأهمية', environment: 'دائرة أحجار حول الواحة', key_action: 'دراسة الأحجار', characters: ['hero', 'fox'] },
    { summary: 'البطل ينقش اسمه في الحجر الفارغ', emotion: 'شعور بالانتماء والأهمية', environment: 'دائرة الأحجار بضوء ذهبي', key_action: 'النقش في الحجر', characters: ['hero'] },
    { summary: 'البطل ينام تحت النجوم عند الواحة', emotion: 'سلام وسعادة', environment: 'الواحة ليلاً بنجوم وبرق', key_action: 'النوم تحت النجوم', characters: ['hero', 'fox'] },
    { summary: 'البطل يعود للقرية يعرف الطريق الآن', emotion: 'ثقة ونضج', environment: 'الصحراء عند الشروق في العودة', key_action: 'العودة بثقة', characters: ['hero'] },
    { summary: 'البطل مع أهل القرية والأطفال حول الواحة', emotion: 'فرح وانتماء', environment: 'الواحة ليلاً بنار الاحتفال', key_action: 'الاحتفال المشترك', characters: ['hero', 'villagers'] },
  ],
  farm: [
    { summary: 'البطل يصحو قبل الفجر في المزرعة', emotion: 'يقظة ومسؤولية', environment: 'المزرعة عند أول ضوء الفجر', key_action: 'الاستيقاظ المبكر', characters: ['hero'] },
    { summary: 'البطل يرى سحب العاصفة تقترب', emotion: 'قلق وتنبه', environment: 'الحقول والأفق الداكن', key_action: 'رصد الخطر', characters: ['hero'] },
    { summary: 'البطل يجمع الحيوانات في الإسطبل', emotion: 'قيادة وتنظيم', environment: 'الإسطبل بضوء الصباح', key_action: 'تجميع الحيوانات وتوجيهها', characters: ['hero', 'farm_animals'] },
    { summary: 'البطل والحيوانات يحصدون في الحقل', emotion: 'تعاون وهدف مشترك', environment: 'الحقل المضيء بالشمس', key_action: 'الحصاد معاً', characters: ['hero', 'horses', 'animals'] },
    { summary: 'السباق ضد العاصفة الداكنة', emotion: 'توتر وإصرار', environment: 'الحقل والسماء الداكنة', key_action: 'الإسراع في العمل', characters: ['hero', 'animals'] },
    { summary: 'البطل يتوقف للتفكير حين تبدو العاصفة غالبة', emotion: 'تساؤل وقيادة', environment: 'وسط الحقل في أول المطر', key_action: 'الاستراتيجية والتفكير', characters: ['hero'] },
    { summary: 'حيوانات جديدة تأتي مستجيبة لنداء البطل', emotion: 'مفاجأة وامتنان', environment: 'الحقل والمزرعة كلها', key_action: 'استقبال المساعدة الجديدة', characters: ['hero', 'all_animals'] },
    { summary: 'البطل يقود الجميع في الدفعة الأخيرة', emotion: 'شجاعة وقيادة', environment: 'الحقل بأضواء البرق الخلفية', key_action: 'القيادة الجماعية', characters: ['hero', 'all_animals'] },
    { summary: 'البطل يحمل آخر حمولة في المطر', emotion: 'جهد وتصميم', environment: 'الإسطبل في المطر', key_action: 'التسليم الأخير', characters: ['hero'] },
    { summary: 'البطل يغلق أبواب الإسطبل والعاصفة تعصف', emotion: 'انتصار وراحة', environment: 'الإسطبل في العاصفة', key_action: 'إغلاق الأبواب', characters: ['hero', 'animals'] },
    { summary: 'الجميع آمنون داخل الإسطبل الدافئ', emotion: 'دفء ومحبة', environment: 'الإسطبل الدافئ بالفانوس', key_action: 'الراحة المشتركة', characters: ['hero', 'all_animals'] },
    { summary: 'البطل والمزارع العجوز يتشاركان الامتنان', emotion: 'تقدير ونضج', environment: 'الإسطبل', key_action: 'لحظة الامتنان', characters: ['hero', 'farmer'] },
    { summary: 'العاصفة تهدأ وأضواء الفجر تظهر', emotion: 'أمل وانتصار', environment: 'الإسطبل بنافذة تُظهر الفجر', key_action: 'مشاهدة ضوء الفجر', characters: ['hero', 'animals'] },
    { summary: 'البطل ينظر للحقل المحمي بعد العاصفة', emotion: 'فخر وامتنان', environment: 'خارج الإسطبل بعد العاصفة', key_action: 'تأمل الحصيلة', characters: ['hero', 'farmer'] },
    { summary: 'الاحتفال بنجاح الحصاد في المزرعة', emotion: 'فرح وانتماء', environment: 'المزرعة بعد العاصفة', key_action: 'الاحتفال', characters: ['hero', 'all_farm'] },
    { summary: 'البطل ينام ليلاً والمزرعة آمنة', emotion: 'رضا وعمق', environment: 'غرفة النوم بنافذة تطل على المزرعة', key_action: 'النوم الهانئ', characters: ['hero'] },
  ],
}

// ---------------------------------------------------------------------------
// COVER PROMPT GENERATOR
// Book-cover composition rules: title treatment, central hero, bold design
// ---------------------------------------------------------------------------
function buildCoverPrompt(child_name, characterBible, theme) {
  const coverStyle =
    "professional children's book cover illustration, " +
    "bold central composition, hero in foreground filling lower third, " +
    "dramatic environment filling upper two-thirds, " +
    "rich vibrant colors, NO text anywhere, NO title, NO words, NO letters, " +
    "magical golden light, award-winning illustration quality, " +
    "wide 2:3 portrait format, purely visual no typography"

  const envMap = {
    jungle:  'vast glowing emerald jungle at sunrise, cathedral trees with golden light',
    space:   'star-filled cosmos with ringed planet and swirling nebula behind hero',
    ocean:   'crystal turquoise ocean depths with coral reef and light rays from above',
    forest:  'ancient misty forest at dawn, enormous oaks with sunbeams, deer silhouettes',
    desert:  'vast golden sand dunes at dawn, pink horizon, ancient rock formations',
    farm:    'golden harvest fields at sunrise, red barn, rolling green hills behind',
  }
  const env = envMap[theme] || envMap.forest

  const coverHairReminder = characterBible.hair_color
    ? `HAIR COLOR IS ${characterBible.hair_color.toUpperCase()} — must be clearly visible on the cover. `
    : ''

  return (
    `${characterBible.identity_lock} ` +
    `HERO CHARACTER [archetype ${characterBible.archetype_id} — ${characterBible.archetype_name}]: ` +
    `${characterBible.description} ` +
    `Standing as book-cover hero, ${env}. ` +
    `DO NOT use a generic child face — this character has a unique defined appearance. ` +
    coverHairReminder +
    `EMOTIONAL RULE: Child must look confident, happy, and full of wonder — NEVER sad or crying. ` +
    `${coverStyle}, ${STYLE_LOCK}`
  )
}

// ---------------------------------------------------------------------------
// PAGE PROMPT GENERATOR
// Structured format — each prompt locked to the exact scene on that page.
// Camera angles rotate across pages for visual variety.
// ---------------------------------------------------------------------------
const CAMERA_ANGLES = [
  'wide establishing shot showing full environment and character',
  'medium shot from low angle, character appears large and heroic',
  'close-up on face and hands capturing the exact emotion',
  'over-the-shoulder perspective looking into the scene ahead',
  'side profile medium shot showing character in full action',
  'intimate close-up on face showing the emotional moment vividly',
  'dramatic low angle looking up at character against sky or trees',
  'wide shot with character small inside a grand sweeping environment',
  'three-quarter front view, character centered, environment around them',
  'medium close-up on character and the key object of this scene',
  'bird\'s-eye view looking down at character and surrounding scene',
  'warm close-up capturing the single most emotional beat of the scene',
  'full body shot showing character performing the exact action',
  'medium side shot revealing both character and environment depth',
  'silhouette of character against a dramatic glowing background',
  'close mid-shot showing character\'s face reacting to what just happened',
]

function buildPagePrompt(child_name, characterBible, sceneMeta, basePrompt, pageIndex) {
  const angle = CAMERA_ANGLES[(pageIndex || 1) % CAMERA_ANGLES.length]
  const hairColorReminder = characterBible.hair_color
    ? `HAIR COLOR IS ${characterBible.hair_color.toUpperCase()} — do not change. `
    : ''
  return (
    `A children's storybook illustration. ` +
    `${characterBible.identity_lock} ` +
    `HERO CHARACTER (must appear IDENTICAL on every page): ${characterBible.description} ` +
    `This exact scene: ${basePrompt}. ` +
    `Camera angle: ${angle}. ` +
    `Emotional tone: ${sceneMeta.emotion}. ` +
    `IDENTITY REMINDER: same skin (${characterBible.skin}), same hair (${characterBible.hair}), same eyes (${characterBible.eyes}), same face [${characterBible.archetype_id}] — never change. ` +
    hairColorReminder +
    `EMOTIONAL RULE: The child must NEVER appear sad, crying, or in tears — always positive and empowering. ` +
    STYLE_LOCK
  )
}

// ---------------------------------------------------------------------------
// SCENE PARSER — extracts entities, emotion, expression, and atmosphere
// from the English page_event + Arabic page text.
// Used to build a structured image prompt that translates the full narrative
// moment — not just objects, but emotion, expression, and mood.
// ---------------------------------------------------------------------------

// Arabic entity keywords → English label
const ARABIC_ENTITY_MAP = [
  { ar: 'أسد',       en: 'lion' },
  { ar: 'نمر',       en: 'tiger' },
  { ar: 'فيل',       en: 'elephant' },
  { ar: 'زرافة',     en: 'giraffe' },
  { ar: 'قرد',       en: 'monkey' },
  { ar: 'ببغاء',     en: 'parrot' },
  { ar: 'طائر',      en: 'bird' },
  { ar: 'حوت',       en: 'whale' },
  { ar: 'دلفين',     en: 'dolphin' },
  { ar: 'سلحفاة',    en: 'turtle' },
  { ar: 'سمكة',      en: 'fish' },
  { ar: 'أخطبوط',    en: 'octopus' },
  { ar: 'كلب',       en: 'dog' },
  { ar: 'قطة',       en: 'cat' },
  { ar: 'حصان',      en: 'horse' },
  { ar: 'بقرة',      en: 'cow' },
  { ar: 'دجاجة',     en: 'chicken' },
  { ar: 'قمر',       en: 'moon' },
  { ar: 'شمس',       en: 'sun' },
  { ar: 'مركبة',     en: 'spacecraft' },
  { ar: 'كهف',       en: 'cave' },
  { ar: 'نهر',       en: 'river' },
  { ar: 'كنز',       en: 'treasure' },
  { ar: 'مفتاح',     en: 'key' },
  { ar: 'جسر',       en: 'bridge' },
]

// English entity keywords that appear in page_events
const ENGLISH_ENTITY_PATTERNS = [
  'lion', 'tiger', 'elephant', 'monkey', 'parrot', 'bird', 'whale', 'dolphin',
  'turtle', 'fish', 'octopus', 'horse', 'cow', 'chicken', 'dog', 'cat',
  'spacecraft', 'rocket', 'cave', 'river', 'bridge', 'treasure', 'key',
  'crystal', 'waterfall', 'volcano', 'island', 'creature', 'beast',
  'dragon', 'fairy', 'spirit', 'robot', 'alien', 'storm', 'lightning',
  'fire', 'ice', 'shadow', 'door', 'gate', 'tree', 'flower',
]

// Arabic emotion → { expression, atmosphere } for prompt injection
const ARABIC_EMOTION_MAP = [
  { ar: ['خاف', 'خوف', 'خائف', 'يخاف', 'مرعوب', 'فزع'],
    expression: 'child looks visibly frightened, eyes wide with fear, body tense',
    atmosphere: 'tense, fearful atmosphere, dark dramatic lighting' },
  { ar: ['فرح', 'سعيد', 'يفرح', 'ابتهج', 'سعادة', 'بهجة'],
    expression: 'child beaming with joy, wide smile, open body language',
    atmosphere: 'warm joyful light, bright cheerful atmosphere' },
  { ar: ['حزن', 'حزين', 'يبكي', 'بكى', 'دموع', 'أسى'],
    expression: 'child looks deeply moved and touched, eyes bright and glistening with emotion but face warm and resilient — NOT sad, NOT crying, expression is tender and positive',
    atmosphere: 'gentle warm emotional light, safe and empowering tone' },
  { ar: ['دهشة', 'مندهش', 'مذهول', 'تعجب', 'استغرب', 'مبهوت'],
    expression: 'child looks amazed, mouth slightly open, wide eyes full of wonder',
    atmosphere: 'magical awe-inspiring light, sense of discovery' },
  { ar: ['قلق', 'توتر', 'متوتر', 'قلقاً'],
    expression: 'child looks worried, brow furrowed, uneasy posture',
    atmosphere: 'tense uncertain atmosphere, muted colors' },
  { ar: ['ابتسم', 'يبتسم', 'ضحك', 'يضحك'],
    expression: 'child smiling warmly, relaxed and happy expression',
    atmosphere: 'gentle warm light, calm pleasant atmosphere' },
  { ar: ['أمل', 'تفاؤل', 'يأمل'],
    expression: 'child looks hopeful, eyes bright and forward-facing',
    atmosphere: 'soft hopeful golden light on the horizon' },
  { ar: ['شجاع', 'شجاعة', 'قرر', 'عزم', 'إصرار'],
    expression: 'child looks determined and brave, chin raised, steady gaze',
    atmosphere: 'empowering atmosphere, strong confident lighting' },
  { ar: ['هادئ', 'هدوء', 'سكينة', 'طمأنينة'],
    expression: 'child looks calm and peaceful, soft relaxed expression',
    atmosphere: 'serene quiet atmosphere, gentle soft light' },
  { ar: ['فضول', 'فضولي', 'يتساءل', 'تساءل'],
    expression: 'child looks curious, head tilted, eyes studying something intently',
    atmosphere: 'mysterious inviting light, sense of wonder' },
]

// English emotion/atmosphere keywords in page_events → descriptor
const ENGLISH_EMOTION_MAP = [
  { words: ['frightened', 'terrified', 'scared', 'fear', 'horror'],
    expression: 'child looks visibly frightened, wide eyes, tense body',
    atmosphere: 'dramatic tense atmosphere, dark moody lighting' },
  { words: ['joy', 'joyful', 'happy', 'elated', 'celebrating', 'laughing'],
    expression: 'child beaming with joy, wide smile, arms open',
    atmosphere: 'bright warm joyful light' },
  { words: ['sad', 'crying', 'tears', 'grief', 'sorrow'],
    expression: 'child looks deeply moved and touched, eyes bright and glistening with emotion but face warm and resilient — NOT sad, NOT crying, expression is tender and positive',
    atmosphere: 'gentle warm emotional light, safe and empowering tone' },
  { words: ['amazed', 'wonder', 'awe', 'astonished', 'wide-eyed'],
    expression: 'child frozen in wonder, mouth open, eyes wide',
    atmosphere: 'magical glowing atmosphere, awe-inspiring scene' },
  { words: ['determined', 'brave', 'courageous', 'resolute', 'stands tall'],
    expression: 'child looks determined, chin up, confident stance',
    atmosphere: 'strong empowering light' },
  { words: ['calm', 'peaceful', 'serene', 'quiet', 'gentle'],
    expression: 'child looks calm and at peace, soft warm expression',
    atmosphere: 'serene soft golden light, tranquil atmosphere' },
  { words: ['curious', 'cautious', 'exploring', 'investigating', 'discovering'],
    expression: 'child looks curious and cautious, leaning forward',
    atmosphere: 'mysterious inviting atmosphere' },
  { words: ['excited', 'thrilled', 'rushing', 'running'],
    expression: 'child full of energy and excitement, movement in body',
    atmosphere: 'dynamic energetic atmosphere' },
  { words: ['worried', 'anxious', 'uneasy', 'nervous'],
    expression: 'child looks worried, brow furrowed, body guarded',
    atmosphere: 'uncertain tense atmosphere, shadows present' },
  { words: ['relieved', 'smiling', 'warm', 'safe'],
    expression: 'child smiling with relief, relaxed and warm expression',
    atmosphere: 'warm safe gentle light' },
]

// Weather/environment signals in page_events
const ATMOSPHERE_PATTERNS = [
  { words: ['storm', 'stormy', 'thunder', 'lightning', 'rain', 'raining'],
    atmosphere: 'dramatic storm in background, rain, dark clouds, lightning flashes' },
  { words: ['night', 'dark', 'darkness', 'moon', 'stars'],
    atmosphere: 'nighttime scene, dark sky with moon and stars, deep shadows' },
  { words: ['sunrise', 'dawn', 'morning light'],
    atmosphere: 'warm golden sunrise light, hopeful dawn atmosphere' },
  { words: ['sunset', 'dusk', 'golden hour'],
    atmosphere: 'warm amber sunset, long shadows, golden hour glow' },
  { words: ['underwater', 'beneath the sea', 'ocean floor', 'deep water'],
    atmosphere: 'underwater scene, blue-green filtered light, bubbles rising' },
  { words: ['fire', 'flames', 'burning'],
    atmosphere: 'dramatic firelight, orange and red glow, dancing flames visible' },
  { words: ['snow', 'snowing', 'ice', 'frozen'],
    atmosphere: 'cold icy scene, white and blue palette, breath visible in air' },
  { words: ['fog', 'mist', 'misty'],
    atmosphere: 'mysterious misty atmosphere, soft diffused light, forms emerging from fog' },
  { words: ['glowing', 'magical light', 'enchanted'],
    atmosphere: 'magical glowing light, ethereal atmosphere, soft luminous glow' },
]

/**
 * Parse the full scene from event + Arabic text.
 * Returns { entities, expression, atmosphere } for prompt construction.
 */
function parseScene(pageEvent, arabicPageText) {
  const eventLower = (pageEvent || '').toLowerCase()
  const arabicText = arabicPageText || ''

  // --- Entities ---
  const entities = []
  for (const word of ENGLISH_ENTITY_PATTERNS) {
    if (eventLower.includes(word) && !entities.includes(word)) entities.push(word)
  }
  for (const { ar, en } of ARABIC_ENTITY_MAP) {
    if (arabicText.includes(ar) && !entities.includes(en)) entities.push(en)
  }

  // --- Emotion/Expression: check English event first, then Arabic text ---
  let expression = null
  let emotionAtmosphere = null

  for (const { words, expression: ex, atmosphere: atm } of ENGLISH_EMOTION_MAP) {
    if (words.some(w => eventLower.includes(w))) {
      expression = ex
      emotionAtmosphere = atm
      break
    }
  }
  if (!expression) {
    for (const { ar, expression: ex, atmosphere: atm } of ARABIC_EMOTION_MAP) {
      if (ar.some(w => arabicText.includes(w))) {
        expression = ex
        emotionAtmosphere = atm
        break
      }
    }
  }

  // --- Atmosphere: weather/environment signals ---
  let envAtmosphere = null
  for (const { words, atmosphere: atm } of ATMOSPHERE_PATTERNS) {
    if (words.some(w => eventLower.includes(w))) {
      envAtmosphere = atm
      break
    }
  }

  return { entities, expression, emotionAtmosphere, envAtmosphere }
}

// ---------------------------------------------------------------------------
// DYNAMIC PAGE PROMPT — full scene translation
// Converts the story event + Arabic page text into a structured image directive
// covering: WHO, WHAT, HOW THEY FEEL, VISUAL EXPRESSION, ATMOSPHERE
// ---------------------------------------------------------------------------
function buildDynamicPagePrompt(child_name, characterBible, storyEvent, pageIndex, arabicPageText) {
  const angle = CAMERA_ANGLES[(pageIndex || 1) % CAMERA_ANGLES.length]
  const { entities, expression, emotionAtmosphere, envAtmosphere } = parseScene(storyEvent, arabicPageText)

  const entitySection = entities.length > 0
    ? `REQUIRED ENTITIES (must appear prominently): ${entities.join(', ')}. `
    : ''

  // Page 1 always gets a forced positive expression regardless of scene content
  const forcedPositive = pageIndex === 1
    ? 'child looks confident, curious, and full of wonder — bright happy expression, open body language'
    : null

  const rawExpression = forcedPositive || expression
  const expressionSection = rawExpression
    ? `CHARACTER EXPRESSION & POSTURE: ${rawExpression}. `
    : `CHARACTER EXPRESSION: character's face and body clearly reflect the emotional state of this moment — positive and empowering. `

  const atmosphereSection = [emotionAtmosphere, envAtmosphere].filter(Boolean).join(', ')
  const atmosphereDirective = atmosphereSection
    ? `ATMOSPHERE & LIGHTING: ${atmosphereSection}. `
    : ''

  const driftGuard = entities.length > 0
    ? `DO NOT replace the main scene with generic decorations, flowers, or sparkles — ` +
      `the image must show the specific moment described. `
    : `Show the specific story moment — not a generic setting illustration. `

  // Hair color reminder — explicit color token repeated at end for maximum enforcement
  const hairColorReminder = characterBible.hair_color
    ? `HAIR COLOR IS ${characterBible.hair_color.toUpperCase()} — do not change it on this page. `
    : ''

  return (
    `A children's storybook illustration. ` +

    // 1. Identity lock FIRST — skin, hair, eyes, gender anchored before anything else
    `${characterBible.identity_lock} ` +

    // 2. Full face description for structural reference
    `FACE REFERENCE: ${characterBible.description} ` +

    // 3. The scene — what is happening on this page
    `THIS PAGE'S EVENT: ${storyEvent}. ` +

    // 4. Required entities
    entitySection +

    // 5. Emotion and expression
    expressionSection +

    // 6. Atmosphere
    atmosphereDirective +

    // 7. Composition
    `COMPOSITION: action and emotion are the main subject. Background supports — does not dominate. ` +
    driftGuard +

    // 8. Camera
    `Camera angle: ${angle}. ` +

    // 9. Identity reinforcement LAST — repeat the 3 most visually drifted attributes
    `IDENTITY REMINDER: same skin (${characterBible.skin}), ` +
    `same hair (${characterBible.hair}), ` +
    `same eyes (${characterBible.eyes}), ` +
    `same face [${characterBible.archetype_id}] — never change. ` +
    hairColorReminder +

    // 10. Emotional safety constraint — absolute rule
    `EMOTIONAL RULE: The child must NEVER appear sad, crying, or in tears — always confident, curious, brave, or joyful. ` +

    STYLE_LOCK
  )
}

// ---------------------------------------------------------------------------
// BASE PAGE PROMPTS — hyper-specific per page, locked to exact story events
// Index 0 = cover scene, indices 1–16 = story pages in order
// ---------------------------------------------------------------------------
const BASE_PROMPTS = {
  jungle: [
    // cover
    'standing triumphant at the edge of an enormous glowing jungle at sunrise, golden rays breaking through cathedral-height tropical trees, face full of wonder, colorful exotic birds in treetops above',
    // page 1 — wakes up, hears jungle sounds, jumps out of bed
    'sitting up in bed eyes wide open, leaning toward open window, sunlight streaming in, jungle visible outside with colorful birds flying past — moment of waking to something extraordinary',
    // page 2 — enters jungle, amazed by golden light
    'stepping into the emerald jungle for the first time, both hands touching a giant fern, neck craning upward at towering ancient trees, golden light filtering down like cathedral windows, butterflies swirling',
    // page 3 — finds scared trembling parrot, extends hand gently
    'kneeling on the jungle floor, one hand gently extended toward a small colorful parrot trembling on a low branch, face calm and kind, soft dappled light on the scene',
    // page 4 — parrot jumps onto hand, they form a team
    'walking along jungle path with small parrot perched on shoulder, both looking ahead with determination, lush green foliage pressing in on all sides, a team of two',
    // page 5 — faces wall of thick vines blocking path
    'standing before an enormous impenetrable wall of thick hanging vines, examining it with hands on hips, head tilted, searching for a way through, shafts of light through gaps',
    // page 6 — giant friendly elephant appears, offers to guide
    'face to face with a massive gentle elephant in a sun-dappled jungle clearing, child looking tiny beside it, elephant\'s eye warm and kind, parrot on child\'s shoulder, moment of wonder',
    // page 7 — arrive at swaying rope bridge over rushing river
    'stepping carefully onto a wooden rope bridge suspended over a fast rushing river far below, hands gripping rope rails, jungle storm clouds gathering in distance behind',
    // page 8 — mid-bridge in storm, rain, parrot clings to shoulder
    'gripping the rope bridge railing in heavy rain in the middle, rain pouring, lightning lighting dark sky behind, parrot clinging tightly to shoulder, determined face pushing forward',
    // page 9 — after storm, sits under giant leaf, sees bird footprints
    'crouching under a giant tropical leaf shelter after the storm, parrot tucked under one arm, pointing excitedly at bird footprints in wet jungle mud, glowing mushrooms nearby in mist',
    // page 10 — follows footprints confidently through jungle
    'walking confidently along a jungle trail following bird footprint marks, head up, colorful birds watching from branches overhead, sun breaking back through the forest canopy above',
    // page 11 — climbs small hill toward giant ancient tree
    'climbing up a small green hill toward an enormous ancient glowing tree at its summit, golden sunset sky behind, birds circling the treetop, nearly there',
    // page 12 — parrot flies to family, birds fill sky with joy
    'standing below the great tree with arms slightly outstretched, watching the parrot fly upward to reunite with a family of colorful birds in the canopy, joy and tears on face',
    // page 13 — elephant reaches trunk to shoulder, says farewell
    'elephant gently pressing the tip of its trunk softly against child\'s shoulder in a tender farewell, child looking up at it with a warm smile, jungle glowing golden around them',
    // page 14 — walks home at sunset, birds escort overhead
    'walking home through the jungle at golden hour, silhouette against warm orange sky visible between trees, a flock of colorful birds flying overhead in escort formation',
    // page 15 — asleep in bed, jungle calls in dreams
    'asleep in bed with a wide peaceful smile, window open showing the dark jungle night outside with stars and distant bird calls, a feather on the pillow beside',
    // page 16 — final reflection, parrot feather reminder
    'looking at a colorful parrot feather placed on the windowsill, morning light catching it, face peaceful and knowing, jungle visible and alive outside the window',
  ],
  space: [
    // cover
    'standing on a rooftop at night gazing at a vast star-filled sky, telescope beside, city lights below, cosmic wonder in eyes, stars blazing above',
    // page 1 — at window seeing one star blinking strangely
    'standing at bedroom window at night in pajamas, pressing fingertip to the glass pointing at one specific blinking star among thousands, face bathed in soft starlight, full of wonder',
    // page 2 — small spacecraft lands in garden, glowing purple, name written on it
    'looking out at the garden where a small glowing purple spacecraft has just landed, door open with light spilling out, face lit with amazed disbelief, hands on window glass',
    // page 3 — enters spacecraft bravely, small glowing creature inside
    'stepping through the spacecraft door with a brave expression, a small glowing creature visible inside looking delighted, golden interior light surrounding both of them',
    // page 4 — launches, Earth becomes tiny blue ball
    'inside rocket cabin pressing face to the porthole, watching Earth shrink to a tiny blue marble against black space, pure joy and awe on face, stars stretching away in all directions',
    // page 5 — sees strange planets on the way
    'floating weightless inside cabin pressing against the porthole, watching a strange ringed planet drift past, hair floating in zero gravity, eyes wide with wonder, laughing',
    // page 6 — enters dark cosmic nebula, small creature grabs hand
    'inside a dark swirling cosmic cloud, small glowing creature reaching up to grab child\'s hand in the darkness, both looking around cautiously, only the creature\'s glow for light',
    // page 7 — emerges from nebula, galaxy blazing in a thousand colors
    'emerging from the nebula into blazing light of the home galaxy, thousands of colors swirling ahead, creature jumping with joy beside child, both faces lit by the spectacular view',
    // page 8 — stands watching creature run to family on glowing planet
    'standing on the glowing planet surface watching the small creature run toward its waiting family in the distance, child standing alone, warm smile, watching reunion with pride',
    // page 9 — creature holds child\'s hands saying "bravest in the cosmos"
    'small glowing creature holding child\'s hands and looking up with deep gratitude, speaking with emotion, child looking down with a humble smile, stars surrounding both of them',
    // page 10 — family writes child\'s name in stars in the sky above
    'looking up at the night sky above the glowing planet as stars rearrange to spell out a name in the cosmos, face lit with astonished joy, creature pointing upward excitedly beside',
    // page 11 — creature gives crystal ball with real star inside
    'creature holding out a small crystal ball containing a living glowing star, child receiving it in both cupped hands, warm light on both their faces, a sacred exchange',
    // page 12 — spacecraft heading home through deep space
    'sitting at the spacecraft window looking out at deep black space as they journey home, crystal star glowing softly in hands on lap, thoughtful and changed expression',
    // page 13 — Earth seen from space as blue-green jewel
    'pressing face to spacecraft porthole, Earth visible as a gorgeous blue-green jewel in black space ahead, expression of love and gratitude for home',
    // page 14 — spacecraft lands in garden before dawn
    'stepping out of the spacecraft in the garden before dawn, breathing deeply, trees and familiar grass around, door of spacecraft still glowing behind, home again',
    // page 15 — deep breath of Earth air, smells trees and soil
    'standing in the garden with eyes closed, face tilted up, taking a deep slow breath of Earth air, trees and flowers around, peaceful smile of gratitude for home',
    // page 16 — sleeps with crystal star glowing beside
    'asleep in bed with peaceful smile, crystal star glowing softly on bedside shelf, bedroom window showing the star-filled night sky outside',
  ],
  ocean: [
    // cover
    'standing on a wooden dock at sunrise looking at ocean stretching to the horizon, golden morning light on water, fishing boat in background, full of quiet wonder',
    // page 1 — walks on beach at dawn, finds glowing bottle
    'bending down on the beach at dawn reaching to pick up a small glowing bottle half-buried in wet sand among shells, early mist around feet, eyes wide with curiosity',
    // page 2 — reads letter, sees dolphin jump in background
    'holding the unrolled paper letter up to read it, turquoise ink glowing, eyes wide, and in the background through the mist a dolphin leaps from the sea as if beckoning',
    // page 3 — puts on goggles, about to dive, dolphin waiting
    'at the water\'s edge adjusting diving goggles on face, about to dive in, a dolphin visible just beneath the clear turquoise surface waiting, excitement and readiness on face',
    // page 4 — underwater swimming through coral, fish everywhere
    'swimming underwater through vibrant coral reef, colorful tropical fish swirling all around, light rays piercing blue-green water from above, dolphin gliding alongside',
    // page 5 — dolphin leads through narrow underwater rock passage
    'swimming through a narrow underwater passage between two massive rocks, sea anemones waving gently on both sides, dolphin just ahead leading the way, magical quiet light',
    // page 6 — faces octopus guardian at cave entrance underwater
    'hovering underwater face to face with a massive octopus with large wise eyes sitting at a cave entrance, standing ground without fear, cave glowing softly behind the octopus',
    // page 7 — opens golden shell chest with trembling hands
    'kneeling in underwater cave opening a golden shell chest with both trembling hands, name visible in pearl letters on the lid, warm glow filling the cave around them',
    // page 8 — reads book whose pages move on their own
    'sitting in glowing underwater cave holding a small book wrapped in shell, pages turning on their own showing illustrations of the adventure just lived, face full of wonder',
    // page 9 — fish gather, dolphin leaps, octopus swims beside
    'underwater surrounded by hundreds of colorful fish swirling in a joyful spiral, dolphin leaping above, octopus swimming gracefully at child\'s side — underwater celebration',
    // page 10 — surfaces on beach, says "thank you" to the sea
    'standing on the beach just having surfaced from the water, dripping and happy, one hand raised in farewell toward the ocean, saying goodbye to the sea',
    // page 11 — sits reading book at sunset by the water
    'sitting on a rock at the water\'s edge at golden sunset reading the shell book, warm orange light, ocean behind them, peaceful and content, book glowing faintly',
    // page 12 — returns to beach, dolphin waiting and leaping
    'standing at shore the next day, dolphin leaping joyfully out of water right in front, child laughing with arms wide open in greeting, pure friendship',
    // page 13 — tells mother story, mother\'s eyes wide with amazement
    'sitting across from mother at night indoors telling the story animatedly with gestures, mother\'s eyes wide and mouth open in amazement, warm lamp light between them',
    // page 14 — places book on shelf beside glowing star
    'reaching up to carefully place the small shell book on a bedroom shelf beside a glowing crystal star, early morning light through window, a smile of satisfaction',
    // page 15 — stands at water\'s edge looking at horizon
    'standing barefoot at the ocean\'s edge in a new summer, waves washing over feet, looking out at the wide calm horizon, wind in hair, open and peaceful',
    // page 16 — final: story began on that beach
    'standing on the beach in the golden light, one hand over heart, looking toward the horizon where the adventure began, story continuing inside',
  ],
  forest: [
    // cover
    'standing at the edge of a vast ancient misty forest at dawn, sunbeams streaming between enormous old oaks, deer silhouettes visible between the trees, full of awe',
    // page 1 — walking, hears whisper "finally name came"
    'walking in the spring forest, suddenly stopped mid-step, head turning and eyes widening, listening — the trees seem to be whispering a name, golden morning light through leaves',
    // page 2 — presses hand on ivy-covered tree, hears it speak
    'pressing one hand flat against the bark of an enormous ivy-covered old tree, leaning ear close, eyes closed listening, the tree pulsing with faint inner light',
    // page 3 — white rabbit with orange eyes appears in glade
    'in a flower-filled sun-dappled forest glade, white rabbit with glowing orange eyes sitting upright looking directly at child, a magical first meeting, wildflowers all around',
    // page 4 — follows rabbit down mossy path
    'following the white rabbit down a mossy winding forest path, giant ferns on both sides, dappled golden light ahead, curiosity and readiness on face, rabbit just ahead',
    // page 5 — first step onto swaying vine bridge over deep valley
    'one foot on the swaying vine bridge over a deep misty valley, hands gripping the vine rails, rabbit watching from safe ground, brave first step into the unknown',
    // page 6 — faces three enormous guardian trees blocking path
    'standing before three towering ancient trees whose massive roots block the entire path, looking up at them, branches slowly moving in no wind, rabbit at side',
    // page 7 — speaks clearly, guardian trees lift roots
    'standing before the guardian trees speaking with clear calm voice, the enormous roots beginning to slowly rise from the earth and open a passage, golden light flooding through',
    // page 8 — kneels at glittering spring in stone circle
    'kneeling at a small spring inside a circle of mossy stones, water glittering like diamonds in the dim light, white flowers blooming all around it, rabbit beside, reverent moment',
    // page 9 — carefully fills tiny bottle with glowing spring water
    'both hands cupped around a tiny glass bottle being filled drop by drop with the glowing spring water, extreme care and focus, magical light illuminating the hands',
    // page 10 — running back through forest with rabbit
    'running through the forest at full speed with the rabbit bounding ahead, trees seeming to bow and lean as they pass, strengthening light ahead, bottle safe in hand',
    // page 11 — kneels at Heart Tree, pours water on roots
    'kneeling at the Heart Tree roots slowly and gently pouring the glowing water from the tiny bottle onto the pale thirsty roots, eyes full of hope, rabbit watching',
    // page 12 — Heart Tree bursts into bloom instantly
    'watching in amazement as the Heart Tree explodes into life — new deep green leaves unfurling, impossible flowers blooming everywhere, color flooding through the forest, tears of joy',
    // page 13 — animals arrive and gather around healed tree
    'standing surrounded by deer, colorful birds landing on nearby branches, hedgehogs peering from the grass, all gathered peacefully around the now-blooming Heart Tree',
    // page 14 — receives single glowing green leaf from Heart Tree
    'a tree branch lowering to offer a single glowing green leaf, child receiving it in both cupped hands with deep reverence, soft green light on face, rabbit beside',
    // page 15 — walks home through golden forest with glowing leaf
    'walking home through the forest at golden hour, holding glowing green leaf in one hand, it lighting the path softly, rabbit waving ears in farewell from behind',
    // page 16 — in bedroom, leaf on desk glowing, peaceful sleep
    'at bedroom desk at night, glowing green leaf in a glass jar casting a soft green glow across the room, face peaceful and content, stars visible through window',
  ],
  desert: [
    // cover
    'at the edge of the vast golden desert at dawn, sand dunes stretching endlessly, first pink light painting everything warm, standing small before the immensity',
    // page 1 — crouches between rocks at dawn, finds old clay jar
    'crouching between desert rocks in cold pre-dawn light, picking up a small old clay jar with both hands from between the boulders, face close examining it with curiosity',
    // page 2 — unrolls old leather map, sees name at destination
    'carefully unrolling an ancient leather map from the jar in early morning light, eyes going wide seeing a name written at the journey\'s end, disbelief and excitement',
    // page 3 — sits with village elders around evening fire studying map
    'sitting cross-legged with several wise old village elders around a fire at night, the map spread between them, elders pointing and explaining with knowing faces',
    // page 4 — sets out alone at sunrise into golden dunes
    'walking away from the small desert village at sunrise, back to camera, small pack on back, vast golden dunes stretching ahead, a lone small figure before an enormous landscape',
    // page 5 — climbing enormous dune under blazing noon sun
    'climbing an enormous sand dune under a blazing white noon sun, struggling with each step that sinks into shifting sand, nearly to the top, sweat and effort and determination',
    // page 6 — sits in rock shadow studying map, doubt then resolve
    'sitting in the shadow of a large sandstone rock holding the map, studying it carefully, face showing a moment of doubt then shifting to quiet resolve, desert silence all around',
    // page 7 — desert fox with large amber eyes appears
    'face to face in the open desert with a small elegant desert fox with enormous amber eyes, both still, a magical quiet moment of connection between child and wild creature',
    // page 8 — follows fox through narrow canyon between red rock walls
    'following the fox through a narrow canyon passage between tall red rock walls, cool shadow inside after the blazing sun, walls close on both sides, fox just ahead',
    // page 9 — exits canyon, sees oasis shimmering in distance
    'stepping out of the canyon into sunlight, hand raised to shield eyes, seeing for the first time a shimmer of green in the distance — the oasis — face flooded with disbelief and joy',
    // page 10 — kneels at turquoise oasis pool, drinks with cupped hands
    'kneeling at the edge of a crystal-clear turquoise oasis pool, scooping water with cupped hands and drinking, fox sitting beside, palm trees above, relief and wonder on face',
    // page 11 — examines ring of engraved name-stones, spots blank one
    'walking slowly around a ring of flat engraved stones surrounding the pool, running fingers across carved names, stopping at one blank stone with an arrow pointing up',
    // page 12 — uses small stone to carve name, golden glow responds
    'kneeling at the blank stone carefully using a small rock to carve letters into it, a faint golden glow responding to each mark, fox watching, sacred and important moment',
    // page 13 — sits among gazelles and birds and foxes at sunset
    'sitting perfectly still among gazelles and small birds and foxes who have gathered at the oasis at sunset, surrounded by wildlife who have come to drink, not moving so as not to disturb',
    // page 14 — lies under Milky Way at night, fox asleep beside
    'lying on back in the oasis at night gazing upward at the blazing Milky Way stretching across the sky, fox curled asleep beside, fireflies nearby, absolute peace',
    // page 15 — fox accompanies to edge of oasis, they part
    'walking beside the fox to the edge of the oasis in morning light, both slowing, child turning back to look at the fox with gratitude, fox stopping to let child continue alone',
    // page 16 — returns to village, elders come out to welcome
    'arriving back at the desert village, elders coming through the doorways to meet child, gesturing toward the desert horizon with confidence and a proud smile',
  ],
  farm: [
    // cover
    'golden harvest fields stretching in early morning sunlight, red barn in background, rolling green hills, warm sunrise glow over the whole farm scene',
    // page 1 — wakes at dawn to rooster crowing
    'eyes snapping open in bed, rooster crowing outside the window, golden dawn light streaming in, a feeling that today is different — sitting up alert and ready',
    // page 2 — old farmer explains storm threat to harvest
    'standing beside the old farmer in the barn doorway, farmer pointing at the darkening horizon with a worried creased face explaining the danger, child listening seriously',
    // page 3 — gently explains to horse Nour and cow Zahra
    'crouching to look eye-level at the large brown horse Nour in its stall, horse nodding its head, cow Zahra visible behind looking ready, golden barn light on the scene',
    // page 4 — organized convoy to field, picking tomatoes
    'working in a sunlit field in an organized row, picking bright red tomatoes and placing them carefully in wooden crates, horse pulling the cart nearby, coordinated and purposeful',
    // page 5 — dark clouds gathering, thunder in distance
    'stopping mid-work to stare at the sky — grey storm clouds rolling in on the horizon, first rumble of thunder heard, urgency building, still two-thirds of harvest in the field',
    // page 6 — cows walk out of barn on their own to help
    'watching in complete amazement as the cows walk purposefully out of the barn doors on their own toward the field to help, mouth open, hands raised in disbelief at the sight',
    // page 7 — Zahra pushes boxes, Basheer herds animals
    'in the center of the action, directing — cow Zahra using her nose to push heavy crates toward the cart, dog Basheer barking to keep the animals in line, everyone working',
    // page 8 — working in first rain, determined, boxes moving
    'working in the field as the first heavy raindrops fall, still moving boxes with determination, rain beginning to soak clothes, everyone still pushing forward without stopping',
    // page 9 — running with last armful of crops toward barn
    'running at full speed toward the open barn doors with arms full of the last of the harvest, rain now pouring, wind pushing against, doors open ahead, nearly there',
    // page 10 — slams barn doors shut as full storm hits
    'leaning against the closed barn doors with both hands as the full force of the storm hits outside, exhausted, breathless, and triumphant smile breaking across face',
    // page 11 — inside warm barn, animals press close
    'inside the warm barn, animals pressed close on all sides — horse resting its large head gently on child\'s shoulder, cow Zahra nearby, dog Basheer leaning against legs, safe',
    // page 12 — farmer stands before child, voice breaking
    'old farmer standing before child in the barn, all the animals around, farmer\'s eyes wet with emotion, reaching out a hand to child\'s shoulder, deeply moved and grateful',
    // page 13 — walks in field after storm, everything glistening
    'walking slowly through the clean wet field after the storm has passed, air fresh and cool, every leaf glistening, sun breaking through, quiet pride in what was saved',
    // page 14 — sitting eating together with farmer, animals nearby
    'sitting on a hay bale beside the farmer eating simple food and laughing together, animals settling nearby, warm lantern light in the barn, a perfect quiet moment of belonging',
    // page 15 — farmer shows barn door to carve, child says animals deserve it
    'farmer holding a chisel to the old barn door wood ready to carve, child gesturing toward the animals with a warm smile, saying they deserve the honor too',
    // page 16 — walking home after storm, sun returning, confident stride
    'walking home along a dirt farm road as the sun breaks through parting clouds after the storm, light spilling golden across wet fields, calm confident stride, story complete',
  ],
}

// ---------------------------------------------------------------------------
// MAIN — generateStructuredPrompts
//
// When the order has a story_json (generated by the True Story Engine),
// image prompts are derived from the actual AI-generated story events.
// This ensures images reflect what actually happens in THIS story —
// not a generic theme scene.
//
// Falls back to static BASE_PROMPTS + SCENE_METADATA if no story_json.
// ---------------------------------------------------------------------------
function generateStructuredPrompts(order) {
  const { child_name, gender, age_group, theme: rawTheme, appearance, id: orderId, story_json } = order
  const theme = BASE_PROMPTS[rawTheme] ? rawTheme : 'forest'

  // Pass orderId so even children with identical names get different archetypes
  const characterBible = buildCharacterBible(child_name, gender, age_group, theme, appearance || null, orderId)

  // ── Determine prompt source ──────────────────────────────────────────────
  // Priority 1: AI-generated story events (story_json.page_events)
  // Priority 2: Static BASE_PROMPTS per theme
  const hasStoryJson = story_json &&
    Array.isArray(story_json.page_events) &&
    story_json.page_events.length === 16

  const sceneMeta   = SCENE_METADATA[theme]
  const basePrompts = BASE_PROMPTS[theme]

  // ── Cover prompt ──────────────────────────────────────────────────────────
  let coverPrompt
  if (hasStoryJson && story_json.cover_event) {
    // Dynamic: use the story's iconic cover moment (no Arabic page text for cover — use page 1 as proxy)
    const coverArabicHint = Array.isArray(story_json.pages) ? (story_json.pages[0] || '') : ''
    coverPrompt = buildDynamicPagePrompt(child_name, characterBible, story_json.cover_event, 0, coverArabicHint)
  } else {
    coverPrompt = buildCoverPrompt(child_name, characterBible, theme)
  }

  // ── Page prompts ──────────────────────────────────────────────────────────
  const pagePrompts = []
  for (let i = 1; i <= 16; i++) {
    let prompt, scene_summary, emotion, environment, key_action, characters_present

    if (hasStoryJson) {
      // Dynamic path: image prompt derived from actual story event
      const event          = story_json.page_events[i - 1]
      const arabicPageText = Array.isArray(story_json.pages) ? (story_json.pages[i - 1] || '') : ''
      prompt = buildDynamicPagePrompt(child_name, characterBible, event, i, arabicPageText)
      scene_summary      = event
      emotion            = 'as depicted in the story'
      environment        = theme
      key_action         = event
      characters_present = ['hero']
    } else {
      // Static fallback path
      const base  = basePrompts[i] || basePrompts[basePrompts.length - 1]
      const scene = sceneMeta[i]  || sceneMeta[sceneMeta.length - 1]
      prompt             = buildPagePrompt(child_name, characterBible, scene, base, i)
      scene_summary      = scene.summary
      emotion            = scene.emotion
      environment        = scene.environment
      key_action         = scene.key_action
      characters_present = scene.characters
    }

    pagePrompts.push({
      page_number: i,
      prompt,
      scene_summary,
      emotion,
      environment,
      key_action,
      characters_present,
    })
  }

  return {
    order_id:       order.id,
    child_name,
    theme,
    style_lock:     STYLE_LOCK,
    character_bible: characterBible,
    archetype_id:   characterBible.archetype_id,
    archetype_name: characterBible.archetype_name,
    cover_prompt:   coverPrompt,
    total_images:   17,
    page_prompts:   pagePrompts,
    story_driven:   hasStoryJson,   // flag so callers know which path was used
    image_path_pattern: {
      cover: `/images/generated/${order.id}/cover.jpg`,
      page:  `/images/generated/${order.id}/page-{N}.jpg`,
      note:  'Replace {N} with page number 1–16',
    },
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------


export { generateStructuredPrompts }
