import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'
import OptionCard  from '../components/OptionCard.jsx'

// Values match backend theme keys exactly
const THEMES = [
  { value: 'jungle', icon: '🌴', label: 'الأدغال',   sublabel: 'حيوانات وأشجار ومغامرات' },
  { value: 'space',  icon: '🚀', label: 'الفضاء',    sublabel: 'نجوم وكواكب ورحلات كونية' },
  { value: 'ocean',  icon: '🌊', label: 'البحر',     sublabel: 'أسماك وشعاب مرجانية وأسرار' },
  { value: 'forest', icon: '🌲', label: 'الغابة',    sublabel: 'أشجار ضخمة وحيوانات ودية' },
  { value: 'desert', icon: '🏜️', label: 'الصحراء',  sublabel: 'رمال وواحات وكنوز مخفية' },
  { value: 'farm',   icon: '🌾', label: 'المزرعة',   sublabel: 'حيوانات المزرعة والطبيعة' },
]

/**
 * Screen 5 — Theme
 * Tap a card → auto-advance.
 */
export default function Theme({ form, onUpdate, onNext, onBack }) {
  const [pending, setPending] = useState(null)

  function select(value) {
    if (pending) return
    setPending(value)
    onUpdate('theme', value)
    setTimeout(onNext, 280)
  }

  const name = form.childName || 'طفلك'

  return (
    <StepLayout step={5} totalSteps={6} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        ما أكثر شيء يحبه {name}؟
      </h1>
      <p className="fade-up-1 text-ink-mid text-base mb-7">
        اختر عالم مغامرته.
      </p>

      <div className="fade-up-2 flex flex-col gap-3">
        {THEMES.map(t => (
          <OptionCard
            key={t.value}
            icon={t.icon}
            label={t.label}
            sublabel={t.sublabel}
            selected={pending === t.value || form.theme === t.value}
            onClick={() => select(t.value)}
          />
        ))}
      </div>

    </StepLayout>
  )
}
