import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'
import { isValidName } from '../utils/validation.js'

/**
 * Screen 2 — Child Name
 * One question. One text input. One action.
 */
export default function ChildName({ form, onUpdate, onNext, onBack }) {
  const [touched, setTouched] = useState(false)

  const value   = form.childName
  const isValid = isValidName(value)
  const showErr = touched && !isValid

  function handleSubmit() {
    setTouched(true)
    if (isValid) onNext()
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <StepLayout step={1} totalSteps={6} onBack={onBack}>

      {/* Question */}
      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        ما اسم طفلك؟
      </h1>
      <p className="fade-up-1 text-ink-mid text-base mb-8">
        سيظهر اسمه في كل صفحة من القصة.
      </p>

      {/* Input */}
      <div className="fade-up-2">
        <input
          type="text"
          value={value}
          onChange={e => {
            setTouched(false)
            onUpdate('childName', e.target.value)
          }}
          onKeyDown={handleKey}
          placeholder="اكتب الاسم هنا..."
          autoFocus
          autoComplete="off"
          className={`
            w-full px-5 py-4
            bg-white rounded-2xl
            border-2 outline-none
            text-xl font-bold text-ink text-right
            placeholder:text-ink-light placeholder:font-normal
            transition-colors duration-200
            ${showErr
              ? 'border-red-400 focus:border-red-400'
              : 'border-warm-200 focus:border-primary'
            }
          `}
        />
        {showErr && (
          <p className="mt-2 text-sm text-red-500 text-right">
            يرجى كتابة اسم صحيح (حرفان على الأقل)
          </p>
        )}

        {/* Dynamic name preview */}
        {value.trim().length >= 2 && (
          <div className="mt-4 px-4 py-3 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg,#fff8f2,#fff2e6)', border: '1.5px solid rgba(201,125,58,0.22)' }}>
            <p className="text-sm font-bold text-ink-mid">
              سيظهر اسم{' '}
              <span className="text-primary font-black">{value.trim()}</span>
              {' '}في كل صفحة من قصته ✨
            </p>
          </div>
        )}
      </div>

      {/* Spacer — push button to bottom */}
      <div className="flex-1" />

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="
          fade-up-3
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
