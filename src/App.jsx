import { useState, useCallback } from 'react'
import Hero        from './screens/Hero.jsx'
import Intro       from './screens/Intro.jsx'
import ChildName   from './screens/ChildName.jsx'
import Age         from './screens/Age.jsx'
import Gender      from './screens/Gender.jsx'
import Appearance  from './screens/Appearance.jsx'
import Theme       from './screens/Theme.jsx'
import Email       from './screens/Email.jsx'
import Review      from './screens/Review.jsx'
import Progress    from './screens/Progress.jsx'
import Result      from './screens/Result.jsx'
import Shipping    from './screens/Shipping.jsx'
import Confirm     from './screens/Confirm.jsx'

// Step indices — single source of truth
const S = {
  HERO:       0,
  INTRO:      1,
  NAME:       2,
  AGE:        3,
  GENDER:     4,
  APPEARANCE: 5,
  THEME:      6,
  EMAIL:      7,
  REVIEW:     8,
  PROGRESS:   9,
  RESULT:     10,
  SHIPPING:   11,
  CONFIRM:    12,
}

const EMPTY_FORM = {
  childName:  '',
  ageGroup:   '',
  gender:     '',
  skinTone:   '',
  hairColor:  '',
  hairType:   '',
  eyeColor:   '',
  theme:      '',
  email:      '',
  parentName: '',
  phone:      '',
  city:       '',
  address:    '',
}

export default function App() {
  const [step, setStep]               = useState(S.HERO)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [orderResult, setOrderResult] = useState(null)

  const update  = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), [])

  const next    = useCallback(() => setStep(s => s + 1), [])
  const back    = useCallback(() => setStep(s => Math.max(0, s - 1)), [])
  const goTo    = useCallback((s) => setStep(s), [])

  // Called by Progress when the full pipeline succeeds
  const onOrderDone = useCallback((orderId, result) => {
    setOrderResult(result)
    next()
  }, [next])

  const restart = useCallback(() => {
    setForm(EMPTY_FORM)
    setOrderResult(null)
    setStep(S.HERO)
  }, [])

  const orderId = orderResult?.order_id || null

  const screens = {
    [S.HERO]:       <Hero       onNext={next} />,
    [S.INTRO]:      <Intro      onNext={next} />,
    [S.NAME]:       <ChildName  form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.AGE]:        <Age        form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.GENDER]:     <Gender     form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.APPEARANCE]: <Appearance form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.THEME]:      <Theme      form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.EMAIL]:      <Email      form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.REVIEW]:     <Review     form={form} onNext={next} onBack={back} goTo={goTo} steps={S} />,
    [S.PROGRESS]:   <Progress   form={form} onDone={onOrderDone} />,
    [S.RESULT]:     <Result     form={form} orderResult={orderResult} onOrder={next} onRestart={restart} />,
    [S.SHIPPING]:   <Shipping   form={form} onUpdate={update} onNext={next} onBack={back} />,
    [S.CONFIRM]:    <Confirm    form={form} orderId={orderId} onBack={back} onRestart={restart} />,
  }

  return (
    <div className="min-h-dvh bg-warm-50 flex flex-col font-arabic" dir="rtl">
      {screens[step]}
    </div>
  )
}
