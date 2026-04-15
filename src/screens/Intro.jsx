/**
 * Screen 1 — Emotional Intro
 * Soft bridge between the hero landing and the personalization questions.
 */
export default function Intro({ onNext }) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
      dir="rtl"
      style={{ background: 'linear-gradient(160deg,#fdf8f3 0%,#f5ebe0 100%)' }}
    >
      {/* Icon */}
      <div className="fade-up mb-6 select-none" style={{ fontSize: 72 }}>✨</div>

      {/* Title */}
      <h1
        className="fade-up-1 font-black text-ink mb-5"
        style={{ fontSize: 'clamp(1.75rem,8vw,2.2rem)', lineHeight: 1.22, letterSpacing: '-0.01em' }}
      >
        خلينا نصنع قصة لطفلك
      </h1>

      {/* Subtitle */}
      <p
        className="fade-up-2 text-ink-mid font-semibold mb-12"
        style={{ fontSize: '1.12rem', lineHeight: 1.75, maxWidth: 270 }}
      >
        قصة يكون هو بطلها…
        <br />
        ويتذكرها طول حياته
      </p>

      {/* CTA */}
      <button
        onClick={onNext}
        className="fade-up-3 w-full max-w-xs text-white font-black rounded-2xl active:scale-[0.97] transition-transform duration-150"
        style={{
          fontSize:   '1.2rem',
          padding:    '20px 24px',
          background: 'linear-gradient(140deg,#EC7A44 0%,#D4643A 45%,#BE5530 100%)',
          boxShadow:  '0 8px 26px rgba(190,80,40,0.34)',
        }}
      >
        ابدأ
      </button>
    </div>
  )
}
