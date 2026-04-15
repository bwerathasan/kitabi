import BackButton from './BackButton.jsx'

/**
 * Shared shell for steps 1–6.
 *
 * Props:
 *   step        {number}  current step (1-based, shown in counter)
 *   totalSteps  {number}  total number of data-entry steps (default 5)
 *   onBack      {fn}      called on back button tap
 *   children    {node}    screen-specific content
 */
export default function StepLayout({ step, totalSteps = 5, onBack, children }) {
  const progress = Math.round((step / totalSteps) * 100)

  return (
    <div className="min-h-dvh flex flex-col">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <BackButton onClick={onBack} />
        <span className="text-sm text-ink-light font-semibold tracking-wide">
          {step}&nbsp;/&nbsp;{totalSteps}
        </span>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="px-5">
        <div className="h-1.5 bg-warm-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Screen content ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 pt-7 pb-8">
        {children}
      </div>

    </div>
  )
}
