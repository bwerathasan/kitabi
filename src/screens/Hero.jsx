import { useState } from 'react'
import imgMain  from '../../images/1776002117490.png'
import imgTwo   from '../../images/1776001993129.png'
import imgThree from '../../images/1776001073500.png'

// ---------------------------------------------------------------------------
// HeroGallery — main image + 2 thumbnails, lives in the hero
// ---------------------------------------------------------------------------
const ALL_IMAGES = [
  { src: imgMain,  alt: 'آدم وعجائب البحار — هدية عيد ميلاد' },
  { src: imgTwo,   alt: 'طفل يقرأ قصته الشخصية' },
  { src: imgThree, alt: 'يوسف ومغامرة الغابة' },
]

function HeroGallery() {
  const [activeIdx, setActiveIdx] = useState(0)
  const thumbs = ALL_IMAGES.map((img, i) => ({ ...img, i })).filter(img => img.i !== activeIdx)

  return (
    <div className="px-5 pt-4 pb-6">
      {/* Main image */}
      <div
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 12px 44px rgba(42,42,42,0.20)',
          marginBottom: 10,
        }}
      >
        <img
          src={ALL_IMAGES[activeIdx].src}
          alt={ALL_IMAGES[activeIdx].alt}
          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>
      {/* Two thumbnails — always the 2 non-active images */}
      <div style={{ display: 'flex', gap: 10 }}>
        {thumbs.map(img => (
          <button
            key={img.i}
            onClick={() => setActiveIdx(img.i)}
            style={{
              flex: 1,
              borderRadius: 14,
              overflow: 'hidden',
              border: '2px solid rgba(200,180,150,0.25)',
              boxShadow: '0 3px 12px rgba(42,42,42,0.10)',
              padding: 0,
              background: 'none',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '16/10' }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
const REVIEWS = [
  { text: 'والله ما توقعت! ابني ظل طول اليوم يحكي عن قصته ومش مصدق إنه البطل',         stars: 5 },
  { text: 'جبتها هدية لابن أختي وانبسط بطريقة مش طبيعية، طلب يقراها مرتين',            stars: 5 },
  { text: 'حسيت الولد فعلاً صار بطل القصة، ما قدر يحط الكتاب من إيده',                 stars: 5 },
  { text: 'صراحة؟ يسوى كل شيكل دفعته، وبوصي فيه كل أم',                                stars: 5 },
  { text: 'بنتي فتحت الكتاب وقالت ماما اسمي موجود في كل مكان، وبكت من الفرحة',         stars: 5 },
  { text: 'أجمل هدية جبتها لطفلي من زمان، حاسة إنه صار بطل فعلاً مش بس في القصة',     stars: 5 },
  { text: 'ابني ما صدق إن في كتاب مكتوب له هو بالاسم، قال هاي قصتي أنا مش قصة ثانية', stars: 5 },
  { text: 'الفكرة بسيطة بس أثرها كبير، شفت ثقة ابني بنفسه تزيد بعد ما قرأها',          stars: 5 },
]

function ReviewCard({ text, stars }) {
  return (
    <div
      style={{
        background:   '#FFFFFF',
        border:       '1px solid rgba(200,180,150,0.28)',
        borderRadius: 16,
        boxShadow:    '0 4px 18px rgba(42,42,42,0.07)',
        padding:      '18px 20px',
        textAlign:    'right',
        direction:    'rtl',
        flex:         '1 1 260px',
      }}
    >
      <div style={{ color: '#F5A623', fontSize: 13, marginBottom: 8, letterSpacing: 1 }}>
        {'★'.repeat(stars)}
      </div>
      <p style={{ fontSize: '0.97rem', fontWeight: 600, lineHeight: 1.75, color: '#2A2A2A', margin: 0 }}>
        "{text}"
      </p>
    </div>
  )
}

function Reviews() {
  return (
    <div className="px-5 pb-2">
      <p className="text-center text-[11px] font-bold text-ink-light tracking-[0.18em] uppercase mb-4">
        ماذا قالوا عن كتابي
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BenefitPill
// ---------------------------------------------------------------------------
function BenefitPill({ icon, text }) {
  return (
    <div
      className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2"
      style={{ boxShadow: '0 2px 10px rgba(42,42,42,0.07)' }}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="text-[12px] font-bold text-ink-mid whitespace-nowrap">{text}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StoryPagePreview — looks and feels like a printed page
// ---------------------------------------------------------------------------
function StoryPagePreview() {
  const nameStyle = {
    color:        '#D4643A',
    fontWeight:   900,
    background:   'rgba(212,100,58,0.09)',
    border:       '1px solid rgba(212,100,58,0.18)',
    borderRadius: 6,
    padding:      '1px 7px',
  }

  return (
    <div className="px-5 pb-2">
      <p className="text-center text-[11px] font-bold text-ink-light tracking-[0.18em] uppercase mb-5">
        مثال حقيقي — هكذا تبدو قصتك
      </p>

      <div
        style={{
          background:   '#FDFBF7',
          border:       '1px solid rgba(200,180,150,0.38)',
          borderRadius: 14,
          boxShadow:    'inset 0 2px 10px rgba(160,120,60,0.06), 0 5px 28px rgba(160,120,60,0.10)',
          overflow:     'hidden',
        }}
      >
        <div style={{ height: 5, background: 'linear-gradient(90deg, #D4643A 0%, #C9963A 100%)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px 0' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#C9963A', letterSpacing: '0.1em' }}>كتابك</span>
          <span style={{ fontSize: 11, color: '#ABABAB' }}>صفحة ٣</span>
        </div>

        <div style={{ height: 1, background: 'rgba(200,180,150,0.28)', margin: '14px 28px 0' }} />

        <div style={{ padding: '22px 28px 26px', textAlign: 'right', direction: 'rtl' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 2.05, color: '#2A2A2A', marginBottom: 16 }}>
            كان <span style={nameStyle}>يوسف</span> ينظر إلى النجوم ليلاً،
            <br />
            يشعر أن مغامرة كبيرة تنتظره.
          </p>

          <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 2.05, color: '#2A2A2A', marginBottom: 16 }}>
            فجأةً، رأى <span style={nameStyle}>يوسف</span> ضوءاً يرقص بين الأشجار —
            <br />
            وعرف: هذا هو الوقت.
          </p>

          <p style={{ fontSize: '0.96rem', fontWeight: 500, lineHeight: 1.95, color: '#6B6B6B' }}>
            أخذ نفساً عميقاً، وخطا نحو الأدغال...
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(200,180,150,0.28)', margin: '0 28px' }} />
        <div style={{ textAlign: 'center', padding: '11px 0', color: 'rgba(212,100,58,0.25)', fontSize: 13 }}>✦</div>
      </div>

      <p className="text-center text-[13px] font-semibold text-ink-mid mt-4 leading-snug">
        اسم طفلك — في كل صفحة، في كل جملة، في كل لحظة.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero — main export
// ---------------------------------------------------------------------------
export default function Hero({ onNext }) {
  return (
    <div className="flex flex-col bg-hero-gradient" dir="rtl">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-start px-5 pt-5 pb-2">
        <span className="text-primary font-black text-xl tracking-tight">كِتابي</span>
      </div>

      {/* ── Social proof ────────────────────────────────────────── */}
      <div className="fade-up flex justify-center px-5 pt-3 pb-1">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border:     '1.5px solid rgba(212,100,58,0.16)',
            boxShadow:  '0 2px 12px rgba(42,42,42,0.06)',
          }}
        >
          <span className="text-sm leading-none">🌟</span>
          <span className="text-[13px] font-bold text-ink-mid">
            أكثر من <span className="text-primary font-black">10,000 طفل</span> أصبحوا أبطال قصصهم
          </span>
        </div>
      </div>

      {/* ── Real hero image + thumbnails ────────────────────────── */}
      <div className="scale-up">
        <HeroGallery />
      </div>

      {/* ── Headline ────────────────────────────────────────────── */}
      <div className="px-5 text-center mb-3.5">
        <h1
          className="fade-up-1 font-black text-ink"
          style={{ fontSize: 'clamp(1.75rem, 8vw, 2.2rem)', lineHeight: 1.22, letterSpacing: '-0.01em' }}
        >
          خلّي طفلك يصير بطل القصة
          <br />
          <span className="text-primary">
            ويشوف اسمه في كل صفحة
          </span>
        </h1>
      </div>

      {/* ── Subtext ─────────────────────────────────────────────── */}
      <div className="fade-up-2 px-5 text-center mb-5">
        <p className="text-ink-mid font-semibold mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: 275 }}>
          قصة مكتوبة باسمه —{' '}
          <span className="text-ink font-bold">هو البطل، هي مغامرته هو.</span>
        </p>
      </div>

      {/* ── Benefit pills ───────────────────────────────────────── */}
      <div className="fade-up-3 flex flex-wrap justify-center gap-2 px-5 mb-5">
        <BenefitPill icon="🌟" text="اسمه في كل صفحة"   />
        <BenefitPill icon="⚡" text="جاهز بـ 3–5 دقائق"    />
        <BenefitPill icon="📖" text="بالعربية"          />
      </div>

      {/* ── Emotional block ─────────────────────────────────────── */}
      <div className="fade-up-4 px-5 mb-6">
        <div
          className="w-full rounded-2xl px-5 py-4 text-center"
          style={{
            background: 'linear-gradient(140deg, #FFF7F0 0%, #FFF0E2 100%)',
            border:     '1.5px solid rgba(212,100,58,0.14)',
          }}
        >
          <p className="font-bold text-ink leading-snug" style={{ fontSize: '1.06rem' }}>
            تخيّل لحظة فتحه الكتاب —{' '}
            <span className="text-primary">ويرى اسمه بطلاً في كل صفحة</span>
          </p>
        </div>
      </div>

      {/* ── Price tag ───────────────────────────────────────────── */}
      <div className="fade-up-5 px-5 mb-3">
        <div
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-3.5"
          style={{
            background: 'linear-gradient(135deg,#fff8f2,#fff2e6)',
            border:     '2px solid rgba(201,125,58,0.28)',
          }}
        >
          <span
            className="font-black text-primary"
            style={{ fontSize: '1.65rem', letterSpacing: '-0.02em', lineHeight: 1 }}
          >
            199₪
          </span>
          <span className="w-px h-6 bg-warm-200" />
          <span className="text-base font-bold text-ink-mid">شامل التوصيل</span>
        </div>
      </div>

      {/* ── Primary CTA ─────────────────────────────────────────── */}
      <div className="px-5 pb-3 fade-up-5">
        <button
          onClick={onNext}
          className="w-full text-white font-black rounded-2xl active:scale-[0.97] transition-transform duration-150"
          style={{
            fontSize:      '1.12rem',
            lineHeight:    1.32,
            padding:       '20px 24px',
            background:    'linear-gradient(140deg, #EC7A44 0%, #D4643A 45%, #BE5530 100%)',
            boxShadow:     '0 8px 26px rgba(190,80,40,0.34)',
            letterSpacing: '0.005em',
          }}
        >
          أنشئ قصة لطفلك الآن — وشاهد اسمه بطلًا خلال 3 إلى 5 دقائق
        </button>

        <div className="flex items-center justify-center gap-3.5 mt-3.5">
          <span className="text-[12px] font-semibold text-ink-light">جاهز فورًا</span>
          <span className="w-px h-3 bg-ink-faint" />
          <span className="text-[12px] font-semibold text-ink-light">التجربة سهلة</span>
          <span className="w-px h-3 bg-ink-faint" />
          <span className="text-[12px] font-semibold text-ink-light">بدون تعقيد</span>
        </div>
      </div>

      {/* ─── Below the fold ──────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 py-6 opacity-35">
        <span className="text-[11px] text-ink-light font-semibold">شاهد مثالاً حقيقياً</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="animate-bounce">
          <path d="M1 1l7 7 7-7" stroke="#ABABAB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Story page preview ──────────────────────────────────── */}
      <StoryPagePreview />

      {/* ── Reviews ─────────────────────────────────────────────── */}
      <div className="pt-8 pb-2">
        <Reviews />
      </div>

      {/* ── Closing block ───────────────────────────────────────── */}
      <div className="px-5 pt-9 pb-3 text-center">
        <p
          className="font-black text-ink leading-tight"
          style={{ fontSize: 'clamp(1.5rem, 7vw, 1.85rem)', letterSpacing: '-0.01em' }}
        >
          قصة تبقى في ذاكرته
          <br />
          <span className="text-primary">للأبد.</span>
        </p>
        <p
          className="text-ink-mid font-medium leading-relaxed mx-auto mt-3.5"
          style={{ fontSize: '0.98rem', maxWidth: 250 }}
        >
          اسمه في كل صفحة.
          <br />
          مغامرته هو. قصة لن يمحوها الزمن.
        </p>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-14">
        <button
          onClick={onNext}
          className="w-full text-white font-black rounded-2xl active:scale-[0.97] transition-transform duration-150"
          style={{
            fontSize:   '1.12rem',
            padding:    '19px 24px',
            background: 'linear-gradient(140deg, #EC7A44 0%, #D4643A 45%, #BE5530 100%)',
            boxShadow:  '0 8px 26px rgba(190,80,40,0.30)',
          }}
        >
          اجعله بطل قصته الآن ✨
        </button>
        <p className="text-center text-[12px] font-semibold text-ink-light mt-3">
          3–5 دقائق فقط · بدون تسجيل · الكتاب لك فوراً
        </p>
      </div>

    </div>
  )
}
