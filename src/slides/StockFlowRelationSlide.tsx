import { useEffect, useState } from 'react'
import './StockFlowRelationSlide.css'

interface Props { isActive: boolean }

const STEPS = [
  {
    title: 'Stock anterior',
    body: 'Partimos del nivel que había al final del período pasado.',
  },
  {
    title: 'Flujo del período',
    body: 'Agregamos lo que entró y restamos lo que salió entre t−1 y t.',
  },
  {
    title: 'Nuevo stock',
    body: 'Queda el stock al momento t. La identidad es contable: siempre se cumple.',
  },
]

export function StockFlowRelationSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const next = () => setStep((s) => Math.min(3, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="sf-rel">
      <header className="sf-rel__header">
        <p className="sf-rel__eyebrow">Relación fundamental</p>
        <h2 className="sf-rel__title">Cómo se conectan stocks y flujos</h2>
        <p className="sf-rel__lead">
          El stock <em>hoy</em> es el stock <em>de ayer</em> más (o menos)
          el flujo neto ocurrido entre ambos momentos.
        </p>
      </header>

      <div className="sf-rel__grid">
        <div className="sf-rel__eq" aria-label="Ecuación stock-flujo">
          <span className="sf-eq__term sf-eq__stock" data-visible={step >= 3}>
            S<sub>t</sub>
          </span>
          <span className="sf-eq__op" data-visible={step >= 3}>=</span>
          <span className="sf-eq__term sf-eq__prev" data-visible={step >= 1}>
            S<sub>t−1</sub>
          </span>
          <span className="sf-eq__op sf-eq__plus" data-visible={step >= 2}>+</span>
          <span className="sf-eq__term sf-eq__flow" data-visible={step >= 2}>
            F<sub>(t−1, t)</sub>
          </span>
        </div>

        <div className="sf-rel__steps">
          {STEPS.map((s, i) => (
            <article key={s.title} className="sf-rel__step" data-visible={step >= i + 1}>
              <span className="sf-rel__step-num">0{i + 1}</span>
              <div>
                <h4 className="sf-rel__step-title">{s.title}</h4>
                <p className="sf-rel__step-body">{s.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="sf-rel__viz" aria-hidden>
          <Bathtub level={step} />
        </div>
      </div>

      <aside className="sf-rel__note">
        <strong>Nota sobre signos.</strong> Si el flujo es neto positivo (entradas &gt; salidas),
        el stock crece. Si es negativo, decrece. Ejemplos: ahorro → riqueza;
        déficit → deuda; nacimientos netos → población; inversión neta → capital.
      </aside>

      <div className="sf-rel__actions">
        {step < 3 ? (
          <button className="sf-btn" onClick={next}>
            {step === 0 && 'Mostrar stock anterior →'}
            {step === 1 && 'Sumar el flujo del período →'}
            {step === 2 && 'Obtener el nuevo stock →'}
          </button>
        ) : (
          <button className="sf-btn sf-btn--ghost" onClick={reset}>Reiniciar</button>
        )}
      </div>
    </div>
  )
}

function Bathtub({ level }: { level: number }) {
  // Niveles de llenado según paso
  const fill = level <= 1 ? 0.28 : 0.66
  const flowActive = level === 2

  // Geometría del tanque
  const tubLeft = 60
  const tubRight = 200
  const tubTop = 60
  const tubBottom = 168
  const tubH = tubBottom - tubTop
  const waterTop = tubBottom - tubH * fill

  return (
    <svg viewBox="0 0 260 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* ── Etiqueta FLUJO entrante ── */}
      <text x="24" y="24" className="sf-viz__label" fill="var(--color-accent)">
        FLUJO (entrada)
      </text>
      <text x="24" y="38" className="sf-viz__label sf-viz__label--sub" fill="var(--color-text-muted)">
        unidades / tiempo
      </text>

      {/* ── Caño superior + canilla ── */}
      <rect x="24" y="44" width="60" height="5" rx="1" fill="var(--color-text-muted)" />
      <rect x="82" y="44" width="6" height="18" fill="var(--color-text-muted)" />
      <rect x="78" y="60" width="14" height="4" fill="var(--color-text-muted)" />

      {/* ── Gotas animadas cuando hay flujo ── */}
      {flowActive && (
        <g className="sf-drop">
          <ellipse cx="85" cy="72" rx="2.4" ry="3.2" fill="var(--color-accent)" />
          <ellipse cx="85" cy="86" rx="2.4" ry="3.2" fill="var(--color-accent)" />
          <ellipse cx="85" cy="100" rx="2.4" ry="3.2" fill="var(--color-accent)" />
        </g>
      )}

      {/* ── Tanque ── */}
      <path
        d={`M${tubLeft} ${tubTop}
            L${tubLeft} ${tubBottom - 12}
            Q${tubLeft} ${tubBottom} ${tubLeft + 12} ${tubBottom}
            L${tubRight - 12} ${tubBottom}
            Q${tubRight} ${tubBottom} ${tubRight} ${tubBottom - 12}
            L${tubRight} ${tubTop}`}
        fill="var(--color-surface-alt)"
        stroke="var(--color-text)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Agua ── */}
      <clipPath id="sf-tub-clip">
        <path d={`M${tubLeft + 2} ${tubTop}
                  L${tubLeft + 2} ${tubBottom - 13}
                  Q${tubLeft + 2} ${tubBottom - 2} ${tubLeft + 13} ${tubBottom - 2}
                  L${tubRight - 13} ${tubBottom - 2}
                  Q${tubRight - 2} ${tubBottom - 2} ${tubRight - 2} ${tubBottom - 13}
                  L${tubRight - 2} ${tubTop} Z`} />
      </clipPath>
      <g clipPath="url(#sf-tub-clip)">
        <rect
          x={tubLeft}
          y={waterTop}
          width={tubRight - tubLeft}
          height={tubBottom - waterTop}
          fill="var(--color-primary)"
          opacity="0.78"
          style={{
            transition: 'y 800ms var(--ease-out), height 800ms var(--ease-out)',
          }}
        />
        {/* ondulación superior del agua */}
        <path
          d={`M${tubLeft} ${waterTop}
              q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.45"
          style={{ transition: 'd 800ms var(--ease-out)' }}
        />
      </g>

      {/* ── Línea de nivel → etiqueta STOCK ── */}
      <line
        x1={tubRight + 4}
        x2={tubRight + 18}
        y1={waterTop}
        y2={waterTop}
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        style={{ transition: 'y1 800ms var(--ease-out), y2 800ms var(--ease-out)' }}
      />
      <text
        x={tubRight + 22}
        y={waterTop - 4}
        className="sf-viz__label"
        fill="var(--color-primary)"
        style={{ transition: 'y 800ms var(--ease-out)' }}
      >
        STOCK
      </text>
      <text
        x={tubRight + 22}
        y={waterTop + 8}
        className="sf-viz__label sf-viz__label--sub"
        fill="var(--color-text-muted)"
        style={{ transition: 'y 800ms var(--ease-out)' }}
      >
        en el momento t
      </text>

      {/* ── Base ── */}
      <line
        x1={tubLeft - 12}
        x2={tubRight + 12}
        y1={tubBottom + 4}
        y2={tubBottom + 4}
        stroke="var(--color-border)"
        strokeWidth="2"
      />

      {/* ── Pie: Sₜ = Sₜ₋₁ + Fₜ ── */}
      <text
        x="130"
        y={tubBottom + 26}
        textAnchor="middle"
        className="sf-viz__caption"
        fill="var(--color-text-muted)"
      >
        Sₜ = Sₜ₋₁ + F₍ₜ₋₁,ₜ₎
      </text>
    </svg>
  )
}
