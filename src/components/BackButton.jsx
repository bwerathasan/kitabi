/**
 * Back button — left-pointing arrow (universally understood as "back"
 * even in RTL apps; matches WhatsApp, Instagram Arabic conventions).
 */
export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="رجوع"
      className="
        w-10 h-10 flex items-center justify-center
        rounded-full bg-white shadow-sm
        text-ink-mid
        active:scale-95 transition-transform duration-150
      "
    >
      {/* Left-pointing chevron */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
