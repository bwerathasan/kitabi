import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'
import { isValidEmail } from '../utils/validation.js'

/**
 * Screen 7 — Email
 * "وين نرسل لك القصة بعد ما تجهز؟"
 */
export default function Email({ form, onUpdate, onNext, onBack }) {
  const [touched, setTouched] = useState(false)

  const value   = form.email
  const isValid = isValidEmail(value)
  const showErr = touched && !isValid

  function handleSubmit() {
    setTouched(true)
    if (isValid) onNext()
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <StepLayout step={6} totalSteps={6} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        وين نرسل لك القصة؟
      </h1>
      <p className="fade-up-1 text-ink-mid text-base mb-8">
        بعد ما تجهز القصة نرسل لك رسالة تأكيد.
      </p>

      <div className="fade-up-2">
        <input
          type="email"
          inputMode="email"
          value={value}
          onChange={e => {
            setTouched(false)
            onUpdate('email', e.target.value)
          }}
          onKeyDown={handleKey}
          placeholder="example@email.com"
          autoComplete="email"
          className={`
            w-full px-5 py-4
            bg-white rounded-2xl border-2 outline-none
            text-xl font-semibold text-ink
            placeholder:text-ink-light placeholder:font-normal placeholder:text-base
            transition-colors duration-200
            ${showErr
              ? 'border-red-400 focus:border-red-400'
              : 'border-warm-200 focus:border-primary'
            }
          `}
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
        {showErr && (
          <p className="mt-2 text-sm text-red-500 text-right">
            يرجى إدخال بريد إلكتروني صحيح
          </p>
        )}
      </div>

      {/* Privacy note */}
      <div className="fade-up-3 mt-5 flex items-start gap-2">
        <span className="text-base mt-0.5">🔒</span>
        <p className="text-sm text-ink-light leading-snug">
          بريدك محفوظ عندنا ولن يُشارك مع أي أحد.
        </p>
      </div>

      <div className="flex-1" />

      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="
          fade-up-4
          w-full py-4
          bg-primary text-white
          text-xl font-black rounded-2xl
          shadow-md shadow-primary/20
          disabled:opacity-40 disabled:shadow-none
          active:scale-[0.98] transition-all duration-150
        "
      >
        متابعة ←
      </button>

    </StepLayout>
  )
}
