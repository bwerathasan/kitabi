import { useState, useEffect, useRef } from 'react'
import { createOrder, generateOrder } from '../api/orders.js'

/**
 * Screen 8 — Progress
 *
 * Flow:
 *   1. createOrder(form)      → get order_id          (~< 1s)
 *   2. generateOrder(orderId) → full pipeline         (~5–20s)
 *
 * Animation runs by fixed timing (cosmetic, reassuring).
 * Stage 3 stays active until the API actually resolves.
 * Only after BOTH animation reaches stage 3 AND API is done → advance.
 */

const STAGES = [
  { id: 1, icon: '✏️', label: 'نكتب القصة...',        doneLabel: 'كُتبت القصة ✓'       },
  { id: 2, icon: '🎨', label: 'نرسم الشخصيات...',     doneLabel: 'رُسمت الشخصيات ✓'   },
  { id: 3, icon: '📚', label: 'نجهّز الصفحات...',     doneLabel: 'الكتاب جاهز ✓'      },
]

// Stage 1 done at 2.5s, Stage 2 done at 5.5s.
// Stage 3 stays active until the real API resolves.
const T1 = 2500
const T2 = 5500

export default function Progress({ form, onDone }) {
  const [doneStages, setDoneStages]   = useState([])
  const [activeStage, setActiveStage] = useState(1)
  const [error, setError]             = useState(null)

  const name = form.childName || 'طفلك'

  // Use a ref-based approach to avoid stale closure issues across timers + async
  const state = useRef({
    cancelled:    false,
    apiDone:      false,
    apiResult:    null,
    stage2Passed: false,
  })

  function tryFinish() {
    const s = state.current
    if (s.cancelled || !s.apiDone || !s.stage2Passed) return

    // Mark stage 3 done visually
    setDoneStages([1, 2, 3])

    // Brief pause so user sees stage 3 complete before screen changes
    setTimeout(() => {
      if (state.current.cancelled) return
      onDone(s.apiResult.order_id, s.apiResult)
    }, 900)
  }

  useEffect(() => {
    const s = state.current

    // -- Animation timers --------------------------------------------------
    const t1 = setTimeout(() => {
      if (s.cancelled) return
      setDoneStages([1])
      setActiveStage(2)
    }, T1)

    const t2 = setTimeout(() => {
      if (s.cancelled) return
      setDoneStages([1, 2])
      setActiveStage(3)
      s.stage2Passed = true
      tryFinish()
    }, T2)

    // -- Real API call -----------------------------------------------------
    async function run() {
      try {
        // Step A: create the order record
        const order = await createOrder(form)
        if (s.cancelled) return

        // Step B: run the full generation pipeline (blocking, 5-20s)
        const result = await generateOrder(order.order_id)
        if (s.cancelled) return

        s.apiDone   = true
        s.apiResult = result
        tryFinish()

      } catch (err) {
        if (s.cancelled) return
        setError(err.message || 'حدث خطأ غير متوقع، يرجى المحاولة مجدداً')
      }
    }

    run()

    return () => {
      s.cancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------------
  // Error state
  // ------------------------------------------------------------------
  if (error) {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center"
        dir="rtl"
      >
        <div className="text-7xl mb-6 select-none">😔</div>
        <h1 className="text-2xl font-black text-ink mb-3">حدث خطأ</h1>
        <p className="text-ink-mid text-base mb-8 max-w-xs leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="
            w-full max-w-xs py-4
            bg-primary text-white
            text-lg font-black rounded-2xl
            shadow-md shadow-primary/20
            active:scale-[0.98] transition-all duration-150
          "
        >
          حاول مرة ثانية
        </button>
      </div>
    )
  }

  // ------------------------------------------------------------------
  // Progress state
  // ------------------------------------------------------------------
  const allDone = doneStages.length === STAGES.length

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center"
      dir="rtl"
    >
      {/* ── Spinner / Done icon ─────────────────────────────────── */}
      <div className="mb-8">
        {allDone
          ? <span className="text-7xl step-done select-none">🎉</span>
          : <div className="spinner mx-auto" style={{ width: 56, height: 56, borderWidth: 5 }} />
        }
      </div>

      {/* ── Headline ─────────────────────────────────────────────── */}
      <h1 className="text-2xl font-black text-ink mb-2">
        {allDone
          ? `قصة ${name} جاهزة! ✨`
          : `يتم الآن إنشاء قصة ${name} ✨`
        }
      </h1>
      {!allDone && (
        <>
          <p className="text-ink-mid text-base mb-4 pulse-soft">
            نجهّز كتابًا مخصصًا بالكامل لـ {name}...
          </p>
          <p className="text-ink-light text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            قد تستغرق عملية إنشاء القصة من 3 إلى 5 دقائق. يرجى عدم بدء قصة جديدة أو إغلاق الصفحة حتى يكتمل الإنشاء.
          </p>
        </>
      )}

      {/* ── Stage list ───────────────────────────────────────────── */}
      <div className="w-full max-w-xs flex flex-col gap-4 mt-4">
        {STAGES.map(stage => {
          const isDone   = doneStages.includes(stage.id)
          const isActive = !isDone && activeStage === stage.id

          return (
            <div
              key={stage.id}
              className={`
                flex items-center gap-4 px-5 py-3 rounded-2xl
                transition-all duration-300
                ${isDone   ? 'bg-white shadow-sm'                        : ''}
                ${isActive ? 'bg-primary-light border border-primary/20' : ''}
                ${!isDone && !isActive ? 'opacity-30'                    : ''}
              `}
            >
              <span className="text-2xl w-8 text-center select-none flex-shrink-0">
                {isDone ? '✅' : stage.icon}
              </span>

              <p className={`
                text-base font-bold text-right flex-1
                ${isDone   ? 'text-ink'          : ''}
                ${isActive ? 'text-primary-dark' : ''}
                ${!isDone && !isActive ? 'text-ink-mid' : ''}
              `}>
                {isDone ? stage.doneLabel : stage.label}
              </p>

              {isActive && (
                <div className="spinner flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
