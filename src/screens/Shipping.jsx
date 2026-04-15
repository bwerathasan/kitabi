import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'

/**
 * Screen 11 — Shipping Info
 * Shown ONLY after the user clicks "اطلب النسخة المطبوعة الآن" on the Result screen.
 * Collects parent_name, phone, city, address for delivery.
 */
export default function Shipping({ form, onUpdate, onNext, onBack }) {
  const [touched, setTouched] = useState({})

  const name = form.childName || 'طفلك'

  const fields = [
    { key: 'parentName', label: 'اسمك (ولي الأمر)', placeholder: 'الاسم الكامل',           type: 'text', required: true  },
    { key: 'phone',      label: 'رقم الجوال',        placeholder: '05xxxxxxxx',              type: 'tel',  required: true  },
    { key: 'city',       label: 'المدينة',            placeholder: 'مثال: الرياض',           type: 'text', required: true  },
    { key: 'address',    label: 'العنوان',            placeholder: 'الحي، الشارع، رقم المبنى', type: 'text', required: false },
  ]

  const allValid =
    (form.parentName || '').trim().length >= 2 &&
    (form.phone      || '').trim().length >= 9 &&
    (form.city       || '').trim().length >= 2

  function handleSubmit() {
    setTouched({ parentName: true, phone: true, city: true, address: true })
    if (allValid) onNext()
  }

  return (
    <div className="min-h-dvh flex flex-col" dir="rtl">

      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <BackButton onClick={onBack} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pb-8">

        {/* Emotional header */}
        <div className="mb-7">
          <div className="text-4xl mb-3 select-none">📦</div>
          <h1 className="fade-up text-2xl font-black text-ink mb-1">
            وين نوصلك كتاب {name}؟
          </h1>
          <p className="fade-up-1 text-ink-mid text-sm leading-relaxed">
            يصل إليك خلال 48–72 ساعة. الدفع عند الاستلام.
          </p>
        </div>

        {/* Fields */}
        <div className="fade-up-2 flex flex-col gap-4">
          {fields.map(({ key, label, placeholder, type, required }) => {
            const value     = form[key] || ''
            const isTouched = touched[key]
            const isEmpty   = required && value.trim().length < (key === 'phone' ? 9 : 2)
            const showErr   = isTouched && isEmpty
            return (
              <div key={key}>
                <label className="block text-xs font-bold text-ink-light uppercase tracking-wider mb-1.5">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={type}
                  value={value}
                  placeholder={placeholder}
                  onChange={e => {
                    setTouched(prev => ({ ...prev, [key]: false }))
                    onUpdate(key, e.target.value)
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, [key]: true }))}
                  className={`
                    w-full px-4 py-3.5
                    bg-white rounded-xl border-2 outline-none
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
          className="
            fade-up-3 w-full py-4 mt-6
            bg-primary text-white
            text-xl font-black rounded-2xl
            shadow-md shadow-primary/20
            active:scale-[0.98] transition-all duration-150
          "
        >
          راجع الطلب ←
        </button>

      </div>
    </div>
  )
}
