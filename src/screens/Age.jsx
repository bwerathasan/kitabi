import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'
import OptionCard  from '../components/OptionCard.jsx'

const AGE_OPTIONS = [
  {
    value:    '2-4',
    icon:     '🧸',
    label:    '٢–٤ سنوات',
    sublabel: 'قصص قصيرة وبسيطة',
  },
  {
    value:    '5-7',
    icon:     '🎒',
    label:    '٥–٧ سنوات',
    sublabel: 'مغامرات ممتعة ومشوّقة',
  },
  {
    value:    '8-10',
    icon:     '🌟',
    label:    '٨–١٠ سنوات',
    sublabel: 'قصص أعمق وأكثر تفصيلاً',
  },
]

/**
 * Screen 3 — Age
 * Tap a card → auto-advance after brief highlight.
 */
export default function Age({ form, onUpdate, onNext, onBack }) {
  const [pending, setPending] = useState(null)

  function select(value) {
    if (pending) return          // prevent double-tap
    setPending(value)
    onUpdate('ageGroup', value)
    setTimeout(onNext, 280)      // visual feedback before advancing
  }

  const name = form.childName || 'طفلك'

  return (
    <StepLayout step={2} totalSteps={6} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        كم عمر {name}؟
      </h1>
      <p className="fade-up-1 text-ink-mid text-base mb-7">
        نختار مستوى الكلمات المناسب له.
      </p>

      <div className="fade-up-2 flex flex-col gap-3">
        {AGE_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            sublabel={opt.sublabel}
            selected={pending === opt.value || form.ageGroup === opt.value}
            onClick={() => select(opt.value)}
          />
        ))}
      </div>

    </StepLayout>
  )
}
