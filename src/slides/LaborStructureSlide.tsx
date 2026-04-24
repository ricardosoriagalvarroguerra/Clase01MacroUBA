import { useEffect, useState } from 'react'
import { laborStructure } from '@/data/argentinaUnemployment'
import './LaborStructureSlide.css'

interface Props { isActive: boolean }

type NodeId = 'total' | 'menores' | 'pet' | 'pea' | 'pei' | 'ocupados' | 'desocupados'

const NODE_INFO: Record<NodeId, { title: string; body: string; example: string }> = {
  total: {
    title: 'Población total',
    body: 'Todos los habitantes del país (o aglomerado) en el período de referencia.',
    example: 'Todos los argentinos, desde recién nacidos hasta jubilados.',
  },
  menores: {
    title: 'Menores de 14 años',
    body: 'Por criterio etario del INDEC no integran la Población en Edad de Trabajar (PET).',
    example: 'Un nene de 7 años en la escuela primaria.',
  },
  pet: {
    title: 'PET · Población en Edad de Trabajar',
    body: 'Personas de 14 años o más. Es el universo desde el cual se mide la participación laboral.',
    example: 'Desde un adolescente de 15 hasta un jubilado de 75.',
  },
  pea: {
    title: 'PEA · Población Económicamente Activa',
    body: 'Integrantes de la PET que trabajan o buscan activamente trabajo. Son quienes "ofrecen" su fuerza de trabajo al mercado.',
    example: 'Incluye ocupados + desocupados.',
  },
  pei: {
    title: 'PEI · Población Económicamente Inactiva',
    body: 'Integrantes de la PET que no trabajan ni buscan trabajo en el período de referencia.',
    example: 'Estudiantes full-time, amas/os de casa, jubilados, rentistas.',
  },
  ocupados: {
    title: 'Ocupados',
    body: 'Trabajaron al menos 1 hora en la semana de referencia a cambio de un pago, en especie, o como trabajador familiar sin remuneración.',
    example: 'Maestra, programador, vendedor ambulante, empleada doméstica.',
  },
  desocupados: {
    title: 'Desocupados',
    body: 'No trabajaron en la semana de referencia, están disponibles y buscaron activamente empleo en los últimos 30 días.',
    example: 'Alguien que perdió el trabajo y envía CVs todas las semanas.',
  },
}

export function LaborStructureSlide({ isActive }: Props) {
  const [selected, setSelected] = useState<NodeId>('total')

  useEffect(() => {
    if (!isActive) setSelected('total')
  }, [isActive])

  const info = NODE_INFO[selected]

  return (
    <div className="lbr-str">
      <header className="lbr-str__header">
        <p className="lbr-str__eyebrow">Mercado de trabajo · estructura</p>
        <h2 className="lbr-str__title">¿Cómo se divide la población?</h2>
        <p className="lbr-str__lead">
          Antes de medir el desempleo hay que clasificar a las personas en categorías excluyentes.
          Click en cada caja para ver su definición.
        </p>
      </header>

      <div className="lbr-str__grid">
        <div className="lbr-str__tree" role="tree">
          <Box id="total" level={0} selected={selected} onClick={setSelected} label="Población total" sub={`${laborStructure.poblacionTotal} M`} />

          <div className="lbr-str__split lbr-str__split--2">
            <Box id="menores" level={1} selected={selected} onClick={setSelected} label="Menores <14" sub={`${laborStructure.menores} M`} tone="muted" />
            <Box id="pet" level={1} selected={selected} onClick={setSelected} label="PET · ≥14" sub={`${laborStructure.pet} M`} />
          </div>

          <div className="lbr-str__split lbr-str__split--right">
            <div className="lbr-str__spacer" aria-hidden />
            <div className="lbr-str__split-inner">
              <Box id="pei" level={2} selected={selected} onClick={setSelected} label="PEI" sub={`${laborStructure.pei} M`} tone="neutral" />
              <Box id="pea" level={2} selected={selected} onClick={setSelected} label="PEA" sub={`${laborStructure.pea} M`} tone="accent" />
            </div>
          </div>

          <div className="lbr-str__split lbr-str__split--right">
            <div className="lbr-str__spacer" aria-hidden />
            <div className="lbr-str__split-inner lbr-str__split-inner--right">
              <Box id="ocupados" level={3} selected={selected} onClick={setSelected} label="Ocupados" sub={`${laborStructure.ocupados} M`} tone="good" />
              <Box id="desocupados" level={3} selected={selected} onClick={setSelected} label="Desocupados" sub={`${laborStructure.desocupados} M`} tone="bad" />
            </div>
          </div>
        </div>

        <aside className="lbr-str__info" aria-live="polite">
          <p className="lbr-str__info-tag">Seleccionado</p>
          <h3 className="lbr-str__info-title">{info.title}</h3>
          <p className="lbr-str__info-body">{info.body}</p>
          <div className="lbr-str__info-example">
            <span className="lbr-str__info-example-tag">Ejemplo</span>
            <p>{info.example}</p>
          </div>
        </aside>
      </div>

      <footer className="lbr-str__foot">
        Datos · {laborStructure.fuente} · {laborStructure.periodo} · 31 aglomerados urbanos
      </footer>
    </div>
  )
}

interface BoxProps {
  id: NodeId
  level: number
  selected: NodeId
  onClick: (id: NodeId) => void
  label: string
  sub: string
  tone?: 'muted' | 'neutral' | 'accent' | 'good' | 'bad'
}

function Box({ id, level, selected, onClick, label, sub, tone = 'neutral' }: BoxProps) {
  return (
    <button
      className="lbr-box"
      data-level={level}
      data-tone={tone}
      data-selected={selected === id}
      onClick={() => onClick(id)}
      role="treeitem"
      aria-selected={selected === id}
    >
      <span className="lbr-box__label">{label}</span>
      <span className="lbr-box__sub">{sub}</span>
    </button>
  )
}
