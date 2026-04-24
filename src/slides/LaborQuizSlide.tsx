import { useEffect, useMemo, useState } from 'react'
import './LaborQuizSlide.css'

interface Props { isActive: boolean }

type Category = 'ocupado' | 'desocupado' | 'inactivo'

interface Case {
  id: string
  emoji: string
  name: string
  story: string
  correct: Category
  explanation: string
}

const CASES: Case[] = [
  {
    id: 'ana',
    emoji: '👩‍🏫',
    name: 'Ana, 34',
    story: 'Maestra de primaria. Esta semana dio clases normalmente.',
    correct: 'ocupado',
    explanation: 'Trabajó más de 1 hora remunerada en la semana de referencia.',
  },
  {
    id: 'bruno',
    emoji: '🧑‍💻',
    name: 'Bruno, 28',
    story: 'Perdió su trabajo en enero. Desde entonces envía CVs y tuvo 3 entrevistas este mes.',
    correct: 'desocupado',
    explanation: 'No trabajó, está disponible y buscó activamente en los últimos 30 días.',
  },
  {
    id: 'clara',
    emoji: '👵',
    name: 'Clara, 68',
    story: 'Jubilada. Se dedica a su jardín y a cuidar a sus nietos.',
    correct: 'inactivo',
    explanation: 'No trabaja ni busca trabajo. Forma parte de la PEI aunque esté en la PET.',
  },
  {
    id: 'diego',
    emoji: '👨‍🎓',
    name: 'Diego, 20',
    story: 'Estudia Economía full-time. No tiene trabajo y no está buscando.',
    correct: 'inactivo',
    explanation: 'Estudiante sin empleo y sin búsqueda activa = inactivo.',
  },
  {
    id: 'elisa',
    emoji: '👩‍⚕️',
    name: 'Elisa, 42',
    story: 'Médica. Esta semana está de licencia con goce de sueldo por vacaciones.',
    correct: 'ocupado',
    explanation: 'Licencia con goce de sueldo cuenta como ocupación: mantiene vínculo laboral.',
  },
  {
    id: 'fede',
    emoji: '👨‍🔧',
    name: 'Fede, 50',
    story: 'Plomero independiente sin trabajo hace 6 meses. Se cansó de buscar y ya no envía presupuestos.',
    correct: 'inactivo',
    explanation: 'Es un "trabajador desalentado": sin búsqueda activa pasa a PEI, no a desocupado.',
  },
  {
    id: 'gaby',
    emoji: '🧑‍🍳',
    name: 'Gaby, 19',
    story: 'Ayuda a sus padres en el restaurant familiar 20 horas por semana. No recibe sueldo formal.',
    correct: 'ocupado',
    explanation: 'Trabajador familiar no remunerado también es ocupado según el INDEC.',
  },
  {
    id: 'hugo',
    emoji: '🧑‍🏭',
    name: 'Hugo, 55',
    story: 'Terminó un contrato por obra. Esta semana empezó a mandar presupuestos para el próximo.',
    correct: 'desocupado',
    explanation: 'Sin trabajo, buscando activamente y disponible → desocupado.',
  },
]

const CATEGORY_LABELS: Record<Category, string> = {
  ocupado: 'Ocupado',
  desocupado: 'Desocupado',
  inactivo: 'Inactivo',
}

export function LaborQuizSlide({ isActive }: Props) {
  const [answers, setAnswers] = useState<Record<string, Category>>({})

  useEffect(() => {
    if (!isActive) setAnswers({})
  }, [isActive])

  const { correctCount, totalAnswered } = useMemo(() => {
    let c = 0
    const t = Object.keys(answers).length
    for (const [id, ans] of Object.entries(answers)) {
      if (CASES.find((x) => x.id === id)?.correct === ans) c++
    }
    return { correctCount: c, totalAnswered: t }
  }, [answers])

  const answer = (id: string, cat: Category) => {
    setAnswers((a) => ({ ...a, [id]: cat }))
  }

  const reset = () => setAnswers({})

  return (
    <div className="lbr-quiz">
      <header className="lbr-quiz__header">
        <p className="lbr-quiz__eyebrow">Mercado de trabajo · ejercicio</p>
        <h2 className="lbr-quiz__title">¿En qué categoría entra cada persona?</h2>
        <p className="lbr-quiz__lead">
          Clasificá a estas 8 personas. Click en una de las tres categorías para cada caso. Se
          marca en verde si acertás.
        </p>
      </header>

      <div className="lbr-quiz__progress">
        <span className="lbr-quiz__score">
          Aciertos: <strong>{correctCount}</strong> / {CASES.length}
        </span>
        <span className="lbr-quiz__sub">Respondidos: {totalAnswered}</span>
        <button className="lbr-quiz__reset" onClick={reset} disabled={totalAnswered === 0}>
          Reiniciar
        </button>
      </div>

      <div className="lbr-quiz__grid">
        {CASES.map((c) => {
          const given = answers[c.id]
          const isCorrect = given === c.correct
          const answered = given !== undefined
          return (
            <article
              key={c.id}
              className="lbr-quiz__card"
              data-answered={answered}
              data-correct={answered ? isCorrect : undefined}
            >
              <header className="lbr-quiz__card-head">
                <span className="lbr-quiz__emoji" aria-hidden>{c.emoji}</span>
                <div>
                  <h4>{c.name}</h4>
                  <p>{c.story}</p>
                </div>
              </header>

              <div className="lbr-quiz__opts" role="radiogroup" aria-label={`Clasificar ${c.name}`}>
                {(['ocupado', 'desocupado', 'inactivo'] as Category[]).map((cat) => {
                  const picked = given === cat
                  const isRight = answered && cat === c.correct
                  const isWrongPick = picked && !isCorrect
                  return (
                    <button
                      key={cat}
                      className="lbr-quiz__opt"
                      data-picked={picked}
                      data-right={isRight}
                      data-wrong={isWrongPick}
                      onClick={() => answer(c.id, cat)}
                      role="radio"
                      aria-checked={picked}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  )
                })}
              </div>

              {answered && (
                <p className="lbr-quiz__expl" data-correct={isCorrect}>
                  {isCorrect ? '✓ ' : '✗ '}
                  {c.explanation}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
