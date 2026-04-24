import { useEffect, useState } from 'react'
import './StockFlowIntroSlide.css'

interface Props { isActive: boolean }

export function StockFlowIntroSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const next = () => setStep((s) => Math.min(2, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="sf-intro">
      <header className="sf-intro__header">
        <p className="sf-intro__eyebrow">Conceptos previos</p>
        <h2 className="sf-intro__title">Stocks vs. Flujos</h2>
        <p className="sf-intro__lead">
          Distinción clave en economía y en cualquier sistema dinámico:
          cómo se mide una magnitud determina qué podemos decir sobre ella.
        </p>
      </header>

      <div className="sf-intro__grid">
        <article className="sf-card sf-card--stock" data-visible={step >= 1}>
          <div className="sf-card__icon" aria-hidden>
            <svg viewBox="0 0 60 60" width="48" height="48">
              <rect x="10" y="10" width="40" height="40" rx="4" fill="none"
                stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="28" width="32" height="18" fill="currentColor" opacity="0.85" />
            </svg>
          </div>
          <h3 className="sf-card__title">STOCK</h3>
          <p className="sf-card__definition">
            Magnitud medida <strong>en un instante</strong> determinado del tiempo.
          </p>
          <ul className="sf-card__list">
            <li>No tiene dimensión temporal explícita.</li>
            <li>Responde a "¿cuánto hay <em>ahora</em>?"</li>
            <li>Unidad: una cantidad (USD, m³, personas, libros).</li>
          </ul>
          <div className="sf-card__tag">Ej.: saldo de una cuenta al 31/12</div>
        </article>

        <article className="sf-card sf-card--flow" data-visible={step >= 2}>
          <div className="sf-card__icon" aria-hidden>
            <svg viewBox="0 0 60 60" width="48" height="48">
              <path d="M8 30 H 44" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <path d="M36 22 L 48 30 L 36 38" stroke="currentColor" strokeWidth="2.5"
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="30" r="3" fill="currentColor" opacity="0.55" />
              <circle cx="24" cy="30" r="3" fill="currentColor" opacity="0.8" />
            </svg>
          </div>
          <h3 className="sf-card__title">FLUJO</h3>
          <p className="sf-card__definition">
            Magnitud medida <strong>a lo largo de un intervalo</strong> de tiempo.
          </p>
          <ul className="sf-card__list">
            <li>Se expresa siempre <em>por unidad de tiempo</em>.</li>
            <li>Responde a "¿cuánto <em>entre</em> t₁ y t₂?"</li>
            <li>Unidad: cantidad / tiempo (USD/año, m³/seg, nac./día).</li>
          </ul>
          <div className="sf-card__tag">Ej.: ingresos durante el mes de marzo</div>
        </article>
      </div>

      <div className="sf-intro__actions">
        {step < 2 ? (
          <button className="sf-btn" onClick={next}>
            {step === 0 ? 'Revelar stock →' : 'Revelar flujo →'}
          </button>
        ) : (
          <button className="sf-btn sf-btn--ghost" onClick={reset}>Reiniciar</button>
        )}
      </div>
    </div>
  )
}
