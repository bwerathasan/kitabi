import BackButton from '../components/BackButton.jsx'

const THEME_LABELS = {
  jungle: '🌴 الأدغال',
  space:  '🚀 الفضاء',
  ocean:  '🌊 البحر',
  forest: '🌲 الغابة',
  desert: '🏜️ الصحراء',
  farm:   '🌾 المزرعة',
}

/**
 * Screen 8 — Review
 * Summary of personalization: name, theme, email.
 * Button advances to generation.
 */
export default function Review({ form, onNext, onBack, goTo, steps }) {
  const name = form.childName || '—'

  const rows = [
    {
      label:  'اسم الطفل',
      value:  name,
      onEdit: () => goTo(steps.NAME),
    },
    {
      label:  'عالم المغامرة',
      value:  THEME_LABELS[form.theme] || form.theme || '—',
      onEdit: () => goTo(steps.THEME),
    },
    {
      label:  'البريد الإلكتروني',
      value:  form.email || '—',
      onEdit: () => goTo(steps.EMAIL),
    },
  ]

  return (
    <div
      className="min-h-dvh flex flex-col"
      dir="rtl"
      style={{ background: 'linear-gradient(160deg,#fdf8f3 0%,#f5ebe0 100%)' }}
    >

      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <BackButton onClick={onBack} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5">

        {/* Emotional headline */}
        <div className="mb-7">
          <div className="text-4xl mb-3 select-none">🎉</div>
          <h1 className="fade-up text-2xl font-black text-ink mb-1">
            جاهز نبدأ قصة {name}؟
          </h1>
          <p className="fade-up-1 text-ink-mid text-base">
            تحقق من التفاصيل ثم ابدأ الإنشاء.
          </p>
        </div>

        {/* Summary card */}
        <div className="fade-up-2 bg-white rounded-2xl shadow-sm overflow-hidden mb-6"
          style={{ border: '1.5px solid rgba(201,125,58,0.15)' }}>
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`
                flex items-center justify-between px-5 py-4
                ${i < rows.length - 1 ? 'border-b border-warm-100' : ''}
              `}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-light font-semibold uppercase tracking-wider mb-0.5">
                  {row.label}
                </p>
                <p className="text-base font-bold text-ink truncate">
                  {row.value}
                </p>
              </div>
              <button
                onClick={row.onEdit}
                className="mr-4 text-primary font-bold text-sm active:opacity-60 flex-shrink-0"
              >
                تعديل
              </button>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={onNext}
          className="
            fade-up-3 w-full py-5 mb-8
            text-white text-xl font-black rounded-2xl
            shadow-lg active:scale-[0.98] transition-all duration-150
          "
          style={{
            background: 'linear-gradient(140deg,#EC7A44 0%,#D4643A 45%,#BE5530 100%)',
            boxShadow:  '0 8px 26px rgba(190,80,40,0.34)',
          }}
        >
          ابدأ إنشاء القصة 🎉
        </button>

      </div>
    </div>
  )
}
