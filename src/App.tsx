import { useMemo } from 'react'
import { useSlideNav } from '@/hooks/useSlideNav'
import { NavControls } from '@/components/NavControls'
import { HomeSlide } from '@/slides/HomeSlide'
import { SectionTitleSlide } from '@/slides/SectionTitleSlide'
import { StockFlowIntroSlide } from '@/slides/StockFlowIntroSlide'
import { StockFlowExamplesSlide } from '@/slides/StockFlowExamplesSlide'
import { StockFlowRelationSlide } from '@/slides/StockFlowRelationSlide'
import { PibFormulaSlide } from '@/slides/PibFormulaSlide'
import { PibConceptSlide } from '@/slides/PibConceptSlide'
import { PibNominalRealIntroSlide } from '@/slides/PibNominalRealIntroSlide'
import { PibNominalRealExampleSlide } from '@/slides/PibNominalRealExampleSlide'
import { PibArgentinaNominalSlide } from '@/slides/PibArgentinaNominalSlide'
import { PibArgentinaRealSlide } from '@/slides/PibArgentinaRealSlide'
import { PibPerCapitaSlide } from '@/slides/PibPerCapitaSlide'
import { ArgentinaGdpSlide } from '@/slides/ArgentinaGdpSlide'

interface SlideDef {
  id: string
  render: (isActive: boolean) => React.ReactNode
}

const slides: SlideDef[] = [
  { id: 'home', render: () => <HomeSlide /> },
  {
    id: 'section-01',
    render: () => <SectionTitleSlide number="01" title="Medir la actividad" />,
  },
  { id: 'stock-flow-intro', render: (isActive) => <StockFlowIntroSlide isActive={isActive} /> },
  { id: 'stock-flow-examples', render: (isActive) => <StockFlowExamplesSlide isActive={isActive} /> },
  { id: 'stock-flow-relation', render: (isActive) => <StockFlowRelationSlide isActive={isActive} /> },
  { id: 'pib-formula', render: (isActive) => <PibFormulaSlide isActive={isActive} /> },
  { id: 'pib-concept', render: (isActive) => <PibConceptSlide isActive={isActive} /> },
  { id: 'pib-nominal-real-intro', render: (isActive) => <PibNominalRealIntroSlide isActive={isActive} /> },
  { id: 'pib-nominal-real-example', render: (isActive) => <PibNominalRealExampleSlide isActive={isActive} /> },
  { id: 'pib-argentina-nominal', render: () => <PibArgentinaNominalSlide /> },
  { id: 'pib-argentina-real', render: () => <PibArgentinaRealSlide /> },
  { id: 'pib-per-capita', render: () => <PibPerCapitaSlide /> },
  { id: 'argentina-gdp', render: () => <ArgentinaGdpSlide /> },
]

export default function App() {
  const slideIds = useMemo(() => slides.map((s) => s.id), [])
  const { activeIndex, next, prev, goTo } = useSlideNav(slideIds)

  return (
    <>
      <div className="deck">
        {slides.map((s, i) => (
          <section
            key={s.id}
            className="slide"
            data-slide-id={s.id}
            data-active={i === activeIndex}
          >
            <div className="slide__inner">{s.render(i === activeIndex)}</div>
          </section>
        ))}
      </div>
      <NavControls
        activeIndex={activeIndex}
        total={slides.length}
        onPrev={prev}
        onNext={next}
        onDot={goTo}
      />
    </>
  )
}
