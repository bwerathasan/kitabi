import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { confirmOrder } from '../api/orders.js'

const THEME_LABELS = {
  jungle: '🌴 الأدغال',
  space:  '🚀 الفضاء',
  ocean:  '🌊 البحر',
  forest: '🌲 الغابة',
  desert: '🏜️ الصحراء',
  farm:   '🌾 المزرعة',
}

/**
 * Screen 12 — Final Confirmation
 * Shows order summary + price. On confirm: calls /api/orders/:id/confirm
 * which saves shipping info and sends both emails.
 */
export default function Confirm({ form, orderId, onBack, onRestart }) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState(null)

  const name = form.childName || 'طفلك'

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await confirmOrder(orderId, {
        parentName: form.parentName,
        phone:      form.phone,
        city:       form.city,
        address:    form.address,
      })
      setDone(true)
    } catch (err) {
      setError(err.message || 'حدث خطأ، يرجى المحاولة مجدداً')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center"
        dir="rtl"
        style={{ background: 'linear-gradient(160deg,#fdf8f3 0%,#f5ebe0 100%)' }}
      >
        <div className="fade-up mb-6 select-none" style={{ fontSize: 80 }}>✅</div>

        <h1
          className="fade-up-1 font-black text-ink mb-3"
          style={{ fontSize: 'clamp(1.6rem,7vw,2rem)' }}
        >
          تم تأكيد طلبك!
        </h1>

        <p
          className="fade-up-2 text-ink-mid mb-8 leading-relaxed"
          style={{ fontSize: '1rem', maxWidth: 280 }}
        >
          سيصلك كتاب <strong className="text-ink">{name}</strong> المطبوع خلال 48–72 ساعة.
          <br />
          ستتلقى رسالة تأكيد على بريدك الإلكتروني.
        </p>

        {/* Summary box */}
        <div
          className="fade-up-3 w-full mb-8"
          style={{
            maxWidth: 340,
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #ede8e0',
            padding: '18px 22px',
          }}
        >
          {[
            { label: 'الكتاب',      value: `قصة ${name}` },
            { label: 'التوصيل إلى', value: form.city || '—' },
            { label: 'السعر',       value: '₪199 شامل التوصيل' },
            { label: 'الدفع',       value: 'عند الاستلام' },
          ].map(row => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '9px 0',
                borderBottom: '1px solid #f5f0ea',
              }}
            >
              <span style={{ fontSize: 13, color: '#a09080', fontWeight: 600 }}>{row.label}</span>
              <span style={{ fontSize: 13, color: '#2d1a08', fontWeight: 700 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="fade-up-4 active:scale-[0.97] transition-transform duration-150"
          style={{
            width: '100%',
            maxWidth: 340,
            padding: '14px 24px',
            background: 'transparent',
            border: '2px solid rgba(201,125,58,.3)',
            borderRadius: 14,
            color: '#c97d3a',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          اصنع قصة لطفل آخر ✨
        </button>
      </div>
    )
  }

  // ── Confirmation form ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-dvh flex flex-col"
      dir="rtl"
      style={{ background: 'linear-gradient(160deg,#fdf8f3 0%,#f5ebe0 100%)' }}
    >

      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-2">
        <BackButton onClick={onBack} />
      </div>

      <div className="flex-1 flex flex-col px-5 pb-10">

        <h1 className="fade-up font-black text-ink mb-1 mt-3" style={{ fontSize: 'clamp(1.4rem,6vw,1.8rem)' }}>
          راجع طلبك قبل التأكيد
        </h1>
        <p className="fade-up-1 text-ink-mid text-sm mb-6">
          بعد التأكيد سنبدأ فوراً في الطباعة والتوصيل.
        </p>

        {/* Order details card */}
        <div
          className="fade-up-2 mb-5"
          style={{
            background: '#fff',
            borderRadius: 18,
            border: '1.5px solid rgba(201,125,58,.15)',
            overflow: 'hidden',
          }}
        >
          {/* Section: القصة */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f0ea' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#a09080', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              القصة
            </p>
            <Row label="اسم الطفل"  value={name} />
            <Row label="عالم المغامرة" value={THEME_LABELS[form.theme] || form.theme || '—'} />
            <Row label="البريد الإلكتروني" value={form.email} />
          </div>

          {/* Section: التوصيل */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f0ea' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#a09080', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              التوصيل
            </p>
            <Row label="الاسم"    value={form.parentName || '—'} />
            <Row label="الجوال"   value={form.phone      || '—'} />
            <Row label="المدينة"  value={form.city       || '—'} />
            {form.address && <Row label="العنوان"  value={form.address} />}
          </div>

          {/* Price */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg,#c97d3a,#e8a45a)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
              السعر · شامل التوصيل · الدفع عند الاستلام
            </span>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              ₪199
            </span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="flex-1" />

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="fade-up-3 w-full active:scale-[0.97] transition-transform duration-150"
          style={{
            padding: '20px 24px',
            background: loading
              ? 'rgba(190,85,48,0.5)'
              : 'linear-gradient(140deg,#EC7A44 0%,#D4643A 45%,#BE5530 100%)',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(190,80,40,0.32)',
            border: 'none',
            borderRadius: 16,
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '1.12rem',
            fontWeight: 900,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
        </button>

        <p className="text-center text-xs text-ink-light mt-3 font-semibold">
          الدفع عند الاستلام · بدون بطاقة
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: '#a09080', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#2d1a08', fontWeight: 700, textAlign: 'left', maxWidth: '60%', wordBreak: 'break-word' }}>
        {value}
      </span>
    </div>
  )
}
