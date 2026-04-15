import { useState } from 'react'
import StepLayout from '../components/StepLayout.jsx'

/**
 * Screen 7 — Parent Info
 * parent_name, phone, city, address
 * Required for print delivery and admin notification.
 */
export default function ParentInfo({ form, onUpdate, onNext, onBack }) {
  const [touched, setTouched] = useState({})

  function touch(field) {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const fields = {
    parentName: { label: 'اسم ولي الأمر', placeholder: 'الاسم الكامل', type: 'text',  required: true },
    phone:      { label: 'رقم الهاتف',    placeholder: '05xxxxxxxx',    type: 'tel',   required: true },
    city:       { label: 'المدينة',        placeholder: 'مثال: الرياض',  type: 'text',  required: true },
    address:    { label: 'العنوان',        placeholder: 'الحي، الشارع، رقم المبنى', type: 'text', required: false },
  }

  const allValid =
    form.parentName?.trim().length >= 2 &&
    form.phone?.trim().length >= 9 &&
    form.city?.trim().length >= 2

  function handleSubmit() {
    setTouched({ parentName: true, phone: true, city: true, address: true })
    if (allValid) onNext()
  }

  return (
    <StepLayout step={7} totalSteps={8} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        بيانات التوصيل
      </h1>
      <p className="fade-up-1 text-ink-mid text-sm mb-6 leading-relaxed">
        نحتاج هذه البيانات لإرسال الكتاب المطبوع إليك.
      </p>

      <div className="fade-up-2 flex flex-col gap-4">
        {Object.entries(fields).map(([key, meta]) => {
          const value    = form[key] || ''
          const isTouched = touched[key]
          const isEmpty  = meta.required && value.trim().length < 2
          const showErr  = isTouched && isEmpty
          return (
            <div key={key}>
              <label className="block text-xs font-bold text-ink-light uppercase tracking-wider mb-1.5">
                {meta.label} {meta.required && <span className="text-red-400">*</span>}
              </label>
              <input
                type={meta.type}
                value={value}
                placeholder={meta.placeholder}
                onChange={e => {
                  setTouched(prev => ({ ...prev, [key]: false }))
                  onUpdate(key, e.target.value)
                }}
                onBlur={() => touch(key)}
                className={`
                  w-full px-4 py-3.5
                  bg-white rounded-xl
                  border-2 outline-none
                  text-base font-semibold text-ink text-right
                  placeholder:text-ink-light placeholder:font-normal
                  transition-colors duration-200
                  ${showErr
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-warm-200 focus:border-primary'
                  }
                `}
              />
              {showErr && (
                <p className="mt-1 text-xs text-red-500 text-right">هذا الحقل مطلوب</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex-1" />

      <button
        onClick={handleSubmit}
        disabled={!form.parentName?.trim() && !form.phone?.trim()}
        className="
          fade-up-3
          w-full py-4 mt-6
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
