import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './StockFlowExamplesSlide.css'

interface Example {
  domain: string
  stock: string
  stockUnit: string
  flow: string
  flowUnit: string
  icon: ReactNode
}

const EXAMPLES: Example[] = [
  {
    domain: 'Bañera',
    stock: 'Agua acumulada',
    stockUnit: 'litros',
    flow: 'Caudal de la canilla',
    flowUnit: 'litros / minuto',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 26 H 42 V 36 Q 42 40 38 40 H 10 Q 6 40 6 36 Z" />
        <path d="M14 26 V 14 Q 14 10 18 10 H 22" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    domain: 'Demografía',
    stock: 'Población',
    stockUnit: 'habitantes',
    flow: 'Nacimientos − defunciones',
    flowUnit: 'personas / año',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="24" cy="16" r="6" />
        <path d="M12 40 Q 12 28 24 28 Q 36 28 36 40" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    domain: 'Biblioteca',
    stock: 'Libros en estantería',
    stockUnit: 'unidades',
    flow: 'Préstamos / devoluciones',
    flowUnit: 'libros / mes',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="10" y="8" width="6" height="32" />
        <rect x="18" y="12" width="6" height="28" />
        <rect x="26" y="6" width="6" height="34" />
        <rect x="34" y="14" width="6" height="26" />
      </svg>
    ),
  },
  {
    domain: 'Batería',
    stock: 'Energía almacenada',
    stockUnit: 'kWh',
    flow: 'Potencia de carga / descarga',
    flowUnit: 'kW (= kWh / h)',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="14" width="30" height="20" rx="2" />
        <rect x="38" y="20" width="4" height="8" fill="currentColor" />
        <rect x="12" y="18" width="18" height="12" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    domain: 'Automóvil',
    stock: 'Kilómetros recorridos',
    stockUnit: 'km (en odómetro)',
    flow: 'Velocidad',
    flowUnit: 'km / hora',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 32 H 42" />
        <circle cx="14" cy="32" r="4" />
        <circle cx="34" cy="32" r="4" />
        <path d="M10 32 Q 10 20 20 20 H 30 Q 38 20 38 28" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    domain: 'Cuenta bancaria',
    stock: 'Saldo',
    stockUnit: 'USD al instante t',
    flow: 'Depósitos − extracciones',
    flowUnit: 'USD / mes',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="14" width="32" height="22" rx="2" />
        <path d="M8 22 H 40" />
        <circle cx="24" cy="30" r="3" />
      </svg>
    ),
  },
  {
    domain: 'Empresa',
    stock: 'Capital productivo (K)',
    stockUnit: 'USD en maquinaria',
    flow: 'Inversión bruta − depreciación',
    flowUnit: 'USD / año',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="20" width="10" height="20" />
        <rect x="20" y="12" width="10" height="28" />
        <rect x="32" y="24" width="8" height="16" />
      </svg>
    ),
  },
  {
    domain: 'Macroeconomía',
    stock: 'Deuda pública',
    stockUnit: 'USD adeudados',
    flow: 'Déficit fiscal primario',
    flowUnit: 'USD / año',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 40 L 16 28 L 24 32 L 32 18 L 40 12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 40 H 40" opacity="0.4" />
      </svg>
    ),
  },
]

interface Props { isActive: boolean }

export function StockFlowExamplesSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  const next = () => setStep((s) => Math.min(EXAMPLES.length, s + 1))
  const reset = () => setStep(0)

  return (
    <div className="sf-ex">
      <header className="sf-ex__header">
        <p className="sf-ex__eyebrow">La distinción aplica a cualquier sistema dinámico</p>
        <h2 className="sf-ex__title">Ejemplos: stocks y sus flujos asociados</h2>
      </header>

      <div className="sf-ex__grid">
        {EXAMPLES.map((e, i) => (
          <article key={e.domain} className="sf-ex__card" data-visible={step > i}>
            <div className="sf-ex__head">
              <span className="sf-ex__icon">{e.icon}</span>
              <span className="sf-ex__domain">{e.domain}</span>
            </div>
            <div className="sf-ex__pair">
              <div className="sf-ex__col sf-ex__col--stock">
                <span className="sf-ex__tag">Stock</span>
                <p className="sf-ex__val">{e.stock}</p>
                <p className="sf-ex__unit">{e.stockUnit}</p>
              </div>
              <div className="sf-ex__arrow" aria-hidden>↔</div>
              <div className="sf-ex__col sf-ex__col--flow">
                <span className="sf-ex__tag">Flujo</span>
                <p className="sf-ex__val">{e.flow}</p>
                <p className="sf-ex__unit">{e.flowUnit}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="sf-ex__actions">
        {step < EXAMPLES.length ? (
          <button className="sf-btn" onClick={next}>
            Revelar siguiente ejemplo →  <span className="sf-ex__counter">{step}/{EXAMPLES.length}</span>
          </button>
        ) : (
          <button className="sf-btn sf-btn--ghost" onClick={reset}>Reiniciar</button>
        )}
      </div>
    </div>
  )
}
