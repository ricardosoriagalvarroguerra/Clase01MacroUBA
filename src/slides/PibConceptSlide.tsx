import { useEffect, useState } from 'react'
import './PibConceptSlide.css'

interface Highlight {
  word: string
  description: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    word: 'valor de mercado',
    description:
      'Se valoriza a precios de mercado, lo que permite sumar bienes heterogéneos en una unidad común.',
  },
  {
    word: 'bienes y servicios finales',
    description:
      'Excluye bienes intermedios para evitar la doble contabilización en la cadena productiva.',
  },
  {
    word: 'producidos',
    description:
      'Mide producción, no ventas. Lo producido pero no vendido se registra como variación de existencias.',
  },
  {
    word: 'dentro de un país',
    description:
      'Criterio geográfico. Incluye producción de factores extranjeros radicados en el país (a diferencia del PNB).',
  },
  {
    word: 'en un período determinado',
    description:
      'Típicamente un trimestre o un año. Es una variable flujo, no stock.',
  },
]

interface Props {
  isActive: boolean
}

export function PibConceptSlide({ isActive }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  return (
    <div className="pib-concept">
      <div className="pib-concept__left">
        <p className="pib-concept__eyebrow">Definición</p>
        <h2 className="pib-concept__title">¿Qué es el PIB?</h2>
        <p className="pib-concept__definition">
          El Producto Interno Bruto es el{' '}
          <mark className="kw" data-visible={step > 0} data-idx="0">valor de mercado</mark>{' '}
          de todos los{' '}
          <mark className="kw" data-visible={step > 1} data-idx="1">bienes y servicios finales</mark>{' '}
          <mark className="kw" data-visible={step > 2} data-idx="2">producidos</mark>{' '}
          <mark className="kw" data-visible={step > 3} data-idx="3">dentro de un país</mark>{' '}
          <mark className="kw" data-visible={step > 4} data-idx="4">en un período determinado</mark>.
        </p>
        <button
          className="pib-concept__btn"
          onClick={() => setStep((s) => Math.min(HIGHLIGHTS.length, s + 1))}
          disabled={step >= HIGHLIGHTS.length}
        >
          {step >= HIGHLIGHTS.length ? 'Definición completa' : 'Destacar siguiente concepto'}
        </button>
      </div>

      <ul className="pib-concept__list">
        {HIGHLIGHTS.map((h, i) => (
          <li key={h.word} className="pib-concept__item" data-visible={step > i}>
            <span className="pib-concept__index">0{i + 1}</span>
            <div>
              <h3 className="pib-concept__word">{h.word}</h3>
              <p className="pib-concept__text">{h.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
