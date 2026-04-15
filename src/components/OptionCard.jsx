/**
 * Selectable option card — used for Age, Gender, Theme screens.
 *
 * In RTL flex layout:
 *   icon  →  appears on the RIGHT  (DOM order: first)
 *   label →  fills the middle
 *   radio →  appears on the LEFT   (DOM order: last)
 *
 * Props:
 *   icon      {string}   emoji or similar
 *   label     {string}   primary label
 *   sublabel  {string?}  optional secondary line
 *   selected  {boolean}
 *   onClick   {fn}
 */
export default function OptionCard({ icon, label, sublabel, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-5 py-4
        rounded-2xl border-2 text-right
        transition-all duration-200 active:scale-[0.98]
        ${selected
          ? 'border-primary bg-primary-light shadow-md shadow-primary/10'
          : 'border-transparent bg-white shadow-sm'
        }
      `}
    >
      {/* Icon — rightmost in RTL */}
      {icon && (
        <span className="text-3xl leading-none select-none">{icon}</span>
      )}

      {/* Label */}
      <div className="flex-1 text-right">
        <p className={`font-bold text-base leading-tight ${selected ? 'text-primary-dark' : 'text-ink'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-sm text-ink-light mt-0.5">{sublabel}</p>
        )}
      </div>

      {/* Radio indicator — leftmost in RTL */}
      <div className={`
        w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
        transition-colors duration-200
        ${selected ? 'border-primary bg-primary' : 'border-warm-200 bg-white'}
      `}>
        {selected && (
          <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        )}
      </div>
    </button>
  )
}
