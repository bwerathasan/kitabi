// ---------------------------------------------------------------------------
// Theme definitions — 16 pages each, real narrative arc
// ---------------------------------------------------------------------------
const THEMES = {

  jungle: {
    title:          'ومغامرة الأدغال الخضراء',
    setting:        'الأدغال الخضراء',
    coverGradient:  'linear-gradient(150deg,#0d3320 0%,#1a6640 55%,#0f4728 100%)',
    accentColor:    '#4eca82',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.55">
      <ellipse cx="160" cy="175" rx="160" ry="30" fill="#0a2a18"/>
      <rect x="20" y="60" width="18" height="120" fill="#0f3d20" rx="4"/>
      <ellipse cx="29" cy="55" rx="28" ry="40" fill="#1a5c30"/>
      <ellipse cx="29" cy="45" rx="20" ry="30" fill="#22753d"/>
      <rect x="60" y="80" width="14" height="100" fill="#0f3d20" rx="3"/>
      <ellipse cx="67" cy="75" rx="22" ry="32" fill="#1a5c30"/>
      <rect x="270" y="50" width="20" height="130" fill="#0f3d20" rx="4"/>
      <ellipse cx="280" cy="44" rx="30" ry="44" fill="#1a5c30"/>
      <ellipse cx="280" cy="32" rx="22" ry="32" fill="#22753d"/>
      <rect x="240" y="75" width="14" height="105" fill="#0f3d20" rx="3"/>
      <ellipse cx="247" cy="70" rx="20" ry="28" fill="#1a5c30"/>
      <path d="M80 170 Q160 100 240 170" fill="none" stroke="#4eca82" stroke-width="3" opacity=".6"/>
      <circle cx="160" cy="30" r="16" fill="#f9d84a" opacity=".7"/>
      <line x1="160" y1="10" x2="160" y2="0" stroke="#f9d84a" stroke-width="2" opacity=".5"/>
    </svg>`,
    pages: (name, he) => [
      `في صباح جميل، فتح ${name} عينيه على صوت غريب.
كان يأتي من الأدغال الخضراء خارج النافذة.
قفز من سريره وانطلق نحو الأشجار.`,

      `دخل ${name} الأدغال ووقف مبهوراً.
الأشجار عملاقة والضوء الذهبي يرقص بين الأوراق.
الأزهار الملوّنة تفوح برائحتها في كل مكان.`,

      `فجأة سمع ${name} بكاءً صغيراً حزيناً.
رأى ببّغاءً ملوّناً يرتجف خائفاً على غصن.
قال الببّغاء: "ضعت، لا أعرف طريق البيت."`,

      `مدّ ${name} يده بلطف وابتسم للببّغاء.
قفز الطائر الصغير إلى يده وتوقف عن البكاء.
قال ${name}: "لا تخف، سنجد طريق بيتك معاً."`,

      `ساروا معاً بين الأشجار الكثيفة والجميلة.
الببّغاء على كتف ${name} يصف عشّه البعيد.
كانا فريقاً واحداً لا يعرف المستحيل.`,

      `وجد ${name} جداراً من الكروم يسدّ الطريق.
بحث عن ممر بصبر ولم ييأس لحظة.
رأى ضوءاً خافتاً في الجهة اليسرى فسار نحوه.`,

      `وراء الكروم كان فيل ضخم بعيون طيّبة.
قال الفيل: "أعرف أين تعيش عائلة الببّغاء — اتبعاني."
فرح ${name} وقال: "شكراً لك أيها الفيل الكريم."`,

      `وصلوا إلى جسر خشبي معلّق فوق نهر سريع.
قال الفيل: "الجسر لا يتحمّلني — أنتما تعبران وحدكما."
أخذ ${name} نفساً عميقاً وخطا أول خطوة.`,

      `في منتصف الجسر بدأ المطر يسقط والريح تشتد.
الجسر يتمايل والببّغاء يتشبث بكتف ${name}.
قال ${name} بصوت هادئ: "سنعبر معاً، لا تخف."`,

      `بعد العاصفة جلس ${name} تحت شجرة كبيرة يفكّر.
رأى شيئاً في الطين لم يلاحظه من قبل.
كانت آثار أقدام طائر كبير — هذا هو الطريق!`,

      `تبع ${name} الأثر بخطوات واثقة وسريعة.
عادت الشمس وأضاءت الأدغال من حوله.
الطريق صار واضحاً أمامه خطوة خطوة.`,

      `صعدا تلة صغيرة ورأيا شجرة عملاقة مضيئة.
على أغصانها أعشاش كبيرة ملوّنة وجميلة.
صاح الببّغاء بصوت عالٍ من الفرح الغامر.`,

      `طار الببّغاء نحو عائلته وهي تملأ الأغصان.
الطيور تغني وترفرف وتملأ السماء بألوانها.
دمعت عين ${name} وعلى وجهه أجمل ابتسامة.`,

      `جاء الفيل ونقر كتف ${name} بخرطومه برفق.
قال: "الأدغال لن تنسى اسمك يا ${name} أبداً."
شعر ${name} بدفء عجيب يملأ صدره من الداخل.`,

      `مع الغروب بدأ ${name} رحلة العودة سعيداً.
الطيور ترافقه من فوق وتغني له بفرح.
الأدغال تودّعه بضوء ذهبي دافئ وجميل.`,

      `وصل ${name} إلى البيت مع آخر ضوء في السماء.
نام بابتسامة عريضة على وجهه الجميل.
وفي حلمه كانت الأدغال تناديه: "تعال مرة أخرى."`,
    ],
  },

  space: {
    title:          'ورحلة النجوم البعيدة',
    setting:        'الكون الواسع',
    coverGradient:  'linear-gradient(150deg,#06001a 0%,#150a3d 55%,#0a0525 100%)',
    accentColor:    '#a78bfa',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.6">
      <circle cx="40" cy="30" r="2" fill="white" opacity=".8"/>
      <circle cx="90" cy="15" r="1.5" fill="white" opacity=".9"/>
      <circle cx="150" cy="25" r="2.5" fill="white" opacity=".7"/>
      <circle cx="200" cy="10" r="2" fill="white" opacity=".85"/>
      <circle cx="270" cy="20" r="1.5" fill="white"/>
      <circle cx="300" cy="45" r="2" fill="white" opacity=".6"/>
      <circle cx="60" cy="70" r="1" fill="white" opacity=".7"/>
      <circle cx="240" cy="60" r="1.5" fill="white" opacity=".8"/>
      <circle cx="120" cy="55" r="1" fill="white" opacity=".6"/>
      <circle cx="180" cy="140" r="1.5" fill="white" opacity=".5"/>
      <circle cx="30" cy="120" r="1" fill="white" opacity=".7"/>
      <circle cx="290" cy="110" r="1.5" fill="white" opacity=".6"/>
      <circle cx="160" cy="80" r="28" fill="#2a1a6e" stroke="#a78bfa" stroke-width="1.5" opacity=".9"/>
      <circle cx="160" cy="80" r="22" fill="#1e1060" opacity=".8"/>
      <ellipse cx="160" cy="80" rx="44" ry="10" fill="none" stroke="#a78bfa" stroke-width="1.5" opacity=".6"/>
      <polygon points="140,40 148,60 132,60" fill="#e0d0ff" opacity=".9"/>
      <rect x="136" y="60" width="8" height="14" fill="#c4b0ff" opacity=".9"/>
      <circle cx="100" cy="140" r="12" fill="#3d2080" opacity=".7"/>
      <circle cx="250" cy="150" r="8" fill="#1e3a5c" opacity=".6"/>
    </svg>`,
    pages: (name, he) => [
      `في ليلة هادئة، وقف ${name} أمام نافذته ينظر إلى النجوم.
نجمة واحدة كانت تومض بشكل غريب — كأنها تناديه.
قال ${name} في سرّه: "أريد أن أعرف ما هناك."`,

      `فجأة هبطت مركبة فضائية صغيرة في الحديقة.
كانت تتوهج بلون أرجواني وبابها مفتوح لـ${name}.
على جانبها كتب بضوء ساطع: "للقادم من الأرض."`,

      `دخل ${name} المركبة بقلب شجاع.
من المقعد المجاور خرج صوت صغير: "أخيراً وجدتك!"
كان مخلوق صغير يضيء اسمه لامع ويبتسم بحنان.`,

      `انطلقت المركبة وصارت الأرض كرة زرقاء صغيرة.
النجوم تملأ كل مكان والفضاء يبهر العيون.
قال ${name} مندهشاً: "يا لهذا الجمال الرائع!"`,

      `رأى ${name} ولامع كواكب عجيبة في الطريق.
كوكب أحمر تغطيه عواصف وآخر يلمع كالجليد الأزرق.
كان ${name} يلتهم كل شيء بعينيه بشوق كبير.`,

      `أمامهما ظهرت سحابة ضخمة من الغبار الكوني المظلم.
قال لامع: "طريقنا يمر عبر هذا السديم."
قال ${name} بهدوء وثقة: "لا بأس — سنعبر معاً."`,

      `دخلا السديم وصار كل شيء معتماً من حولهما.
قال لامع بصوت خائف: "لا أرى شيئاً يا ${name}."
مدّ ${name} يده وأمسك يد لامع الصغيرة بدفء.`,

      `خرجا من السديم وأمامهما مجرة تضيء بألف لون.
بكى لامع من الفرح وقال: "هذه مجرتي — وصلنا!"
ضحك ${name} وضغط على كتف صديقه بفرح.`,

      `هبطا على كوكب لامع المصنوع كله من الضوء.
ركض لامع إلى عائلته وغاص في أحضانهم.
وقف ${name} ينظر وقلبه يمتلئ بشيء دافئ وجميل.`,

      `التفت لامع إلى ${name} وقال بصوت مرتجف:
"بفضلك عدت — أنت أشجع من رأيت في كل الكون."
أطرق ${name} برأسه وابتسم ابتسامة هادئة.`,

      `كتبت عائلة لامع اسم ${name} في السماء بالنجوم.
ظلّ الاسم يضيء فوق الكوكب ويراه الجميع.
قال كبير العائلة: "اسم ${name} هنا إلى الأبد."`,

      `أعطى لامع ${name} كرة زجاجية بداخلها نجمة حقيقية.
قال: "كلما نظرت إليها — أعلم أنك تفكر فيّ."
أمسكها ${name} بيديه وشعر بدفء غريب جميل.`,

      `انطلقت المركبة في رحلة العودة والنجمة تضيء.
جلس ${name} هادئاً يفكر في كل ما رأى وعاش.
كان ${he} مختلفاً تماماً عمّا كان قبل رحلته.`,

      `بدت الأرض من بعيد كجوهرة زرقاء خضراء.
قال ${name}: "كم هي جميلة عندما تراها من الفضاء!"
أدرك أنه محظوظ جداً بأن يعيش على هذا الكوكب.`,

      `هبطت المركبة في الحديقة قبيل الفجر بهدوء.
خرج ${name} وأخذ نفساً عميقاً من هواء الأرض الدافئ.
رائحة الأشجار والتراب ملأت صدره بالامتنان.`,

      `نام ${name} والنجمة الزجاجية تضيء بجانبه.
حين استيقظ ابتسم وقال: "الكون يعرف اسمك يا ${name}."
ثم قام لبدء يوم جديد — قلبه مليء بالمغامرة.`,
    ],
  },

  ocean: {
    title:          'وكنوز أعماق البحار',
    setting:        'أعماق البحر',
    coverGradient:  'linear-gradient(150deg,#012a4a 0%,#014f86 55%,#01375e 100%)',
    accentColor:    '#38bdf8',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.55">
      <path d="M0 120 Q80 90 160 120 Q240 150 320 120 L320 180 L0 180 Z" fill="#01375e"/>
      <path d="M0 130 Q80 105 160 130 Q240 155 320 130 L320 180 L0 180 Z" fill="#012a4a" opacity=".7"/>
      <ellipse cx="160" cy="95" rx="35" ry="25" fill="#0369a1" opacity=".6"/>
      <ellipse cx="145" cy="95" rx="15" ry="10" fill="#0ea5e9" opacity=".4"/>
      <path d="M190 95 Q200 88 210 95 Q200 102 190 95" fill="#38bdf8" opacity=".7"/>
      <circle cx="190" cy="94" r="2" fill="#0c4a6e"/>
      <path d="M80 140 Q90 130 100 140 Q90 150 80 140" fill="#7dd3fc" opacity=".5"/>
      <circle cx="80" cy="139" r="1.5" fill="#0c4a6e"/>
      <circle cx="120" cy="60" r="4" fill="#38bdf8" opacity=".3"/>
      <circle cx="160" cy="40" r="3" fill="#38bdf8" opacity=".2"/>
      <circle cx="200" cy="65" r="4" fill="#38bdf8" opacity=".3"/>
      <circle cx="250" cy="90" r="3" fill="#38bdf8" opacity=".25"/>
      <path d="M40 155 Q50 145 55 155 Q50 160 40 155" fill="#ffd700" opacity=".5"/>
      <path d="M60 145 Q65 138 70 145 Q65 150 60 145" fill="#ffd700" opacity=".4"/>
    </svg>`,
    pages: (name, he) => [
      `في الصباح الباكر، مشى ${name} على رمال الشاطئ الناعمة.
لمح شيئاً يلمع بين الأصداف — زجاجة بداخلها ورقة.
فتحها بيدين مرتجفتين وقلبه يدق بسرعة.`,

      `كانت الورقة رسالة مكتوبة بحبر فيروزي جميل.
"يا ${name}، في الكهف المرجاني كنز ينتظرك وحدك."
رفع ${name} رأسه ونظر إلى البحر — ودولفين يقفز ويومئ.`,

      `ارتدى ${name} نظارة الغوص ونزل مع الدولفين إلى الماء.
الماء دافئ والضوء يتحوّل إلى ألوان زرقاء وخضراء.
شعاب مرجانية ملوّنة وأسماك ذهبية تسبح حوله.`,

      `قاد الدولفين ${name} عبر ممر بين صخرتين ضخمتين.
شقائق النعمان البحرية تتمايل على الجانبين كالحرير.
ظهر في النهاية كهف مليء بضوء أبيض هادئ.`,

      `عند مدخل الكهف جلس أخطبوط ضخم بعيون ذكية.
قال بصوت أجش: "لا يدخل الكهف إلا من يستحق."
وقف ${name} أمامه بثبات ولم يخف.`,

      `قال الأخطبوط: "ما أثمن شيء تملكه في حياتك؟"
صمت ${name} ثم قال بهدوء: "الناس الذين يحبونني."
تمايلت أطراف الأخطبوط من الرضا وفتح الطريق.`,

      `في قلب الكهف وجد ${name} صندوقاً من الصدف الذهبي.
عليه اسمه منقوش بحروف لؤلؤية تتوهج.
فتحه ببطء وقلبه يكاد يطير من الترقب.`,

      `داخل الصندوق كتاب صغير ملفوف بالصدف الناعم.
عنوانه: "قصة ${name} — بطل البحار."
فتحه فرأى صفحاته تحكي قصة مغامرته هو بالضبط.`,

      `بدأت الأسماك تتجمع من كل مكان حول ${name}.
الدولفين يقفز فرحاً والأخطبوط يسبح بجانبه.
كان البحر كله يحتفل بالبطل الصغير.`,

      `صعد ${name} إلى السطح والكتاب في يده.
وقف على الشاطئ يتنفس هواء البحر المالح.
نظر إلى الماء وقال بصوت خافت: "شكراً."`,

      `في المساء، قرأ ${name} الكتاب أمام الغروب الجميل.
أدرك أن الكنز الحقيقي هو الجرأة التي أثبتها لنفسه.
قال ${he}: "الصدق هو أشجع شيء يمكن قوله."`,

      `في اليوم التالي، عاد ${name} إلى الشاطئ.
الدولفين كان ينتظره يقفز ويلوّح بذيله.
سبحا معاً قريباً من السطح و${name} يضحك من الفرح.`,

      `حكى ${name} لأمه القصة كاملة تلك الليلة.
حين انتهى قالت وعيناها مفتوحتان: "كيف عرف الأخطبوط؟"
ابتسم ${name}: "كل الكائنات تعرف قيمة الحب يا أمي."`,

      `وضع ${name} الكتاب على رفّه إلى جانب النجمة الزجاجية.
يراه كل صباح قبل أن يبدأ يومه.
ذكرى البحر والدولفين لا تفارقه أبداً.`,

      `في صيف جديد، وقف ${name} على الرمال ينظر إلى الأفق.
الأمواج تأتي وتذهب في دورة لا تنتهي.
قال للبحر: "أنا جاهز لأي مغامرة قادمة."`,

      `قصة ${name} لم تنته على ذلك الشاطئ — بل بدأت هناك.
لأنه تعلّم شيئاً لا يُعلَّم في أي مكان: الصدق قوة.
وكنز الشجاعة يعيش في القلب — لا في أي صندوق.`,
    ],
  },

  forest: {
    title:          'وسر الغابة العجيبة',
    setting:        'الغابة الخضراء الساحرة',
    coverGradient:  'linear-gradient(150deg,#14230f 0%,#2d5016 55%,#1c3a0e 100%)',
    accentColor:    '#86efac',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.55">
      <rect x="0" y="0" width="320" height="180" fill="none"/>
      <polygon points="60,160 90,80 120,160" fill="#1a4010"/>
      <polygon points="60,140 90,60 120,140" fill="#2d5016"/>
      <polygon points="40,160 75,70 110,160" fill="#1a4010" opacity=".7"/>
      <polygon points="190,160 220,75 250,160" fill="#1a4010"/>
      <polygon points="190,145 220,55 250,145" fill="#2d5016"/>
      <polygon points="210,160 245,65 280,160" fill="#1a4010" opacity=".7"/>
      <rect x="130" y="100" width="60" height="80" fill="#0a1f06" opacity=".6" rx="4"/>
      <path d="M145 100 Q160 60 175 100" fill="#1f4a0a"/>
      <path d="M135 100 Q160 50 185 100" fill="#2d5016" opacity=".8"/>
      <path d="M125 100 Q160 38 195 100" fill="#1a4010" opacity=".6"/>
      <path d="M155 180 Q160 140 165 120" stroke="#86efac" stroke-width="2" fill="none" opacity=".4"/>
      <circle cx="80" cy="30" r="3" fill="#86efac" opacity=".5"/>
      <circle cx="150" cy="15" r="2" fill="#86efac" opacity=".4"/>
      <circle cx="240" cy="25" r="3" fill="#86efac" opacity=".5"/>
    </svg>`,
    pages: (name, he) => [
      `في صباح ربيعي، مشى ${name} في الغابة الكبيرة.
الشمس ترسم دوائر ذهبية بين الأوراق الخضراء.
سمع فجأة همساً خافتاً من الأشجار: "أخيراً جاء ${name}."`,

      `اقترب ${name} من شجرة ضخمة ملتفة باللبلاب.
كتب عليها: "شجرة القلب — مريضة منذ ألف شهر."
قال صوت من داخلها: "أحتاج ماء الينبوع البعيد."`,

      `ظهر أمامه أرنب أبيض بعيون برتقالية دافئة.
قال الأرنب: "أعرف طريق الينبوع، لكنه صعب."
قال ${name} بلا تردد: "لا يهم — هيّا بنا."`,

      `بعد ساعة، وصلا إلى حافة وادٍ عميق ومظلم.
الجسر الوحيد كان من الكروم المتشابكة — رفيعاً ومتأرجحاً.
قال الأرنب: "يعبره فقط من يثق بنفسه."`,

      `خطا ${name} على الجسر بحذر وكل خطوة تجعله يتمايل.
في المنتصف توقف — الكروم بدت تضعف تحت قدميه.
صوت الشجرة تردد في ذهنه فأكمل وعبر بأمان.`,

      `بعد الوادي، كانت ثلاث أشجار ضخمة تسدّ الطريق.
أغصانها تتحرك ببطء رغم انعدام الريح.
قال الأرنب: "هذه الأشجار الحارسة لا تسمح لأحد."`,

      `قال ${name} بصوت واضح: "أنا هنا لأجلب الماء لشجرة القلب."
ببطء، رفعت الأشجار جذورها وفتحت طريقاً في المنتصف.
قال الأرنب بدهشة: "لم يحدث هذا مع أحد من قبل."`,

      `وراء الأشجار رأى ${name} الينبوع — دائرة من الحجارة الرملية.
تتفجر منها مياه تلمع كالماس ومن حوله زهور بيضاء.
جثا ${name} بجانبه ونظر إلى انعكاس وجهه في الماء.`,

      `أخرج ${name} قارورة صغيرة وملأها بماء الينبوع.
الماء بارد وله ضوء خفيف يشبه ضوء النجوم.
قال ${he}: "الآن نعود."`,

      `رحلة العودة كانت أسرع — كأن الغابة هي من تدلّهما.
الأشجار تنحني وهما يمران كأنها تحييهما.
أصوات الطيور تملأ الهواء من كل اتجاه.`,

      `وصلا إلى شجرة القلب وكانت أكثر شحوباً من قبل.
سكب ${name} الماء السحري على جذورها ببطء وبحب.
والشجرة تمتصّه كما يشرب العطشان بعد رحلة طويلة.`,

      `بدأ التأثير فوراً — أوراق خضراء داكنة تنبت بسرعة.
زهور تتفتح على الأغصان لم تفتح منذ سنوات.
قالت الشجرة: "شكراً يا ${name}. شفيتني."`,

      `من كل مكان بدأت الحيوانات تظهر واحدة تلو الأخرى.
غزلان وطيور ملوّنة وقنافذ صغيرة تطلّ من العشب.
كانت الغابة كلها تقول شكراً بطريقتها الصامتة الجميلة.`,

      `قدّمت شجرة القلب لـ${name} ورقة خضراء تضيء في الظلام.
قالت: "حين تشعر بالخوف أو الحزن، انظر إليها."
قبل ${name} الهدية وحفظها بين دفتي كتابه.`,

      `مشى ${name} نحو البيت والشمس تغرب خلف الأشجار.
الورقة في يده تضيء بخفوت هادئ وجميل.
عرف أن في داخله قوة لم يكن يعرف أنها موجودة.`,

      `في غرفته، وضع ${name} الورقة المضيئة على مكتبه.
الغرفة بها ظل أخضر ناعم من ضوئها الهادئ.
نام ${name} وهو يعرف: الغابة صديقته إلى الأبد.`,
    ],
  },

  desert: {
    title:          'وكنز الصحراء المخفي',
    setting:        'الصحراء الواسعة الذهبية',
    coverGradient:  'linear-gradient(150deg,#3d1f00 0%,#a05c00 55%,#7a4200 100%)',
    accentColor:    '#fbbf24',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.55">
      <path d="M0 140 Q80 100 160 120 Q240 140 320 100 L320 180 L0 180 Z" fill="#7a4200"/>
      <path d="M0 155 Q100 120 180 140 Q260 160 320 130 L320 180 L0 180 Z" fill="#3d1f00" opacity=".8"/>
      <circle cx="160" cy="40" r="30" fill="#f59e0b" opacity=".6"/>
      <circle cx="160" cy="40" r="22" fill="#fbbf24" opacity=".5"/>
      <line x1="160" y1="5" x2="160" y2="-5" stroke="#fbbf24" stroke-width="3" opacity=".4"/>
      <line x1="195" y1="15" x2="203" y2="7" stroke="#fbbf24" stroke-width="2" opacity=".4"/>
      <line x1="125" y1="15" x2="117" y2="7" stroke="#fbbf24" stroke-width="2" opacity=".4"/>
      <rect x="230" y="90" width="6" height="50" fill="#1a5c1a" rx="2"/>
      <ellipse cx="233" cy="88" rx="10" ry="16" fill="#2d7a2d"/>
      <path d="M233 95 Q248 88 255 95" fill="#2d7a2d"/>
      <path d="M233 95 Q218 90 212 98" fill="#2d7a2d"/>
      <circle cx="80" cy="50" r="6" fill="#fbbf24" opacity=".3"/>
      <circle cx="260" cy="35" r="4" fill="#fbbf24" opacity=".25"/>
    </svg>`,
    pages: (name, he) => [
      `في الفجر الباكر، خرج ${name} إلى الصحراء الواسعة.
الرمال باردة تحت قدميه والهواء طازج وعطر.
شيء في داخله يقوده نحو الشرق دون أن يعرف لماذا.`,

      `بين الصخور، وجد ${name} إناءً طينياً قديماً وثقيلاً.
فتحه فوجد داخله خريطة على جلد مطوية بعناية.
على الخريطة في نهاية الطريق — اسم ${name} بخط واضح.`,

      `في القرية القريبة، قال الشيوخ: "هذه أسطورة قديمة."
"واحة مخفية تنتظر بطلاً يحمل اسماً مخصوصاً."
قال ${name}: "إذن أنا من تنتظره — سأذهب."`,

      `انطلق ${name} مع شروق الشمس نحو الصحراء الواسعة.
الرمال الذهبية تمتد كبحر لا نهاية له.
الكثبان تتعاقب مثل أمواج متجمدة تحت القدمين.`,

      `في منتصف النهار، كانت الحرارة لا ترحم.
التصق لسان ${name} بفمه والقارورة أصبحت دافئة.
تسرّب شك صغير إلى قلبه: "هل أنا في الطريق الصحيح؟"`,

      `جلس ${name} في ظل صخرة صغيرة ونظر إلى الخريطة.
قطع نصف الطريق — الباقي مثل ما قطع.
قام وأكمل وخطواته أكثر عزماً من قبل.`,

      `قبيل العصر، ظهر ثعلب صحراوي صغير بأذنين كبيرتين.
قال بصوت أجش لطيف: "أنت تبحث عن الواحة؟"
قال ${name}: "نعم." قال الثعلب: "تعال، أعرف طريقاً أقصر."`,

      `قاد الثعلب ${name} عبر ممر ضيق بين صخرتين.
الهواء بينهما أكثر برودة وفيه ظل رائع.
قال الثعلب: "الصحراء تخفي دروبها لمن يعرف كيف ينظر."`,

      `خرجوا من الممر وتوقف ${name} فجأة مندهشاً.
أمامه على بعد دقائق — خضرة حقيقية ونخيل يمتد.
قال بصوت مخنوق: "الواحة... موجودة فعلاً!"`,

      `دخل ${name} الواحة ووجد بحيرة فيروزية شفافة.
ركع عندها وشرب بيديه — الماء بارد كالثلج.
أغمض عينيه وبقي لحظة طويلة يشكر.`,

      `رأى ${name} على حوافي البحيرة حجارة مرتبة بعناية.
على كل حجر اسم — أسماء من زاروا الواحة قديماً.
وفي الوسط حجر فارغ عليه سهم ينتظر اسماً.`,

      `أخرج ${name} حجراً صغيراً ونقش اسمه ببطء.
الحروف تخرج واضحة وعميقة على الحجر الرملي.
قال الثعلب: "الواحة الآن لها حارس جديد."`,

      `حين اقترب الغروب، بدأت الحيوانات تتوافد إلى الواحة.
غزلان وطيور وثعالب تأتي بهدوء وتشرب.
الصحراء مختلفة تماماً عمّا تبدو عليه من بعيد.`,

      `بات ${name} في الواحة تحت سماء الصحراء المفتوحة.
ملايين النجوم في ظلام أزرق عميق — لا ضوء يعلوها.
قال الثعلب: "الجمال دائماً يختبئ وراء الصعوبة."`,

      `في الصباح، رافق الثعلب ${name} حتى حافة الواحة.
قال ${name}: "لماذا لا تأتي معي؟" قال الثعلب: "مكاني هنا."
"لكن أنت تحمل ما يكفي لترشد الآخرين إلى هنا."`,

      `حين وصل ${name} إلى القرية، خرج الشيوخ لاستقباله.
قال لهم: "الواحة موجودة — وهي أجمل مما يُقال."
اسمه منقوش في وسطها إلى الأبد — يقول للقادمين: "كان هنا بطل."`,
    ],
  },

  farm: {
    title:          'ويوم البطولة في المزرعة',
    setting:        'المزرعة الخضراء الجميلة',
    coverGradient:  'linear-gradient(150deg,#0f2d0a 0%,#2a6314 55%,#1c4a0e 100%)',
    accentColor:    '#bef264',
    coverSvg: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;margin:0 auto;display:block;opacity:.55">
      <rect x="0" y="100" width="320" height="80" fill="#1c4a0e"/>
      <rect x="0" y="110" width="320" height="80" fill="#0f2d0a" opacity=".6"/>
      <rect x="115" y="60" width="90" height="80" fill="#8b2500" rx="2"/>
      <polygon points="115,60 160,20 205,60" fill="#6b1c00"/>
      <rect x="145" y="100" width="30" height="40" fill="#3d1100"/>
      <rect x="130" y="70" width="20" height="15" fill="#fbbf24" opacity=".6" rx="2"/>
      <rect x="170" y="70" width="20" height="15" fill="#fbbf24" opacity=".6" rx="2"/>
      <circle cx="55" cy="75" r="20" fill="#2d6314" opacity=".7"/>
      <rect x="51" y="90" width="8" height="50" fill="#1c3d0a"/>
      <circle cx="260" cy="70" r="16" fill="#2d6314" opacity=".7"/>
      <rect x="256" y="82" width="8" height="48" fill="#1c3d0a"/>
      <ellipse cx="90" cy="120" rx="15" ry="10" fill="#f9fafb" opacity=".6"/>
      <circle cx="90" cy="112" r="6" fill="#f9fafb" opacity=".7"/>
      <ellipse cx="220" cy="125" rx="12" ry="8" fill="#fef08a" opacity=".5"/>
      <circle cx="220" cy="118" r="5" fill="#fef08a" opacity=".6"/>
    </svg>`,
    pages: (name, he) => [
      `مع الفجر، فتح ${name} عينيه على صوت ديك يصيح.
كان اليوم مختلفاً — شعر بذلك قبل أن ينهض من سريره.
ركض إلى الخارج حيث أشعة الشمس تلوّن السماء بالبرتقالي.`,

      `في الحظيرة، وجد المزارع العجوز يجمع أدواته بقلق.
قال: "عاصفة كبيرة قادمة — الحصاد كله في الخطر."
نظر ${name} إلى الحقل الواسع وقال: "إذن نبدأ الآن."`,

      `بدأ ${name} بإيقاظ الحيوانات بلطف وشرح لها.
الحصان "نور" أومأ برأسه والبقرة "زهرة" تحركت.
قال ${name}: "سنعمل معاً — كلنا."`,

      `انطلقوا إلى الحقل في رتل منظّم ورائع.
${name} يقود ونور يجرّ العربة وزهرة تسير بجانبها.
بدأوا قطف الطماطم ووضعها في الصناديق بعناية.`,

      `بعد ساعتين، أنجزوا ثلث الحصاد.
لكن السماء بدأت تتحول وغيوم رمادية تتجمع.
سمعوا رعداً بعيداً والعاصفة تقترب أسرع مما توقعوا.`,

      `ثم حدث شيء مدهش — تحركت الأبقار من تلقاء نفسها.
خرج القطيع كله من الحظيرة ليساعد في الحقل.
نظر ${name} إلى هذا المشهد ودهش من عجيب الأمر.`,

      `البقرة زهرة تدفع الصناديق بأنفها نحو العربة.
والكلب بشير ينبح تنبيهاً لكل حيوان يحيد عن مساره.
قال ${name} وهو يعمل: "أنتم أذكى مني بكثير!"`,

      `لكن السماء لم تنتظر — الرياح اشتدت فجأة.
الغيوم حلّت فوق المزرعة وأول قطرات المطر سقطت.
لا يزال ربع الحصاد في الحقل.`,

      `قال ${name} بصوت عالٍ: "لن نتوقف!"
الجميع أسرع والمطر يسقط أسرع والريح تحمل الأوراق.
لكن العربة تتحرك والصناديق تمتلئ والحصاد ينتقل.`,

      `آخر صندوق من الطماطم — آخر عنقود من الذرة.
ركض ${name} بالصندوق الأخير والريح تدفعه والمطر يغسل وجهه.
أغلق باب الحظيرة لحظة بدأت العاصفة بكامل قوتها.`,

      `خارجاً كانت العاصفة تدوي بصوت ضخم وقوي.
لكن داخل الحظيرة كان الدفء والأمان والحصاد سالماً.
الحيوانات تلتف حول ${name} تُدفئه وتبث الاطمئنان.`,

      `جاء المزارع العجوز ووقف أمام ${name} في صمت.
ثم قال وصوته يرتجف: "أنت قدتهم جميعاً يا ${name}."
"المزرعة تعرف من يحبها."`,

      `حين هدأت العاصفة، خرج ${name} إلى الحقل المغسول.
الأرض تلمع والهواء بارد ونظيف.
قال بصوت هادئ: "كم هو جميل بعد العاصفة."`,

      `جلسوا جميعاً — ${name} والمزارع والحيوانات — يأكلون معاً.
المزارع يحكي قصصاً عن المزرعة منذ عشرات السنين.
كانت تلك اللحظة كاملة — لا تنقصها شيء.`,

      `قال المزارع: "سأنقش اسمك على باب الحظيرة يا ${name}."
قال ${name}: "الحيوانات هي من تستحق الشكر."
قال المزارع ضاحكاً: "إذن سننقش اسمك وأسماءهم معاً."`,

      `في الطريق إلى البيت، مشى ${name} بخطوات مرتاحة.
لم يكن أشجع الناس ولا أقواهم — لكنه قرر ألا يستسلم.
وذلك القرار وحده كان يكفي لينقذ كل شيء.`,
    ],
  },
}

// ---------------------------------------------------------------------------
// Image prompt engine
// ---------------------------------------------------------------------------

/**
 * getImagePrompts(theme, child_name)
 * Returns 16 cinematic prompts (cover + 16 story pages).
 * Pages are indexed 0 (cover) through 16.
 */
function getImagePrompts(theme, child_name) {
  const S = `cinematic children's book illustration, ${child_name} as the hero, soft warm lighting, ultra detailed, 4k, storybook style, expressive face, NO text, NO letters, NO words, NO signs, purely visual`

  const PROMPTS = {
    jungle: [
      `${S}, ${child_name} sitting up in bed eyes wide open leaning toward open window, sunlight streaming in, jungle visible outside with colorful birds flying past`,
      `${S}, ${child_name} sitting up in bed eyes wide open leaning toward open window, sunlight streaming in, jungle visible outside with colorful birds flying past`,
      `${S}, ${child_name} stepping into the emerald jungle for the first time, both hands touching a giant fern, neck craning upward at towering ancient trees, golden light filtering down like cathedral windows`,
      `${S}, ${child_name} kneeling on the jungle floor, one hand gently extended toward a small colorful parrot trembling on a low branch, face calm and kind`,
      `${S}, ${child_name} walking along jungle path with small parrot perched on shoulder, both looking ahead with determination, lush green foliage pressing in on all sides`,
      `${S}, ${child_name} standing before an enormous wall of thick hanging vines, examining it with hands on hips, searching for a way through, shafts of light through gaps`,
      `${S}, ${child_name} face to face with a massive gentle elephant in a sun-dappled jungle clearing, child looking tiny beside it, elephant's eye warm and kind, parrot on shoulder`,
      `${S}, ${child_name} stepping carefully onto a wooden rope bridge suspended over a fast rushing river far below, hands gripping rope rails, storm clouds gathering behind`,
      `${S}, ${child_name} gripping the rope bridge railing in heavy rain, rain pouring, lightning lighting dark sky, parrot clinging tightly to shoulder, determined face`,
      `${S}, ${child_name} crouching under a giant tropical leaf shelter after the storm, parrot tucked under one arm, pointing at bird footprints in wet jungle mud, glowing mushrooms in mist`,
      `${S}, ${child_name} walking confidently following bird footprint trail, head up, colorful birds watching from branches overhead, sun breaking through canopy`,
      `${S}, ${child_name} climbing up a small green hill toward an enormous ancient glowing tree at its summit, golden sunset sky behind, birds circling the treetop`,
      `${S}, ${child_name} standing below the great tree with arms slightly outstretched, watching the parrot fly upward to reunite with its bird family in the canopy, joy and tears on face`,
      `${S}, ${child_name} receiving a gentle farewell touch from a giant elephant's trunk on the shoulder, looking up at it with a warm smile, jungle glowing golden`,
      `${S}, ${child_name} walking home through the jungle at golden hour, silhouette against warm orange sky, flock of colorful birds flying overhead in escort`,
      `${S}, ${child_name} asleep in bed with a wide peaceful smile, window open showing dark jungle night with stars and distant bird calls, a parrot feather on the pillow beside`,
      `${S}, ${child_name} looking at a colorful parrot feather on the windowsill, morning light catching it, jungle visible and alive outside, face peaceful and knowing`,
    ],
    space: [
      `${S}, ${child_name} standing on a rooftop at night gazing at a vast star-filled sky, telescope beside, city lights below, cosmic wonder in eyes`,
      `${S}, ${child_name} standing at bedroom window at night in pajamas, pressing fingertip to glass pointing at one blinking star, face bathed in soft starlight`,
      `${S}, ${child_name} looking out at a small glowing purple spacecraft just landed in the garden, door open, face lit with amazed disbelief, hands on window glass`,
      `${S}, ${child_name} stepping through the spacecraft door with a brave expression, small glowing creature inside looking delighted, golden interior light`,
      `${S}, ${child_name} inside rocket cabin pressing face to porthole, watching Earth shrink to a tiny blue marble in black space, pure joy on face`,
      `${S}, ${child_name} floating weightless inside cabin pressing against porthole, strange ringed planet drifting past, hair floating in zero gravity, laughing`,
      `${S}, ${child_name} inside a dark swirling cosmic cloud, small glowing creature reaching up to grab child's hand, only the creature's glow for light`,
      `${S}, ${child_name} emerging from nebula into blazing galaxy light of a thousand colors, creature jumping with joy beside them, both faces lit by the spectacular view`,
      `${S}, ${child_name} standing on glowing planet surface watching the small creature run toward its waiting family in the distance, warm smile, watching reunion with pride`,
      `${S}, ${child_name} and small glowing creature holding hands, creature looking up with deep gratitude, child looking down with a humble smile, stars surrounding them`,
      `${S}, ${child_name} looking up at the night sky as stars rearrange to spell out a name in the cosmos, face flooded with astonished joy, creature pointing upward excitedly`,
      `${S}, ${child_name} receiving a small crystal ball containing a living glowing star from the creature, cupped in both hands, warm light on both their faces`,
      `${S}, ${child_name} sitting at spacecraft window looking out at deep black space journeying home, crystal star glowing softly in hands, thoughtful expression`,
      `${S}, ${child_name} pressing face to spacecraft porthole, Earth visible as a gorgeous blue-green jewel in black space ahead, expression of love and gratitude`,
      `${S}, ${child_name} stepping out of the spacecraft in the garden before dawn, breathing deeply, trees and familiar grass around, spacecraft door glowing behind`,
      `${S}, ${child_name} standing in the garden eyes closed face tilted up taking a deep slow breath of Earth air, trees and flowers around, peaceful smile of gratitude`,
      `${S}, ${child_name} asleep in bed, crystal star glowing softly on bedside shelf, bedroom window showing star-filled night sky outside, peaceful smile`,
    ],
    ocean: [
      `${S}, ${child_name} on a wooden dock at sunrise, ocean stretching to the horizon, golden morning light on water, quiet wonder`,
      `${S}, ${child_name} bending down on the beach at dawn reaching to pick up a small glowing bottle half-buried in wet sand among shells, eyes wide with curiosity`,
      `${S}, ${child_name} holding an unrolled paper letter up reading it, turquoise ink glowing, eyes wide, dolphin leaping from the sea in the background`,
      `${S}, ${child_name} at the water's edge adjusting diving goggles on face, about to dive in, dolphin visible just beneath the clear turquoise surface waiting`,
      `${S}, ${child_name} swimming underwater through vibrant coral reef, colorful tropical fish swirling all around, light rays piercing blue-green water from above`,
      `${S}, ${child_name} swimming through a narrow underwater passage between two massive rocks, sea anemones waving on both sides, dolphin just ahead leading the way`,
      `${S}, ${child_name} hovering underwater face to face with a massive octopus with large wise eyes at a glowing cave entrance, standing ground without fear`,
      `${S}, ${child_name} kneeling in underwater cave opening a golden shell chest with both trembling hands, name visible in pearl letters on the lid, warm glow in the cave`,
      `${S}, ${child_name} in glowing underwater cave holding a small shell-wrapped book whose pages turn on their own, face full of wonder`,
      `${S}, ${child_name} underwater surrounded by hundreds of colorful fish swirling in a joyful spiral, dolphin leaping above, octopus swimming gracefully at side`,
      `${S}, ${child_name} standing on beach just surfaced from water, dripping and happy, one hand raised in farewell toward the ocean`,
      `${S}, ${child_name} sitting on a rock at the water's edge at golden sunset reading the shell book, warm orange light, ocean behind them`,
      `${S}, ${child_name} standing at shore as dolphin leaps joyfully from water right in front, child laughing with arms open wide in greeting, pure friendship`,
      `${S}, ${child_name} sitting across from mother indoors at night telling the story animatedly, mother's eyes wide and mouth open in amazement, warm lamp light`,
      `${S}, ${child_name} reaching up to carefully place the small shell book on a bedroom shelf beside a glowing crystal star, morning light through window`,
      `${S}, ${child_name} standing barefoot at the ocean's edge in a new summer, waves washing over feet, looking at the wide calm horizon, wind in hair`,
      `${S}, ${child_name} standing on the beach, one hand over heart, looking toward the horizon where the adventure began, story continuing inside`,
    ],
    forest: [
      `${S}, ${child_name} at the edge of a vast ancient misty forest at dawn, sunbeams streaming between enormous old oaks, deer silhouettes visible between the trees`,
      `${S}, ${child_name} walking in the spring forest, suddenly stopped mid-step, head turning and eyes widening, listening — the trees seem to be whispering, golden light through leaves`,
      `${S}, ${child_name} pressing one hand flat against the bark of an enormous ivy-covered old tree, leaning ear close, eyes closed listening, tree pulsing with faint inner light`,
      `${S}, ${child_name} in a flower-filled sun-dappled forest glade, white rabbit with glowing orange eyes sitting upright looking directly at child, wildflowers all around`,
      `${S}, ${child_name} following the white rabbit down a mossy winding forest path, giant ferns on both sides, dappled golden light ahead, curiosity and readiness on face`,
      `${S}, ${child_name} with one foot on the swaying vine bridge over a deep misty valley, hands gripping the vine rails, rabbit watching from safe ground, brave first step`,
      `${S}, ${child_name} standing before three towering ancient trees whose massive roots block the path, looking up at them, branches slowly moving in no wind`,
      `${S}, ${child_name} standing before guardian trees speaking with clear calm voice, the enormous roots beginning to rise from the earth and open a passage, golden light flooding through`,
      `${S}, ${child_name} kneeling at a small spring inside a circle of mossy stones, water glittering like diamonds, white flowers blooming all around it, rabbit beside`,
      `${S}, ${child_name} both hands cupped around a tiny glass bottle being filled with glowing spring water, extreme care and focus, magical light illuminating the hands`,
      `${S}, ${child_name} running through the forest at full speed with the rabbit bounding ahead, trees seeming to bow as they pass, strengthening light ahead, bottle safe in hand`,
      `${S}, ${child_name} kneeling at the Heart Tree roots slowly pouring the glowing water from the tiny bottle onto the pale thirsty roots, eyes full of hope`,
      `${S}, ${child_name} watching in amazement as the Heart Tree explodes into life — new green leaves unfurling, impossible flowers blooming, color flooding the forest`,
      `${S}, ${child_name} standing surrounded by deer, colorful birds on branches, hedgehogs peering from the grass, all gathered peacefully around the blooming Heart Tree`,
      `${S}, ${child_name} receiving a single glowing green leaf lowered from a tree branch, cupped in both hands with deep reverence, soft green light on face`,
      `${S}, ${child_name} walking home through the forest at golden hour, holding glowing green leaf in one hand, it lighting the path softly, rabbit waving ears in farewell`,
      `${S}, ${child_name} at bedroom desk at night, glowing green leaf in a glass jar casting soft green glow across the room, stars visible through window, peaceful`,
    ],
    desert: [
      `${S}, ${child_name} at the edge of the vast golden desert at dawn, sand dunes stretching endlessly, first pink light painting everything warm`,
      `${S}, ${child_name} crouching between desert rocks in cold pre-dawn light, picking up a small old clay jar with both hands from between the boulders, examining it with curiosity`,
      `${S}, ${child_name} carefully unrolling an ancient leather map from the jar in early morning light, eyes going wide seeing name written at the journey's end`,
      `${S}, ${child_name} sitting cross-legged with wise old village elders around a fire at night, the map spread between them, elders pointing and explaining with knowing faces`,
      `${S}, ${child_name} walking away from a small desert village at sunrise, back to viewer, small pack on back, vast golden dunes stretching ahead`,
      `${S}, ${child_name} climbing an enormous sand dune under a blazing white noon sun, struggling with each step that sinks into shifting sand, nearly to the top`,
      `${S}, ${child_name} sitting in the shadow of a large sandstone rock holding the map, studying it carefully, face shifting from doubt to quiet resolve`,
      `${S}, ${child_name} face to face in the open desert with a small elegant desert fox with enormous amber eyes, both still, magical quiet moment of connection`,
      `${S}, ${child_name} following the fox through a narrow canyon passage between tall red rock walls, cool shadow inside, walls close on both sides, fox just ahead`,
      `${S}, ${child_name} stepping out of the canyon into sunlight, hand raised to shield eyes, seeing a shimmer of green in the distance — the oasis — face flooded with disbelief and joy`,
      `${S}, ${child_name} kneeling at the edge of a crystal-clear turquoise oasis pool, scooping water with cupped hands and drinking, fox sitting beside, palm trees above`,
      `${S}, ${child_name} walking slowly around a ring of flat engraved stones surrounding the pool, running fingers across carved names, stopping at one blank stone`,
      `${S}, ${child_name} kneeling at the blank stone carefully using a small rock to carve letters into it, a faint golden glow responding to each mark, fox watching`,
      `${S}, ${child_name} sitting perfectly still among gazelles and birds and foxes gathered at the oasis at sunset, surrounded by wildlife who have come to drink`,
      `${S}, ${child_name} lying on back in the oasis at night gazing upward at the blazing Milky Way stretching across the sky, fox curled asleep beside, fireflies nearby`,
      `${S}, ${child_name} walking beside the fox to the edge of the oasis in morning light, both slowing, child turning back to look at the fox with gratitude`,
      `${S}, ${child_name} arriving back at the desert village, elders coming through doorways to meet them, gesturing toward the desert horizon with confidence and a proud smile`,
    ],
    farm: [
      `${S}, ${child_name} waking before sunrise on the farm, first pink light on fields, rooster crowing outside window, golden dawn light streaming in`,
      `${S}, ${child_name} eyes snapping open in bed at rooster crowing, golden dawn light streaming in, sitting up alert, feeling that today is different`,
      `${S}, ${child_name} standing beside the old farmer in the barn doorway, farmer pointing at darkening horizon with worried face, child listening seriously`,
      `${S}, ${child_name} crouching to look eye-level at the large horse Nour in its stall, horse nodding its head, cow Zahra behind looking ready, golden barn light`,
      `${S}, ${child_name} working in a sunlit field in an organized row, picking bright red tomatoes placing them in wooden crates, horse pulling the cart nearby`,
      `${S}, ${child_name} stopping mid-work to stare at the sky — grey storm clouds rolling in on the horizon, first rumble of thunder, urgency building`,
      `${S}, ${child_name} watching in complete amazement as the cows walk purposefully out of the barn on their own toward the field to help, hands raised in disbelief`,
      `${S}, ${child_name} in center of action, directing — cow Zahra using nose to push heavy crates toward cart, dog Basheer barking to keep animals in line, everyone working`,
      `${S}, ${child_name} working in the field as first heavy raindrops fall, still moving boxes with determination, rain beginning to soak clothes, everyone pushing forward`,
      `${S}, ${child_name} running at full speed toward open barn doors with arms full of the last of the harvest, rain pouring, wind pushing against, doors open ahead`,
      `${S}, ${child_name} leaning against closed barn doors with both hands as full storm hits outside, exhausted, breathless, and triumphant smile breaking across face`,
      `${S}, ${child_name} inside the warm barn, horse resting its large head gently on child's shoulder, cow Zahra nearby, dog Basheer leaning against legs, safe and together`,
      `${S}, ${child_name} old farmer standing before child in the barn, all animals around, farmer's eyes wet with emotion, reaching out a hand to child's shoulder`,
      `${S}, ${child_name} walking slowly through the clean wet field after the storm, air fresh and cool, every leaf glistening, sun breaking through, quiet pride`,
      `${S}, ${child_name} sitting on a hay bale beside the farmer eating simple food and laughing together, animals settling nearby, warm lantern light in the barn`,
      `${S}, ${child_name} farmer holding a chisel to old barn door wood ready to carve, child gesturing toward the animals with a warm smile, saying they deserve the honor too`,
      `${S}, ${child_name} walking home along a dirt farm road as the sun breaks through parting clouds after the storm, golden light across wet fields, calm confident stride`,
    ],
  }

  const safeTheme = PROMPTS[theme] ? theme : 'jungle'
  return PROMPTS[safeTheme]
}

// ---------------------------------------------------------------------------
// Text highlighter
// ---------------------------------------------------------------------------
function highlight(text, name, accentColor) {
  return text.split(name).join(
    `<b class="hl" style="color:${accentColor}">${name}</b>`
  )
}

// ---------------------------------------------------------------------------
// generateHTML — immersive full-screen reader
// ---------------------------------------------------------------------------
function generateHTML(order, orderId) {
  const { child_name, gender, theme } = order
  const isMale    = gender === 'male' || gender === 'boy' || gender === 'ذكر'
  const he        = isMale ? 'هو' : 'هي'
  const safeTheme = THEMES[theme] ? theme : 'forest'
  const t         = THEMES[safeTheme]
  const storyPages= t.pages(child_name, he)
  const prompts   = getImagePrompts(safeTheme, child_name)
  const ac        = t.accentColor
  const acSafe    = ac === '#bef264' ? '#5a8a00' : ac
  const docTitle  = `${child_name} ${t.title}`

  // ------------------------------------------------------------------
  // Build slides array: [coverSlide, ...storySlides, backSlide]
  // ------------------------------------------------------------------

  // Image path helpers — images stored in Supabase Storage bucket "book-images"
  // Pattern: {SUPABASE_URL}/storage/v1/object/public/book-images/{orderId}/cover.jpg
  // All 17 images generated: cover + pages 1–16 (SVG fallback shown while loading or on error)
  const supaBase  = process.env.SUPABASE_URL
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/book-images`
    : null
  const imgBase   = (supaBase && orderId) ? `${supaBase}/${orderId}` : null
  const coverImg  = imgBase ? `${imgBase}/cover.jpg` : null
  const pageImg   = (n) => imgBase ? `${imgBase}/page-${n}.jpg` : null

  // Inline fallback SVG — shown when real image file is missing
  const fallbackSvg = (gradient, svg) =>
    `<div class="img-fallback" style="background:${gradient};width:100%;height:100%;position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${svg}</div>`

  // 0 — Cover
  const coverSlide = `
<div class="slide" data-idx="0">
  <div class="slide-img-wrap${coverImg ? ' loading' : ''}" style="background:${t.coverGradient}">
    ${coverImg ? `<img src="${coverImg}" alt="غلاف القصة" class="page-img" fetchpriority="high" decoding="async" onload="this.classList.add('loaded');this.parentElement.classList.remove('loading')" onerror="this.style.display='none';this.parentElement.classList.remove('loading')">` : ''}
    ${fallbackSvg(t.coverGradient, t.coverSvg)}
  </div>
  <div class="slide-cover-text" style="background:${t.coverGradient}">
    <div class="cv-badge">كِتابي · قصة شخصية</div>
    <div class="cv-name" style="color:${ac}">${child_name}</div>
    <div class="cv-title">${t.title}</div>
    <div class="cv-meta">${t.setting}</div>
    <div class="cv-tap">اسحب للأسفل ↓</div>
  </div>
</div>`

  // 1..16 — Story pages
  const storySlides = storyPages.map((text, i) => {
    const pageNum = i + 1
    const prompt  = (prompts[pageNum] || prompts[prompts.length - 1]).replace(/"/g, '&quot;')
    const imgSrc  = pageImg(pageNum)
    const lines   = text.split('\n').map(l => l.trim()).filter(Boolean)
    const htmlTxt = lines.map(l =>
      `<p>${highlight(l, child_name, acSafe)}</p>`
    ).join('')
    // pages 1-4 get fetchpriority=high (preloaded); rest are lazy-loaded
    const isEager = pageNum <= 4
    return `
<div class="slide" data-idx="${pageNum}" data-prompt="${prompt}">
  <div class="slide-img-wrap${imgSrc ? ' loading' : ''}" style="background:${t.coverGradient}">
    ${imgSrc ? `<img src="${imgSrc}" alt="صورة الصفحة ${pageNum}" class="page-img" ${isEager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onload="this.classList.add('loaded');this.parentElement.classList.remove('loading')" onerror="this.style.display='none';this.parentElement.classList.remove('loading')">` : ''}
    ${fallbackSvg(t.coverGradient, t.coverSvg)}
  </div>
  <div class="slide-text-panel" style="--ac:${acSafe}">
    <div class="text-pg-num">${pageNum} <span class="text-pg-of">/ ${storyPages.length}</span></div>
    <div class="text-body">${htmlTxt}</div>
  </div>
</div>`
  }).join('')

  // Last — Back cover
  const backSlide = `
<div class="slide" data-idx="${storyPages.length + 1}">
  <div class="slide-img-wrap">
    <div class="img-fallback" style="display:flex;background:${t.coverGradient}"></div>
  </div>
  <div class="slide-back-text" style="background:${t.coverGradient}">
    <div class="back-orn">◆</div>
    <div class="back-title">قصة <span style="color:${ac}">${child_name}</span></div>
    <div class="back-body">كُتبت هذه القصة لطفل واحد فقط في العالم.<br>بطلها <strong style="color:${ac}">${child_name}</strong> — واسمه في كل صفحة.</div>
    <div class="back-brand">كِتابي · kitabi.app</div>
  </div>
</div>`

  const TOTAL = storyPages.length + 2  // cover + pages + back

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<meta name="theme-color" content="#0a0a0a">
<title>${docTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
${[coverImg, pageImg(1), pageImg(2), pageImg(3), pageImg(4)]
  .filter(Boolean)
  .map(u => `<link rel="preload" as="image" href="${u}" fetchpriority="high">`)
  .join('\n')}
<style>
/* ── Reset ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  min-height:100vh;
  font-family:'Cairo',sans-serif;
  background:#0a0a0a;color:#fff;
  direction:rtl;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
}

/* ── Scroll progress bar (sticky top) ── */
#scroll-bar{
  position:fixed;top:0;left:0;right:0;
  height:3px;z-index:100;
  background:rgba(255,255,255,.1);
}
#scroll-fill{
  height:100%;width:0%;
  background:${acSafe};
  transition:width .12s linear;
}

/* ── Page counter (sticky) ── */
#pg-counter{
  position:fixed;top:10px;left:14px;
  font-size:10px;font-weight:700;letter-spacing:.06em;
  color:rgba(255,255,255,.35);
  z-index:100;pointer-events:none;
}

/* ── Book container ── */
#book{display:block}

/* ── Individual page card ── */
.slide{
  width:100%;height:100svh;
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;
  border-bottom:2px solid #111;
}

/* ── Image area ── */
.slide-img-wrap{
  flex:0 0 58%;
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}

/* ── Shimmer skeleton while real image loads ── */
.slide-img-wrap.loading::after{
  content:'';
  position:absolute;inset:0;z-index:3;pointer-events:none;
  background:linear-gradient(
    110deg,
    rgba(255,255,255,0)   30%,
    rgba(255,255,255,0.10) 50%,
    rgba(255,255,255,0)   70%
  );
  background-size:200% 100%;
  animation:shimmer 1.8s linear infinite;
}
@keyframes shimmer{
  0%  {background-position:200% 0}
  100%{background-position:-200% 0}
}

/* ── Real image: starts hidden, fades in on load ── */
.page-img{
  width:100%;height:100%;
  object-fit:cover;
  position:absolute;inset:0;z-index:1;
  opacity:0;
  transition:opacity .38s ease;
  will-change:opacity;
}
.page-img.loaded{opacity:1}

/* ── Cover slide ── */
.slide-cover-text{
  flex:1;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;
  padding:20px 24px 36px;
  color:#fff;
  position:relative;
}
.cv-badge{
  font-size:.62rem;font-weight:700;letter-spacing:.22em;
  opacity:.45;text-transform:uppercase;margin-bottom:10px;
}
.cv-name{
  font-size:clamp(2rem,8vw,3.2rem);font-weight:900;
  line-height:1;text-shadow:0 2px 20px rgba(0,0,0,.5);
  margin-bottom:6px;
}
.cv-title{
  font-size:clamp(.95rem,3.8vw,1.4rem);font-weight:700;
  opacity:.88;line-height:1.4;margin-bottom:12px;
}
.cv-meta{font-size:.72rem;font-weight:600;opacity:.4}
.cv-tap{
  position:absolute;bottom:16px;
  font-size:.8rem;font-weight:700;opacity:.4;
  animation:blink 2s ease-in-out infinite;
}
@keyframes blink{0%,100%{opacity:.25}50%{opacity:.6}}

/* ── Story text panel ── */
.slide-text-panel{
  flex:1;
  background:#fff;
  color:#1e1e1e;
  display:flex;flex-direction:column;
  overflow:hidden;
  padding:14px 20px 20px;
}
.text-pg-num{
  font-size:10px;font-weight:700;
  color:var(--ac);letter-spacing:.1em;
  margin-bottom:10px;flex-shrink:0;
}
.text-pg-of{color:#ccc;font-weight:600}
.text-body{
  flex:1;overflow-y:auto;
  font-size:clamp(.9rem,3.5vw,1.05rem);
  font-weight:600;line-height:2;
  text-align:right;
  scrollbar-width:none;
  padding-bottom:4px;
}
.text-body::-webkit-scrollbar{display:none}
.text-body p{margin-bottom:6px}
.text-body p:last-child{margin-bottom:0}
.hl{font-weight:900}

/* ── Back cover ── */
.slide-back-text{
  flex:1;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;padding:24px 24px 48px;
  color:#fff;
}
.back-orn{font-size:1.4rem;opacity:.4;margin-bottom:12px}
.back-title{font-size:clamp(1.5rem,6vw,2.2rem);font-weight:900;line-height:1.3;margin-bottom:14px}
.back-body{font-size:.9rem;font-weight:600;line-height:2;opacity:.75;max-width:280px;margin-bottom:20px}
.back-brand{font-size:.6rem;font-weight:700;letter-spacing:.2em;opacity:.25;text-transform:uppercase}

/* ── Entry animation ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.slide[data-idx="0"] .slide-cover-text{animation:fadeUp .6s ease both .1s}

/* ── Landscape: side-by-side ── */
@media (orientation:landscape) and (max-height:520px){
  .slide{flex-direction:row}
  .slide-img-wrap{flex:0 0 55%;height:100%}
  .slide-cover-text,.slide-text-panel,.slide-back-text{flex:1;height:100%}
}
</style>
</head>
<body>
<div id="scroll-bar"><div id="scroll-fill"></div></div>
<div id="pg-counter">١ / ${TOTAL}</div>
<div id="book">
  ${coverSlide}
  ${storySlides}
  ${backSlide}
</div>
<script>
(function(){
  'use strict';
  var fill  = document.getElementById('scroll-fill');
  var label = document.getElementById('pg-counter');
  var slides = document.querySelectorAll('.slide');
  var TOTAL  = slides.length;

  function toAr(n){ return n.toLocaleString('ar-EG') }

  function onScroll(){
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var maxScroll  = document.documentElement.scrollHeight - window.innerHeight;
    var pct = maxScroll > 0 ? scrollTop / maxScroll * 100 : 0;
    fill.style.width = pct + '%';

    // Which slide's centre is closest to mid-screen?
    var mid = window.innerHeight / 2;
    var cur = 0;
    for(var i = 0; i < slides.length; i++){
      if(slides[i].getBoundingClientRect().top <= mid) cur = i;
    }
    label.textContent = toAr(cur + 1) + ' / ' + toAr(TOTAL);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();
</script>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export { generateHTML }
