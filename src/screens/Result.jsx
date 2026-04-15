import { useState } from 'react'

/**
 * Screen 10 — Preview + Printed Book Offer
 *
 * Shows generated cover + 2 sample pages, then pushes the
 * user toward ordering the physical printed book.
 *
 * Does NOT expose pdf_url to the user at any point.
 * Clicking the CTA advances to Shipping (via onOrder callback).
 */

const BENEFITS = [
  'كتاب مطبوع فاخر',
  'قصة مخصصة لطفلك',
  'الدفع عند الاستلام',
  'يصل خلال 48–72 ساعة',
]

// ── Image with graceful fallback ──────────────────────────────────────────
function BookImage({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: 'linear-gradient(135deg,#e8d5c0,#d4956a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 40, opacity: 0.5 }}>📖</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      style={{ ...style, objectFit: 'cover', display: 'block' }}
    />
  )
}

export default function Result({ form, orderResult, onOrder, onRestart }) {
  const name     = form.childName || 'طفلك'
  const coverUrl = orderResult?.images?.cover          || null
  const page1Url = orderResult?.images?.pages?.[0]    || null
  const page2Url = orderResult?.images?.pages?.[1]    || null

  return (
    <div
      className="flex flex-col"
      dir="rtl"
      style={{ background: 'linear-gradient(160deg,#fdf8f3 0%,#f5ebe0 100%)', minHeight: '100dvh' }}
    >

      {/* ── Top brand bar ─────────────────────────────────────── */}
      <div style={{ padding: '18px 20px 0', display: 'flex', justifyContent: 'flex-start' }}>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#c97d3a', letterSpacing: '-.01em' }}>
          كِتابي
        </span>
      </div>

      {/* ── Hero headline ─────────────────────────────────────── */}
      <div className="fade-up px-5 pt-5 pb-3 text-center">
        <h1
          className="font-black text-ink"
          style={{ fontSize: 'clamp(1.55rem,7vw,2rem)', lineHeight: 1.25, marginBottom: 8 }}
        >
          هذه قصة {name}... 🎉
        </h1>
        <p
          className="text-ink-mid font-semibold"
          style={{ fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}
        >
          <span className="text-primary font-black">{name}</span> أصبح بطل قصة حقيقية
        </p>
      </div>

      {/* ── Book preview ──────────────────────────────────────── */}
      <div className="scale-up px-5 pb-2">

        {/* Cover + caption */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(60,30,0,.18)',
              marginBottom: 8,
              aspectRatio: '1/1',
            }}
          >
            <BookImage
              src={coverUrl}
              alt={`غلاف قصة ${name}`}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4a2c10', textAlign: 'center', lineHeight: 1.6 }}>
            دخل <span style={{ color: '#c97d3a' }}>{name}</span> عالماً لم يتخيله قط… وكانت هذه بدايته
          </p>
        </div>

        {/* Two sample pages with individual captions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { url: page1Url, caption: `فجأة، بدأت الأشياء تتحرك حوله — وكأن العالم يستقبل ${name}` },
            { url: page2Url, caption: 'وكان عليه أن يثبت شجاعته ليكمل الرحلة' },
          ].map((item, i) => (
            <div key={i}>
              <div
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(60,30,0,.12)',
                  aspectRatio: '1/1',
                  marginBottom: 6,
                }}
              >
                <BookImage
                  src={item.url}
                  alt={`صفحة ${i + 1}`}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6b4a28', textAlign: 'center', lineHeight: 1.55 }}>
                {item.caption}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-center text-ink-light"
          style={{ fontSize: 12, fontWeight: 600, marginTop: 12 }}
        >
          معاينة — الكتاب الكامل يحتوي على 16 صفحة + الغلاف
        </p>
      </div>

      {/* ── Offer section ─────────────────────────────────────── */}
      <div className="fade-up-2 px-5 pt-4 pb-10">

        {/* Psycho text */}
        <div
          style={{
            textAlign: 'center',
            padding: '14px 20px',
            marginBottom: 14,
            background: 'linear-gradient(135deg,#fff8f2,#fff2e6)',
            borderRadius: 14,
            border: '1.5px solid rgba(201,125,58,0.2)',
          }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2d1a08', lineHeight: 1.6 }}>
            هدية سيحبها {name} أكثر من أي لعبة 💛
          </p>
        </div>

        {/* Offer Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            border: '1.5px solid rgba(201,125,58,.2)',
            boxShadow: '0 6px 28px rgba(120,60,0,.09)',
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div
            style={{
              background: 'linear-gradient(135deg,#c97d3a,#e8a45a)',
              padding: '20px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
              احصل على النسخة المطبوعة
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 36,
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-.02em',
              }}
            >
              ₪199 فقط
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>
              شامل التوصيل
            </p>
          </div>

          {/* Benefits */}
          <div style={{ padding: '16px 24px 4px' }}>
            {BENEFITS.map(b => (
              <div
                key={b}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 0',
                  borderBottom: '1px solid #f5f0ea',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(201,125,58,.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, color: '#c97d3a', fontWeight: 900 }}>✓</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#2d1a08' }}>{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: '16px 24px 22px' }}>
            <button
              onClick={onOrder}
              className="active:scale-[0.97] transition-transform duration-150"
              style={{
                width: '100%',
                padding: '20px 24px',
                background: 'linear-gradient(140deg,#ec7a44,#d4643a,#be5530)',
                boxShadow: '0 8px 24px rgba(190,80,40,.32)',
                border: 'none',
                borderRadius: 14,
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '1.12rem',
                fontWeight: 900,
                cursor: 'pointer',
                letterSpacing: '.005em',
              }}
            >
              اطلب النسخة المطبوعة الآن
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginTop: 12,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a09080' }}>الدفع عند الاستلام</span>
              <span style={{ width: 1, height: 12, background: '#e0d8d0' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a09080' }}>بدون بطاقة</span>
              <span style={{ width: 1, height: 12, background: '#e0d8d0' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a09080' }}>تأكيد فوري</span>
            </div>
          </div>
        </div>

        {/* Secondary — make another */}
        <button
          onClick={onRestart}
          className="active:scale-[0.97] transition-transform duration-150"
          style={{
            width: '100%',
            marginTop: 14,
            padding: '14px 24px',
            background: 'transparent',
            border: '2px solid rgba(201,125,58,.25)',
            borderRadius: 14,
            color: '#c97d3a',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          اصنع قصة لطفل آخر
        </button>

      </div>
    </div>
  )
}
