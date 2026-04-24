import { useEffect, useState } from 'react'
import { laborStructure } from '@/data/argentinaUnemployment'
import './LaborRatesSlide.css'

interface Props { isActive: boolean }

const { pet, pea, pei, ocupados, desocupados, tasaActividad, tasaEmpleo, tasaDesempleo } = laborStructure

interface Rate {
  id: 'actividad' | 'empleo' | 'desempleo'
  title: string
  formula: string
  numerator: string
  denominator: string
  numValue: number
  denValue: number
  result: number
  reads: string
  tone: 'accent' | 'good' | 'bad'
}

const RATES: Rate[] = [
  {
    id: 'actividad',
    title: 'Tasa de actividad',
    formula: 'PEA ÷ PET × 100',
    numerator: 'PEA',
    denominator: 'PET',
    numValue: pea,
    denValue: pet,
    result: tasaActividad,
    reads: 'Cuántos de los que están en edad de trabajar efectivamente participan del mercado laboral (trabajando o buscando).',
    tone: 'accent',
  },
  {
    id: 'empleo',
    title: 'Tasa de empleo',
    formula: 'Ocupados ÷ PET × 100',
    numerator: 'Ocupados',
    denominator: 'PET',
    numValue: ocupados,
    denValue: pet,
    result: tasaEmpleo,
    reads: 'Cuántos de los que están en edad de trabajar tienen efectivamente un empleo.',
    tone: 'good',
  },
  {
    id: 'desempleo',
    title: 'Tasa de desempleo',
    formula: 'Desocupados ÷ PEA × 100',
    numerator: 'Desocupados',
    denominator: 'PEA',
    numValue: desocupados,
    denValue: pea,
    result: tasaDesempleo,
    reads: 'Cuántos de los que participan del mercado laboral no logran encontrar empleo.',
    tone: 'bad',
  },
]

export function LaborRatesSlide({ isActive }: Props) {
  const [revealed, setRevealed] = useState<Record<Rate['id'], boolean>>({
    actividad: false,
    empleo: false,
    desempleo: false,
  })

  useEffect(() => {
    if (!isActive) setRevealed({ actividad: false, empleo: false, desempleo: false })
  }, [isActive])

  const toggle = (id: Rate['id']) => setRevealed((r) => ({ ...r, [id]: !r[id] }))
  const revealAll = () =>
    setRevealed({ actividad: true, empleo: true, desempleo: true })

  return (
    <div className="lbr-rate">
      <header className="lbr-rate__header">
        <p className="lbr-rate__eyebrow">Mercado de trabajo · indicadores</p>
        <h2 className="lbr-rate__title">Las tres tasas clave</h2>
        <p className="lbr-rate__lead">
          Misma foto, tres preguntas distintas. Fijate en el <em>denominador</em>:
          la tasa de desempleo mide sobre quienes participan, no sobre toda la PET.
          Click en cada card para ver el cálculo con datos reales.
        </p>
      </header>

      <div className="lbr-rate__grid">
        {RATES.map((r) => (
          <article
            key={r.id}
            className="lbr-rate__card"
            data-tone={r.tone}
            data-revealed={revealed[r.id]}
            onClick={() => toggle(r.id)}
          >
            <header className="lbr-rate__card-head">
              <h3>{r.title}</h3>
              <span className="lbr-rate__card-formula">{r.formula}</span>
            </header>

            <div className="lbr-rate__calc">
              <div className="lbr-rate__frac">
                <span className="lbr-rate__num">
                  {r.numerator}
                  <span className="lbr-rate__val">{r.numValue} M</span>
                </span>
                <span className="lbr-rate__bar" />
                <span className="lbr-rate__den">
                  {r.denominator}
                  <span className="lbr-rate__val">{r.denValue} M</span>
                </span>
              </div>
              <span className="lbr-rate__times">× 100</span>
              <span className="lbr-rate__equals">=</span>
              <span className="lbr-rate__result" data-show={revealed[r.id]}>
                {revealed[r.id] ? `${r.result.toFixed(1)}%` : '?'}
              </span>
            </div>

            <p className="lbr-rate__reads">{r.reads}</p>
          </article>
        ))}
      </div>

      <div className="lbr-rate__actions">
        <button className="lbr-rate__btn" onClick={revealAll}>Revelar todas</button>
        <span className="lbr-rate__foot">
          Argentina · {laborStructure.periodo} · {laborStructure.fuente}
        </span>
      </div>

      <aside className="lbr-rate__warn">
        <strong>¿Por qué importan los tres?</strong> Si sube el desempleo porque más gente empieza
        a buscar trabajo (aumenta PEA), no es lo mismo que si sube porque se destruyen puestos
        (cae ocupados). La tasa de empleo ayuda a distinguir ambos casos — PEI <span className="lbr-rate__kbd">{pei} M</span>.
      </aside>
    </div>
  )
}
