import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'

/**
 * Screen 4 — Gender
 * Two large cards side-by-side. Tap → auto-advance.
 */
export default function Gender({ form, onUpdate, onNext, onBack }) {
  const [pending, setPending] = useState(null)

  function select(value) {
    if (pending) return
    setPending(value)
    onUpdate('gender', value)
    setTimeout(onNext, 280)
  }

  const name = form.childName || 'طفلك'

  const options = [
    { value: 'female', icon: '👧', label: 'بنت' },
    { value: 'male',   icon: '👦', label: 'ولد' },
  ]

  return (
    <StepLayout step={3} totalSteps={6} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        {name} بنت أم ولد؟
      </h1>
      <p className="fade-up-1 text-ink-mid text-base mb-8">
        تُكتب القصة بأسلوب يناسبه تماماً.
      </p>

      {/* Two-column grid for 2 options */}
      <div className="fade-up-2 grid grid-cols-2 gap-4">
        {options.map(opt => {
          const selected = pending === opt.value || form.gender === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`
                flex flex-col items-center justify-center gap-3
                py-8 rounded-2xl border-2
                transition-all duration-200 active:scale-95
                ${selected
                  ? 'border-primary bg-primary-light shadow-md shadow-primary/10'
                  : 'border-transparent bg-white shadow-sm'
                }
              `}
            >
              <span className="text-6xl leading-none select-none">{opt.icon}</span>
              <span className={`text-xl font-black ${selected ? 'text-primary-dark' : 'text-ink'}`}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

    </StepLayout>
  )
}
