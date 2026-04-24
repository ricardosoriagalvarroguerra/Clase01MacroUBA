import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { argentinaGdpTimeSeries } from '@/data/argentinaNominal'
import './PibArgentinaRealSlide.css'

const fmtAr = (n: number) => d3.format(',.0f')(n)
const fmtPct = (n: number | null) => (n === null ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(1)}%`)

export function PibArgentinaRealSlide() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 720, h: 280 })
  const [highlightYear, setHighlightYear] = useState<number | null>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(360, Math.floor(e.contentRect.width))
        const vh = window.innerHeight
        const h = Math.max(220, Math.min(Math.round(w * 0.42), vh * 0.42))
        setSize({ w, h })
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const data = argentinaGdpTimeSeries.filter(
      (d) => d.nominalGrowth !== null && d.realGrowth !== null,
    )

    const margin = { top: 16, right: 16, bottom: 36, left: 52 }
    const w = size.w - margin.left - margin.right
    const h = size.h - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${size.w} ${size.h}`)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x0 = d3
      .scaleBand<number>()
      .domain(data.map((d) => d.year))
      .range([0, w])
      .padding(0.22)

    const x1 = d3
      .scaleBand<string>()
      .domain(['nominal', 'real'])
      .range([0, x0.bandwidth()])
      .padding(0.08)

    const yMin = Math.min(0, d3.min(data, (d) => d.realGrowth!)!) * 1.1
    const yMax = d3.max(data, (d) => d.nominalGrowth!)! * 1.05

    const y = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]).nice()

    // Grid
    g.append('g')
      .attr('class', 'rx-chart__grid')
      .selectAll('line')
      .data(y.ticks(6))
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))

    // Barras
    const groups = g.append('g').selectAll('g.group')
      .data(data).enter().append('g')
      .attr('class', 'group')
      .attr('transform', (d) => `translate(${x0(d.year)},0)`)

    groups.append('rect')
      .attr('x', x1('nominal')!)
      .attr('width', x1.bandwidth())
      .attr('y', (d) => y(Math.max(0, d.nominalGrowth!)))
      .attr('height', (d) => Math.abs(y(d.nominalGrowth!) - y(0)))
      .attr('fill', 'var(--color-accent)')
      .attr('opacity', 0.9)
      .attr('rx', 2)
      .on('mousemove', (_, d) => setHighlightYear(d.year))
      .on('mouseleave', () => setHighlightYear(null))

    groups.append('rect')
      .attr('x', x1('real')!)
      .attr('width', x1.bandwidth())
      .attr('y', (d) => y(Math.max(0, d.realGrowth!)))
      .attr('height', (d) => Math.abs(y(d.realGrowth!) - y(0)))
      .attr('fill', 'var(--color-primary)')
      .attr('opacity', 0.9)
      .attr('rx', 2)
      .on('mousemove', (_, d) => setHighlightYear(d.year))
      .on('mouseleave', () => setHighlightYear(null))

    // Ejes
    g.append('g')
      .attr('transform', `translate(0,${y(0)})`)
      .attr('class', 'rx-chart__axis')
      .call(d3.axisBottom(x0).tickFormat((d) => String(d)).tickSize(0))
      .call((a) => a.select('.domain').remove())

    g.append('g')
      .attr('class', 'rx-chart__axis')
      .call(d3.axisLeft(y).ticks(6).tickFormat((d) => `${d}%`).tickSize(0))
      .call((a) => a.select('.domain').remove())

    // Línea cero
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', 'var(--color-text)')
      .attr('opacity', 0.4)
  }, [size])

  return (
    <div className="rx">
      <header className="rx__header">
        <p className="rx__eyebrow">Caso Argentina · cálculo del PIB real</p>
        <h2 className="rx__title">Aislando el efecto cantidad</h2>
        <p className="rx__lead">
          Deflactando el PIB nominal por el índice de precios implícito, obtenemos el PIB real
          a precios constantes de 2015. La comparación es reveladora.
        </p>
      </header>

      <div className="rx__body">
        {/* Tabla ampliada */}
        <div className="rx__table">
          <table>
            <thead>
              <tr>
                <th>Año</th>
                <th className="num">PIB nom.</th>
                <th className="num">Δ nom.</th>
                <th className="num">Defl.</th>
                <th className="num rx__real-col">PIB real 2015</th>
                <th className="num rx__real-col">Δ real</th>
              </tr>
            </thead>
            <tbody>
              {argentinaGdpTimeSeries.map((r) => (
                <tr
                  key={r.year}
                  data-active={highlightYear === r.year}
                >
                  <td>{r.year}</td>
                  <td className="num">{fmtAr(r.nominal)}</td>
                  <td className="num">{fmtPct(r.nominalGrowth)}</td>
                  <td className="num">{fmtPct(r.deflator)}</td>
                  <td className="num rx__real-col">{fmtAr(r.real2015)}</td>
                  <td
                    className="num rx__real-col"
                    style={{
                      color: r.realGrowth === null ? undefined
                        : r.realGrowth >= 0 ? 'var(--color-primary)' : 'var(--color-danger)',
                    }}
                  >
                    {fmtPct(r.realGrowth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="rx__table-note">
            PIB real = PIB nominalₜ × (100 / Deflactor acumulado base 2015).
            Cifras en MM ARS; deflactor implícito aproximado.
          </p>
        </div>

        {/* Gráfico comparativo */}
        <div className="rx__chart" ref={wrapRef}>
          <svg ref={svgRef} width="100%" height={size.h} />
          <div className="rx__legend">
            <span className="rx__legend-item">
              <span className="rx__sw" style={{ background: 'var(--color-accent)' }} />
              Crecimiento nominal
            </span>
            <span className="rx__legend-item">
              <span className="rx__sw" style={{ background: 'var(--color-primary)' }} />
              Crecimiento real
            </span>
          </div>
        </div>
      </div>

      <aside className="rx__note">
        <strong>Conclusión didáctica:</strong> entre 2015 y 2024 el PIB <em>nominal</em>
        {' '}creció más de <strong>+7 800%</strong>, pero el PIB <em>real</em> cayó alrededor de
        {' '}<strong>−2,5%</strong> acumulado. Todo el "crecimiento" nominal es inflación.
      </aside>
    </div>
  )
}
