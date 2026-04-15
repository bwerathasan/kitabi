import StepLayout from '../components/StepLayout.jsx'

/**
 * Screen 5 — Appearance (optional)
 * Collects skin tone, hair color, hair type, eye color.
 * Skippable — all fields are optional.
 */

const SKIN_TONES = [
  { value: 'fair',        label: 'فاتح',     hex: '#FDDBB4' },
  { value: 'medium',      label: 'قمحي',     hex: '#D4956A' },
  { value: 'olive',       label: 'زيتوني',   hex: '#B5784A' },
  { value: 'brown',       label: 'بني',      hex: '#7D4C2A' },
  { value: 'dark',        label: 'داكن',     hex: '#4A2912' },
]

const HAIR_COLORS = [
  { value: 'black',       label: 'أسود',     hex: '#1C1C1C' },
  { value: 'dark brown',  label: 'بني',      hex: '#4B2C1A' },
  { value: 'brown',       label: 'بني فاتح', hex: '#8B5E3C' },
  { value: 'blonde',      label: 'أشقر',     hex: '#D4A843' },
  { value: 'red',         label: 'أحمر',     hex: '#B03A2E' },
]

const HAIR_TYPES = [
  { value: 'straight', label: 'ناعم' },
  { value: 'wavy',     label: 'متموج' },
  { value: 'curly',    label: 'مجعد' },
]

const EYE_COLORS = [
  { value: 'dark brown', label: 'بني داكن', hex: '#2C1A0E' },
  { value: 'brown',      label: 'بني',      hex: '#7B4F2E' },
  { value: 'hazel',      label: 'عسلي',     hex: '#8B6914' },
  { value: 'green',      label: 'أخضر',     hex: '#3A7D44' },
  { value: 'blue',       label: 'أزرق',     hex: '#3A6EA8' },
]

function SwatchRow({ items, selected, onSelect }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {items.map(item => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value === selected ? '' : item.value)}
          className={`
            flex flex-col items-center gap-1.5
            transition-all duration-150 active:scale-95
          `}
        >
          <div
            className={`
              w-10 h-10 rounded-full border-2 transition-all
              ${selected === item.value
                ? 'border-primary scale-110 shadow-md shadow-primary/30'
                : 'border-warm-200'
              }
            `}
            style={{ background: item.hex }}
          />
          <span className={`text-[10px] font-semibold ${selected === item.value ? 'text-primary-dark' : 'text-ink-light'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function ChipRow({ items, selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map(item => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value === selected ? '' : item.value)}
          className={`
            px-4 py-2 rounded-xl text-sm font-bold
            border-2 transition-all duration-150 active:scale-95
            ${selected === item.value
              ? 'border-primary bg-primary-light text-primary-dark shadow-sm'
              : 'border-warm-200 bg-white text-ink'
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default function Appearance({ form, onUpdate, onNext, onBack }) {
  const { skinTone, hairColor, hairType, eyeColor } = form

  function update(field, value) {
    onUpdate(field, value)
  }

  const hasAny = skinTone || hairColor || hairType || eyeColor

  return (
    <StepLayout step={4} totalSteps={6} onBack={onBack}>

      <h1 className="fade-up text-2xl font-black text-ink mb-1">
        خلينا نخليه يشبه طفلك ❤️
      </h1>
      <p className="fade-up-1 text-ink-mid text-sm mb-6 leading-relaxed">
        اختياري — كل حقل يجعل الصور أكثر شبهاً بطفلك الحقيقي.
      </p>

      <div className="fade-up-2 flex flex-col gap-6 overflow-y-auto pb-2">

        {/* Skin tone */}
        <div>
          <p className="text-xs font-bold text-ink-light uppercase tracking-wider mb-3">
            لون البشرة
          </p>
          <SwatchRow
            items={SKIN_TONES}
            selected={skinTone}
            onSelect={v => update('skinTone', v)}
          />
        </div>

        {/* Hair color */}
        <div>
          <p className="text-xs font-bold text-ink-light uppercase tracking-wider mb-3">
            لون الشعر
          </p>
          <SwatchRow
            items={HAIR_COLORS}
            selected={hairColor}
            onSelect={v => update('hairColor', v)}
          />
        </div>

        {/* Hair type */}
        <div>
          <p className="text-xs font-bold text-ink-light uppercase tracking-wider mb-3">
            نوع الشعر
          </p>
          <ChipRow
            items={HAIR_TYPES}
            selected={hairType}
            onSelect={v => update('hairType', v)}
          />
        </div>

        {/* Eye color */}
        <div>
          <p className="text-xs font-bold text-ink-light uppercase tracking-wider mb-3">
            لون العيون
          </p>
          <SwatchRow
            items={EYE_COLORS}
            selected={eyeColor}
            onSelect={v => update('eyeColor', v)}
          />
        </div>

      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={onNext}
          className="
            w-full py-4
            bg-primary text-white
            text-xl font-black rounded-2xl
            shadow-md shadow-primary/20
            active:scale-[0.98] transition-all duration-150
          "
        >
          {hasAny ? 'متابعة ←' : 'متابعة ←'}
        </button>
        {!hasAny && (
          <button
            onClick={onNext}
            className="w-full py-3 text-ink-light font-semibold text-sm active:opacity-60"
          >
            تخطي — استخدم مظهراً افتراضياً
          </button>
        )}
      </div>

    </StepLayout>
  )
}
