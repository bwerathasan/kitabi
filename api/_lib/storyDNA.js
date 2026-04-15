/**
 * storyDNA.js — Story DNA System
 *
 * Deterministically selects a unique combination of story dimensions
 * from orderId so every order gets a structurally distinct story.
 *
 * Architecture:
 *   1. 9 DNA dimensions × 5-10 options each = enormous combinatorial space
 *   2. FNV-1a hash applied independently per dimension with unique salt
 *   3. Structure selected as a 10th dimension with separate salt
 *
 * Same orderId → same DNA (consistent PDF + images)
 * Different orderIds → statistically different DNA combinations
 */

// ---------------------------------------------------------------------------
// Hash — FNV-1a 32-bit
// ---------------------------------------------------------------------------
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h
}

function pick(arr, seed, salt) {
  const h = fnv1a(String(seed) + '||' + salt)
  return arr[h % arr.length]
}

// ---------------------------------------------------------------------------
// DIMENSION 1 — Goal (what the child must achieve)
// ---------------------------------------------------------------------------
const GOALS = [
  {
    id: 'rescue_creature',
    en: 'rescue a lost or injured creature and return it to where it belongs',
    ar: 'إنقاذ مخلوق ضائع أو مصاب وإعادته إلى حيث ينتمي',
  },
  {
    id: 'find_hidden',
    en: 'discover a hidden place, ancient object, or long-lost truth',
    ar: 'اكتشاف مكان مخفي أو شيء قديم أو حقيقة ضائعة منذ زمن',
  },
  {
    id: 'fix_broken',
    en: 'repair something vital that has broken — a natural balance, a sick being, or a fractured bond',
    ar: 'إصلاح شيء حيوي انكسر — توازن طبيعي أو كائن مريض أو رابطة متشققة',
  },
  {
    id: 'deliver_message',
    en: 'deliver something critically important before irreversible consequences unfold',
    ar: 'إيصال شيء بالغ الأهمية قبل أن تتكشف عواقب لا يمكن التراجع عنها',
  },
  {
    id: 'uncover_mystery',
    en: 'solve a mystery that everyone else has given up on or refuses to believe exists',
    ar: 'حل لغز تخلى عنه الجميع أو يرفضون الاعتراف بوجوده',
  },
  {
    id: 'earn_trust',
    en: 'prove worthy and earn the trust of a world that doubts the child can do it',
    ar: 'إثبات الجدارة وكسب ثقة عالم يشك في قدرة الطفل على الفعل',
  },
  {
    id: 'protect_home',
    en: 'protect a beloved place or community from a slow invisible threat',
    ar: 'حماية مكان عزيز أو مجتمع من تهديد خفي بطيء',
  },
  {
    id: 'bring_together',
    en: 'unite two estranged groups or beings who have forgotten why they once were friends',
    ar: 'توحيد مجموعتين أو كائنين متخاصمين نسيا سبب صداقتهما الأصلية',
  },
  {
    id: 'escape_transform',
    en: 'escape an impossible situation and emerge forever changed by what it taught',
    ar: 'الخروج من موقف مستحيل والتحول إلى الأبد بما علّمه',
  },
  {
    id: 'learn_forgotten',
    en: 'recover a lost skill or ancient knowledge before it disappears forever',
    ar: 'استعادة مهارة ضائعة أو معرفة قديمة قبل أن تختفي إلى الأبد',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 2 — Tone
// ---------------------------------------------------------------------------
const TONES = [
  {
    id: 'adventurous',
    en: 'bold, heart-pounding adventure — fast, exciting, never a dull moment',
    ar: 'مغامرة جريئة تجعل القلب ينبض بسرعة — سريعة ومثيرة ولا لحظة ممل',
  },
  {
    id: 'emotional',
    en: 'deeply emotional and tender — every moment carries feeling and warmth',
    ar: 'عاطفي عميق وحنون — كل لحظة تحمل مشاعر ودفئاً',
  },
  {
    id: 'mysterious',
    en: 'mysterious and suspenseful — questions linger, the world holds secrets',
    ar: 'غامض ومشوق — الأسئلة تتراكم والعالم يحتفظ بأسراره',
  },
  {
    id: 'funny',
    en: 'genuinely funny and playful — unexpected humor woven throughout',
    ar: 'مضحك حقاً ومرح — فكاهة غير متوقعة تنسج في كل مكان',
  },
  {
    id: 'calm_magical',
    en: 'calm, dreamlike, gently magical — beauty in quiet unexpected places',
    ar: 'هادئ وشبيه بالحلم وساحر برفق — جمال في أماكن هادئة وغير متوقعة',
  },
  {
    id: 'bittersweet',
    en: 'bittersweet and reflective — beauty mixed with longing, joy mixed with loss',
    ar: 'حلو مر وتأملي — جمال ممزوج بالشوق وفرح ممزوج بالخسارة',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 3 — Pacing Style
// ---------------------------------------------------------------------------
const PACING_STYLES = [
  {
    id: 'fast_journey',
    en: 'fast-paced urgent journey — every single page delivers a new challenge or revelation',
    ar: 'رحلة سريعة ومُلحّة — كل صفحة تُقدم تحدياً جديداً أو كشفاً جديداً',
  },
  {
    id: 'slow_discovery',
    en: 'slow discovery with deep wonder — pages breathe, atmosphere builds, details matter enormously',
    ar: 'اكتشاف بطيء مع دهشة عميقة — الصفحات تتنفس والجو يتراكم والتفاصيل مهمة جداً',
  },
  {
    id: 'episodic',
    en: 'episodic — three distinct mini-adventures within one larger journey, each complete in itself',
    ar: 'متقطع — ثلاث مغامرات صغيرة مميزة ضمن رحلة أكبر وكل منها مكتملة في ذاتها',
  },
  {
    id: 'escalating',
    en: 'escalating tension — each page raises the stakes higher than the last, building toward one moment',
    ar: 'توتر متصاعد — كل صفحة ترفع المخاطر أعلى من السابقة تراكماً نحو لحظة واحدة',
  },
  {
    id: 'circular',
    en: 'circular — the journey returns to where it started, but the child (and world) has fundamentally changed',
    ar: 'دائري — الرحلة تعود لحيث بدأت لكن الطفل والعالم تغيرا تغيراً جوهرياً',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 4 — Conflict Type
// ---------------------------------------------------------------------------
const CONFLICT_TYPES = [
  {
    id: 'external_danger',
    en: 'external physical danger that requires cleverness and courage to outmaneuver — not brute force',
    ar: 'خطر خارجي جسدي يتطلب الذكاء والشجاعة للتحايل عليه — ليس القوة العمياء',
  },
  {
    id: 'inner_doubt',
    en: 'internal fear or crippling self-doubt — the real battle is happening inside the child',
    ar: 'خوف داخلي أو شك ذاتي مشل — المعركة الحقيقية تجري داخل الطفل',
  },
  {
    id: 'puzzle_mystery',
    en: 'a puzzle or mystery where the critical clues are hidden in plain sight — observation wins',
    ar: 'لغز أو سر تكمن خيوطه الحاسمة في مكان واضح — الملاحظة هي الفوز',
  },
  {
    id: 'moral_dilemma',
    en: 'a genuine moral dilemma — helping others means personal cost, and both choices matter',
    ar: 'معضلة أخلاقية حقيقية — مساعدة الآخرين تعني تكلفة شخصية وكلا الخيارين مهم',
  },
  {
    id: 'survival',
    en: 'survival against the elements — weather, terrain, or nature itself becomes the overwhelming obstacle',
    ar: 'النجاة في مواجهة الطبيعة — الطقس أو التضاريس أو الطبيعة ذاتها يصبح العائق الهائل',
  },
  {
    id: 'misunderstanding',
    en: 'a deep mutual misunderstanding between two worlds — only the child can see both sides clearly',
    ar: 'سوء فهم متبادل عميق بين عالمين — الطفل وحده يستطيع رؤية كلا الجانبين بوضوح',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 5 — Helper Type
// ---------------------------------------------------------------------------
const HELPER_TYPES = [
  {
    id: 'wise_elder',
    en: 'a wise ancient elder creature who speaks in riddles and reveals truth only when truly needed',
    ar: 'مخلوق قديم حكيم يتحدث بالألغاز ويكشف الحقيقة فقط حين تُحتاج حقاً',
  },
  {
    id: 'small_unlikely',
    en: 'an impossibly small or overlooked creature — the most unlikely helper proves absolutely essential',
    ar: 'مخلوق صغير مستحيل أو مُغفل — أكثر المساعدين غير المتوقعين يثبت ضرورته المطلقة',
  },
  {
    id: 'rival_becomes_friend',
    en: 'a rival or apparent enemy who unexpectedly becomes the most crucial ally at the worst moment',
    ar: 'منافس أو عدو ظاهري يتحول بشكل غير متوقع إلى الحليف الأكثر أهمية في أسوأ لحظة',
  },
  {
    id: 'magic_object',
    en: 'a mysterious object whose true power only reveals itself when the child truly needs it',
    ar: 'شيء غامض تكشف قدرته الحقيقية فقط حين يحتاجه الطفل فعلاً',
  },
  {
    id: 'solo',
    en: 'no external helper — a completely solo journey where self-reliance is the only resource',
    ar: 'لا مساعد خارجي — رحلة منفردة تماماً حيث الاعتماد على الذات هو المورد الوحيد',
  },
  {
    id: 'living_environment',
    en: 'the environment itself becomes a living guide — nature, place, or world acts as silent helper',
    ar: 'البيئة ذاتها تصبح مرشداً حياً — الطبيعة أو المكان أو العالم يتصرف كمساعد صامت',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 6 — Twist Type
// ---------------------------------------------------------------------------
const TWIST_TYPES = [
  {
    id: 'helper_needed_help',
    en: 'the helper was actually the one in desperate need all along — their guidance was their own cry for help',
    ar: 'المساعد كان هو من يحتاج إلى المساعدة يائساً طوال الوقت — إرشاده كان صرخة استغاثته',
  },
  {
    id: 'obstacle_protecting',
    en: 'the obstacle was protecting something precious underneath it — removing it required understanding it',
    ar: 'العائق كان يحمي شيئاً ثميناً تحته — إزالته تطلبت فهمه أولاً',
  },
  {
    id: 'goal_transforms',
    en: 'mid-journey, the real goal reveals itself as something completely different from what was believed',
    ar: 'في منتصف الرحلة يكشف الهدف الحقيقي عن نفسه كشيء مختلف تماماً عما كان يُعتقد',
  },
  {
    id: 'past_mistake_solves',
    en: "the child's specific past mistake or unique weakness becomes the exact key that unlocks the solution",
    ar: 'خطأ الطفل الماضي المحدد أو ضعفه الفريد يصبح المفتاح الدقيق الذي يفتح الحل',
  },
  {
    id: 'always_had_it',
    en: 'the answer was always within the child — the entire journey was the process of discovering it',
    ar: 'الإجابة كانت دائماً في داخل الطفل — الرحلة كلها كانت عملية اكتشافها',
  },
  {
    id: 'stranger_forever_ally',
    en: 'the most intimidating stranger transforms into the most devoted lifelong companion',
    ar: 'الغريب الأكثر تخويفاً يتحول إلى الرفيق المخلص مدى الحياة',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 7 — Ending Type
// ---------------------------------------------------------------------------
const ENDING_TYPES = [
  {
    id: 'shared_victory',
    en: 'triumphant shared victory — not one winner but everyone transformed together',
    ar: 'نصر مشترك مظفر — ليس فائزاً واحداً بل الجميع يتحول معاً',
  },
  {
    id: 'personal_discovery',
    en: 'quiet personal discovery — the external problem is solved but the real change is inside',
    ar: 'اكتشاف شخصي هادئ — المشكلة الخارجية تُحل لكن التغيير الحقيقي بالداخل',
  },
  {
    id: 'bittersweet_farewell',
    en: 'bittersweet farewell — something beautiful ends and something new begins, both felt fully',
    ar: 'وداع حلو مر — شيء جميل ينتهي وشيء جديد يبدأ وكلاهما يُشعر كاملاً',
  },
  {
    id: 'surprising_return',
    en: 'the return home reveals the world looks completely different through changed eyes',
    ar: 'العودة إلى البيت تكشف أن العالم يبدو مختلفاً تماماً من خلال عيون تغيرت',
  },
  {
    id: 'new_beginning',
    en: 'the ending is unmistakably a beginning — a door opens to something even larger ahead',
    ar: 'النهاية هي بداية لا لبس فيها — باب يفتح على شيء أكبر في الأفق',
  },
  {
    id: 'earned_belonging',
    en: 'earned belonging — the child discovers they have always been exactly where they were meant to be',
    ar: 'انتماء مكتسب — يكتشف الطفل أنه كان دائماً بالضبط حيث كان مفترضاً أن يكون',
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 8 — Narrative Style
// ---------------------------------------------------------------------------
const NARRATIVE_STYLES = [
  {
    id: 'linear',
    en: 'linear chronological — clear cause and effect, every scene earned by the last',
    ar: 'خطي زمني — سبب ونتيجة واضحان وكل مشهد مكتسب من السابق',
  },
  {
    id: 'mystery_driven',
    en: 'mystery-driven — questions raised on page 1, answered slowly, final page delivers full meaning',
    ar: 'مدفوع بالغموض — أسئلة تُطرح في الصفحة الأولى وتُجاب ببطء والصفحة الأخيرة تُعطي المعنى الكامل',
  },
  {
    id: 'mission_based',
    en: 'mission-based — explicit goal, clear obstacles, every page shows measurable progress',
    ar: 'قائم على المهمة — هدف صريح وعقبات واضحة وكل صفحة تُظهر تقدماً قابلاً للقياس',
  },
  {
    id: 'discovery_based',
    en: 'discovery-based — no clear purpose at first, meaning emerges gradually through exploration',
    ar: 'قائم على الاكتشاف — لا هدف واضح في البداية والمعنى يظهر تدريجياً من خلال الاستكشاف',
  },
  {
    id: 'emotional_journey',
    en: "emotional journey — inner transformation drives the story, external events mirror the child's inner state",
    ar: "رحلة عاطفية — التحول الداخلي يقود القصة والأحداث الخارجية تعكس الحالة الداخلية للطفل",
  },
]

// ---------------------------------------------------------------------------
// DIMENSION 9 — Opening Hook
// ---------------------------------------------------------------------------
const OPENING_HOOKS = [
  {
    id: 'strange_sound',
    en: 'wakes to a strange sound or sensation that no one else can hear or feel',
    ar: 'يستيقظ على صوت أو إحساس غريب لا يستطيع أحد غيره سماعه أو الشعور به',
  },
  {
    id: 'mysterious_object',
    en: 'finds a mysterious object that was not there yesterday — as if left specifically for this child',
    ar: 'يجد شيئاً غامضاً لم يكن موجوداً بالأمس — كأنه تُرك تحديداً لهذا الطفل',
  },
  {
    id: 'wrong_discovery',
    en: 'notices something terribly wrong that every adult and creature around has completely missed',
    ar: 'يلاحظ شيئاً خاطئاً بشكل مروع فاته كل بالغ ومخلوق من حوله تماماً',
  },
  {
    id: 'irresistible_call',
    en: 'feels an irresistible pull toward something unknown — following it is not a choice but a certainty',
    ar: 'يشعر بجذب لا يُقاوم نحو شيء مجهول — اتباعه ليس خياراً بل يقيناً',
  },
  {
    id: 'vivid_dream_call',
    en: 'a vividly real dream sends an unmistakable calling that cannot be dismissed as just imagination',
    ar: 'حلم حي حقيقي يرسل نداءً لا يُنكر لا يمكن رفضه كمجرد خيال',
  },
  {
    id: 'unexpected_arrival',
    en: 'something or someone arrives unexpectedly and nothing will be the same after this moment',
    ar: 'شيء ما أو شخص ما يصل بشكل غير متوقع ولن يكون أي شيء كما كان بعد هذه اللحظة',
  },
]

// ---------------------------------------------------------------------------
// STORY STRUCTURES — 5 fundamentally different narrative architectures
// ---------------------------------------------------------------------------
export const STORY_STRUCTURES = [
  {
    id: 'A',
    name: 'The Mission',
    description: 'A clear goal is established early. Obstacles escalate. A helper appears mid-journey. Climax requires everything learned.',
    flow: [
      'pages 1-2: World setup + inciting incident reveals the mission',
      'pages 3-4: Mission accepted, journey begins, first challenge',
      'pages 5-6: Serious obstacle — first approach fails',
      'pages 7-8: Helper appears, new strategy formed',
      'pages 9-10: Stakes deepen, personal cost becomes real',
      'pages 11-13: Climax — all skills and courage tested at once',
      'pages 14-15: Resolution and aftermath',
      'page 16: Quiet reflective ending — what changed',
    ],
  },
  {
    id: 'B',
    name: 'The Mystery',
    description: 'A strange discovery raises questions. Investigation deepens the mystery. False leads mislead. The final revelation recontextualizes everything.',
    flow: [
      'pages 1-2: Mysterious discovery — nothing makes sense yet',
      'pages 3-4: Investigation begins, first strange clue',
      'pages 5-6: Following the clue deeper, world feels stranger',
      'pages 7-8: False trail — apparent answer is wrong',
      'pages 9-10: Deeper layer of mystery revealed',
      'pages 11-12: The real answer begins to emerge',
      'pages 13-14: Revelation — everything recontextualized',
      'pages 15-16: Resolution with new understanding',
    ],
  },
  {
    id: 'C',
    name: 'The Endurance',
    description: 'A problem demands action. Three attempts each teach something. Failure is instructive. The third attempt uses everything learned from failing.',
    flow: [
      'pages 1-2: The problem emerges — stakes established',
      'pages 3-5: First attempt — bold but insufficient, fails',
      'pages 5-7: What the failure taught — a crucial insight',
      'pages 8-9: Second attempt — smarter but still incomplete',
      'pages 10: The lesson from both failures crystallizes',
      'pages 11-13: Third attempt — uses everything learned',
      'pages 14-15: Success and its unexpected shape',
      'page 16: The growth that came from having to try three times',
    ],
  },
  {
    id: 'D',
    name: 'The Emotional Journey',
    description: "External events mirror internal transformation. The real story is what changes inside the child. Every external obstacle is a reflection of an inner one.",
    flow: [
      'pages 1-2: Ordinary world — but something feels incomplete',
      'pages 3-4: The call arrives, inner resistance is felt',
      'pages 5-6: Journey begins, external world reflects inner state',
      'pages 7-8: The real fear or wound surfaces clearly',
      'pages 9-10: Facing the inner obstacle directly',
      'pages 11-12: The transformation moment — something releases',
      'pages 13-14: External resolution flows from internal change',
      'pages 15-16: Return — the same world looks entirely different',
    ],
  },
  {
    id: 'E',
    name: 'The Discovery',
    description: 'The child wanders without clear purpose. Meaning accumulates through small encounters. The final pages reveal the pattern that was always there.',
    flow: [
      'pages 1-3: Wandering without clear purpose — pure curiosity',
      'pages 4-5: First unexpected encounter plants a seed',
      'pages 6-7: Second encounter — a pattern begins to form',
      'pages 8-9: Third encounter — the pattern is unmistakable now',
      'pages 10-11: The child begins to understand what they are really doing',
      'pages 12-13: Unexpected truth arrives from an impossible direction',
      'pages 14-15: Full meaning understood — the pattern revealed',
      'page 16: Integration — how this shapes everything going forward',
    ],
  },
]

// ---------------------------------------------------------------------------
// MAIN — Build full story DNA for an order
// ---------------------------------------------------------------------------

/**
 * Returns a deterministic story DNA object for the given orderId + theme.
 * Every field is selected independently so variations are near-infinite.
 *
 * @param {string} orderId
 * @param {string} theme
 * @returns {{ goal, tone, pacing, conflict, helper, twist, ending, narrative, opening, structure }}
 */
export function buildStoryDNA(orderId, theme) {
  const base = (orderId || '') + '|' + (theme || '')

  return {
    goal:      pick(GOALS,            fnv1a(base + '::goal'),      'GOAL'),
    tone:      pick(TONES,            fnv1a(base + '::tone'),      'TONE'),
    pacing:    pick(PACING_STYLES,    fnv1a(base + '::pacing'),    'PAC'),
    conflict:  pick(CONFLICT_TYPES,   fnv1a(base + '::conflict'),  'CON'),
    helper:    pick(HELPER_TYPES,     fnv1a(base + '::helper'),    'HLP'),
    twist:     pick(TWIST_TYPES,      fnv1a(base + '::twist'),     'TWI'),
    ending:    pick(ENDING_TYPES,     fnv1a(base + '::ending'),    'END'),
    narrative: pick(NARRATIVE_STYLES, fnv1a(base + '::narrative'), 'NAR'),
    opening:   pick(OPENING_HOOKS,    fnv1a(base + '::opening'),   'OPN'),
    structure: pick(STORY_STRUCTURES, fnv1a(base + '::structure'), 'STR'),
  }
}

/**
 * Returns a short human-readable summary of a DNA object.
 * Used for logging and debugging.
 */
export function summarizeDNA(dna) {
  return [
    `structure=${dna.structure.id}`,
    `goal=${dna.goal.id}`,
    `tone=${dna.tone.id}`,
    `pacing=${dna.pacing.id}`,
    `conflict=${dna.conflict.id}`,
    `helper=${dna.helper.id}`,
    `twist=${dna.twist.id}`,
    `ending=${dna.ending.id}`,
    `narrative=${dna.narrative.id}`,
    `opening=${dna.opening.id}`,
  ].join(' | ')
}
