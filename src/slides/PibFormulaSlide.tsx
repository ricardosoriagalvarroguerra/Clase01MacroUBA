import { useEffect, useState } from 'react'
import './PibFormulaSlide.css'

interface Term {
  symbol: string
  name: string
  description: string
  color: string
}

const TERMS: Term[] = [
  {
    symbol: 'C',
    name: 'Consumo',
    description: 'Gasto de los hogares en bienes y servicios finales (durables, no durables y servicios).',
    color: 'var(--color-series-1)',
  },
  {
    symbol: 'I',
    name: 'Inversión',
    description: 'Formación bruta de capital fijo, variación de existencias y construcción residencial.',
    color: 'var(--color-series-2)',
  },
  {
    symbol: 'G',
    name: 'Gasto Público',
    description: 'Compras de bienes y servicios del gobierno. No incluye transferencias.',
    color: 'var(--color-series-3)',
  },
  {
    symbol: 'X − M',
    name: 'Exportaciones Netas',
    description: 'Diferencia entre lo que vendemos al exterior (X) y lo que compramos del exterior (M).',
    color: 'var(--color-series-4)',
  },
]

interface Props {
  isActive: boolean
}

export function PibFormulaSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const totalSteps = TERMS.length
  const advance = () => setStep((s) => Math.min(totalSteps, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="pib-formula">
      <header className="pib-formula__header">
        <p className="pib-formula__eyebrow">Enfoque del gasto</p>
        <h2 className="pib-formula__title">La fórmula del PIB</h2>
        <p className="pib-formula__lead">
          El PIB, medido por el enfoque del gasto, es la suma de los componentes de la demanda agregada.
        </p>
      </header>

      <div className="pib-formula__equation" role="math" aria-label="PIB igual a C más I más G más exportaciones menos importaciones">
        <span className="pib-formula__lhs">PIB</span>
        <span className="pib-formula__eq">=</span>
        {TERMS.map((t, i) => (
          <span key={t.symbol} className="pib-formula__group">
            {i > 0 && (
              <span className="pib-formula__plus" data-visible={step > i}>
                +
              </span>
            )}
            <span
              className="pib-formula__term"
              data-visible={step > i}
              style={{ '--term-color': t.color } as React.CSSProperties}
            >
              {t.symbol}
            </span>
          </span>
        ))}
      </div>

      <div className="pib-formula__chips">
        {TERMS.map((t, i) => (
          <article
            key={t.symbol}
            className="chip"
            data-visible={step > i}
            style={{ '--term-color': t.color } as React.CSSProperties}
          >
            <header className="chip__head">
              <span className="chip__symbol">{t.symbol}</span>
              <h3 className="chip__name">{t.name}</h3>
            </header>
            <p className="chip__desc">{t.description}</p>
          </article>
        ))}
      </div>

      <div className="pib-formula__actions">
        {step < totalSteps ? (
          <button className="pib-formula__btn" onClick={advance}>
            Revelar siguiente término →
          </button>
        ) : (
          <button className="pib-formula__btn pib-formula__btn--ghost" onClick={reset}>
            Reiniciar animación
          </button>
        )}
      </div>
    </div>
  )
}
