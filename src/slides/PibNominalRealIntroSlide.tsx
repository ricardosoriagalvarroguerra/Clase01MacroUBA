import { useEffect, useState } from 'react'
import './PibNominalRealIntroSlide.css'

interface Props { isActive: boolean }

export function PibNominalRealIntroSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const next = () => setStep((s) => Math.min(3, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="nr-intro">
      <header className="nr-intro__header">
        <p className="nr-intro__eyebrow">Nominal vs. real</p>
        <h2 className="nr-intro__title">¿A qué precios medimos el PIB?</h2>
        <p className="nr-intro__lead">
          Una misma canasta de bienes puede "crecer" porque se producen más unidades o
          simplemente porque los precios subieron. Separar ambos efectos es la distinción
          nominal/real.
        </p>
      </header>

      <div className="nr-intro__grid">
        <article className="nr-card nr-card--nominal" data-visible={step >= 1}>
          <span className="nr-card__tag">PIB NOMINAL</span>
          <h3 className="nr-card__title">A precios corrientes</h3>
          <p className="nr-card__body">
            Cada bien se valoriza a su precio del <strong>mismo año</strong> en que se produce.
          </p>
          <div className="nr-card__formula">Σ pₜ · qₜ</div>
          <ul className="nr-card__list">
            <li>Incluye efecto cantidad <em>y</em> efecto precio.</li>
            <li>Útil para comparar con agregados monetarios (deuda, base monetaria).</li>
            <li>Inflado por inflación en economías con alta variación de precios.</li>
          </ul>
        </article>

        <article className="nr-card nr-card--real" data-visible={step >= 2}>
          <span className="nr-card__tag">PIB REAL</span>
          <h3 className="nr-card__title">A precios constantes</h3>
          <p className="nr-card__body">
            Cada bien se valoriza a los precios de un <strong>año base</strong> fijo.
          </p>
          <div className="nr-card__formula">Σ p<sub>0</sub> · qₜ</div>
          <ul className="nr-card__list">
            <li>Aísla el efecto cantidad — mide producción "física".</li>
            <li>Útil para comparar bienestar y actividad entre años.</li>
            <li>Lo relevante para ciclos económicos y crecimiento.</li>
          </ul>
        </article>
      </div>

      <div className="nr-intro__deflator" data-visible={step >= 3}>
        <div className="nr-intro__deflator-icon">÷</div>
        <div>
          <h4 className="nr-intro__deflator-title">Deflactor implícito del PIB</h4>
          <p className="nr-intro__deflator-body">
            La relación entre ambos es un índice de precios implícito:
          </p>
          <div className="nr-intro__deflator-eq">
            Deflactor<sub>t</sub> ={' '}
            <span className="frac">
              <span className="frac__num">PIB nominalₜ</span>
              <span className="frac__den">PIB realₜ</span>
            </span>{' '}
            × 100
          </div>
          <p className="nr-intro__deflator-note">
            Su variación anual es una de las medidas de inflación más amplias:
            refleja los precios de <em>todos</em> los bienes producidos, no sólo la canasta de consumo.
          </p>
        </div>
      </div>

      <div className="nr-intro__actions">
        {step < 3 ? (
          <button className="sf-btn" onClick={next}>
            {step === 0 && 'Mostrar PIB nominal →'}
            {step === 1 && 'Mostrar PIB real →'}
            {step === 2 && 'Mostrar deflactor implícito →'}
          </button>
        ) : (
          <button className="sf-btn sf-btn--ghost" onClick={reset}>Reiniciar</button>
        )}
      </div>
    </div>
  )
}
