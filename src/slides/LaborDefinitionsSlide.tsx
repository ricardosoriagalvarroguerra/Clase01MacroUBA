import './LaborDefinitionsSlide.css'

interface Category {
  id: string
  title: string
  subtitle: string
  criteria: string[]
  examples: string[]
  tone: 'good' | 'bad' | 'neutral'
}

const CATEGORIES: Category[] = [
  {
    id: 'ocupado',
    title: 'Ocupado',
    subtitle: 'Tiene trabajo',
    tone: 'good',
    criteria: [
      'Trabajó al menos 1 hora en la semana de referencia.',
      'Recibió pago monetario, en especie, o es trabajador familiar.',
      'Incluye licencias con/sin goce de sueldo.',
    ],
    examples: [
      'Docente universitaria dando clases.',
      'Delivery de aplicación (dependiente o cuentapropista).',
      'Empleada doméstica registrada.',
      'Vendedor ambulante en la vía pública.',
    ],
  },
  {
    id: 'desocupado',
    title: 'Desocupado',
    subtitle: 'No tiene, pero busca',
    tone: 'bad',
    criteria: [
      'No trabajó ni una hora en la semana de referencia.',
      'Buscó activamente empleo en los últimos 30 días.',
      'Está disponible para empezar a trabajar.',
    ],
    examples: [
      'Fue despedido y envía CVs todas las semanas.',
      'Recién graduado haciendo entrevistas.',
      'Completó obra y busca próximo contrato.',
    ],
  },
  {
    id: 'inactivo',
    title: 'Inactivo',
    subtitle: 'Ni trabaja ni busca',
    tone: 'neutral',
    criteria: [
      'No trabajó en la semana de referencia.',
      'No buscó empleo en los últimos 30 días.',
      'Puede estar disponible o no para trabajar.',
    ],
    examples: [
      'Estudiante full-time que no busca trabajo.',
      'Ama/o de casa dedicado al hogar.',
      'Jubilado o pensionado.',
      'Desalentado: dejó de buscar por creer que no encontrará.',
    ],
  },
]

export function LaborDefinitionsSlide() {
  return (
    <div className="lbr-def">
      <header className="lbr-def__header">
        <p className="lbr-def__eyebrow">Mercado de trabajo · definiciones</p>
        <h2 className="lbr-def__title">Tres categorías, tres criterios</h2>
        <p className="lbr-def__lead">
          La clasificación depende de dos preguntas: <em>¿trabajó?</em> y <em>¿buscó trabajo?</em>
          Las respuestas definen en qué grupo cae cada persona.
        </p>
      </header>

      <div className="lbr-def__grid">
        {CATEGORIES.map((c) => (
          <article key={c.id} className="lbr-def__card" data-tone={c.tone}>
            <header className="lbr-def__card-head">
              <h3>{c.title}</h3>
              <span>{c.subtitle}</span>
            </header>

            <div className="lbr-def__section">
              <p className="lbr-def__section-tag">Criterios (INDEC)</p>
              <ul className="lbr-def__list">
                {c.criteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>

            <div className="lbr-def__section">
              <p className="lbr-def__section-tag">Ejemplos</p>
              <ul className="lbr-def__list lbr-def__list--dots">
                {c.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <aside className="lbr-def__note">
        <strong>Atención al "desalentado".</strong> Una persona sin trabajo que dejó de buscar
        <em> no</em> es desocupada: pasa a ser <em>inactiva</em>. Por eso la tasa de desempleo puede
        bajar mientras cae la tasa de actividad — no siempre es buena noticia.
      </aside>
    </div>
  )
}
