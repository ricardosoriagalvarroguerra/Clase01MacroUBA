import { useEffect, useState } from 'react'
import './PibNominalRealExampleSlide.css'

interface Props { isActive: boolean }

// Economía didáctica con sólo 2 bienes: manzanas y naranjas
const BASE_YEAR = 2023
const apples = { q: [100, 110], p: [1.0, 2.0] }   // cantidades y precios en cada año
const oranges = { q: [50, 55], p: [2.0, 3.0] }

// Cálculos
const nominalY1 = apples.q[0] * apples.p[0] + oranges.q[0] * oranges.p[0]          // 100·1 + 50·2 = 200
const nominalY2 = apples.q[1] * apples.p[1] + oranges.q[1] * oranges.p[1]          // 110·2 + 55·3 = 385
const realY1 = nominalY1                                                           // año base = Y1 → coincide
const realY2 = apples.q[1] * apples.p[0] + oranges.q[1] * oranges.p[0]             // 110·1 + 55·2 = 220
const nominalGrowth = ((nominalY2 - nominalY1) / nominalY1) * 100                  // 92.5%
const realGrowth = ((realY2 - realY1) / realY1) * 100                              // 10%
const deflator = (nominalY2 / realY2) * 100                                        // 175

export function PibNominalRealExampleSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const next = () => setStep((s) => Math.min(4, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="nr-ex">
      <header className="nr-ex__header">
        <p className="nr-ex__eyebrow">Ejemplo didáctico · economía de 2 bienes</p>
        <h2 className="nr-ex__title">Calculemos el PIB nominal y el real</h2>
        <p className="nr-ex__lead">
          Año 1 es el <strong>año base</strong> ({BASE_YEAR}). Veamos cuánto "crece" la
          economía de año 1 a año 2 según cómo midamos.
        </p>
      </header>

      <div className="nr-ex__body">
        {/* ── Tabla con cantidades y precios ── */}
        <div className="nr-ex__table">
          <table>
            <thead>
              <tr>
                <th>Bien</th>
                <th>q · año 1</th>
                <th>p · año 1</th>
                <th>q · año 2</th>
                <th>p · año 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🍎 Manzanas</td>
                <td className="num">{apples.q[0]}</td>
                <td className="num">${apples.p[0].toFixed(2)}</td>
                <td className="num">{apples.q[1]}</td>
                <td className="num">${apples.p[1].toFixed(2)}</td>
              </tr>
              <tr>
                <td>🍊 Naranjas</td>
                <td className="num">{oranges.q[0]}</td>
                <td className="num">${oranges.p[0].toFixed(2)}</td>
                <td className="num">{oranges.q[1]}</td>
                <td className="num">${oranges.p[1].toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Paneles de cálculo ── */}
        <div className="nr-ex__calcs">
          <article className="nr-ex__calc nr-ex__calc--nominal" data-visible={step >= 1}>
            <span className="nr-ex__calc-tag">PIB NOMINAL · año 2</span>
            <p className="nr-ex__calc-body">Precios del <strong>mismo</strong> año 2:</p>
            <div className="nr-ex__calc-eq">
              110 × $2 + 55 × $3 = <strong>${nominalY2}</strong>
            </div>
            <div className="nr-ex__calc-note">
              PIB nominal año 1 = 100·1 + 50·2 = ${nominalY1}
            </div>
          </article>

          <article className="nr-ex__calc nr-ex__calc--real" data-visible={step >= 2}>
            <span className="nr-ex__calc-tag">PIB REAL · año 2 (precios de {BASE_YEAR})</span>
            <p className="nr-ex__calc-body">Cantidades de año 2, precios del <strong>año base</strong>:</p>
            <div className="nr-ex__calc-eq">
              110 × $1 + 55 × $2 = <strong>${realY2}</strong>
            </div>
            <div className="nr-ex__calc-note">
              PIB real año 1 = PIB nominal año 1 = ${realY1} (en año base coinciden)
            </div>
          </article>

          <article className="nr-ex__calc nr-ex__calc--growth" data-visible={step >= 3}>
            <span className="nr-ex__calc-tag">CRECIMIENTO</span>
            <div className="nr-ex__growth-row">
              <div>
                <span className="nr-ex__growth-label">Nominal</span>
                <strong className="nr-ex__growth-val nr-ex__growth-val--nominal">
                  +{nominalGrowth.toFixed(1)}%
                </strong>
              </div>
              <div>
                <span className="nr-ex__growth-label">Real</span>
                <strong className="nr-ex__growth-val nr-ex__growth-val--real">
                  +{realGrowth.toFixed(1)}%
                </strong>
              </div>
            </div>
            <p className="nr-ex__calc-note">
              De los <strong>{nominalGrowth.toFixed(1)}%</strong> nominales, solo{' '}
              <strong>{realGrowth.toFixed(1)}%</strong> es aumento en producción física.
              El resto son precios.
            </p>
          </article>

          <article className="nr-ex__calc nr-ex__calc--deflator" data-visible={step >= 4}>
            <span className="nr-ex__calc-tag">DEFLACTOR · año 2</span>
            <div className="nr-ex__calc-eq">
              <span className="frac">
                <span className="frac__num">${nominalY2}</span>
                <span className="frac__den">${realY2}</span>
              </span>{' '}
              × 100 = <strong>{deflator.toFixed(0)}</strong>
            </div>
            <div className="nr-ex__calc-note">
              Los precios subieron <strong>{(deflator - 100).toFixed(0)}%</strong>{' '}
              respecto al año base.
            </div>
          </article>
        </div>
      </div>

      <div className="nr-ex__actions">
        {step < 4 ? (
          <button className="sf-btn" onClick={next}>
            {step === 0 && 'Calcular PIB nominal →'}
            {step === 1 && 'Calcular PIB real →'}
            {step === 2 && 'Comparar crecimiento →'}
            {step === 3 && 'Calcular deflactor →'}
          </button>
        ) : (
          <button className="sf-btn sf-btn--ghost" onClick={reset}>Reiniciar</button>
        )}
      </div>
    </div>
  )
}
