import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { argentinaGdpTimeSeries } from '@/data/argentinaNominal'
import './PibPerCapitaSlide.css'

// Comparación internacional — PIB per cápita USD 2024 aprox. (Banco Mundial / FMI)
const countryComparison = [
  { country: 'Suiza',    value: 105000, color: '#1f4e4a' },
  { country: 'EE. UU.',  value:  85000, color: '#2d6b65' },
  { country: 'Alemania', value:  55000, color: '#3e8a82' },
  { country: 'España',   value:  32000, color: '#5ba89f' },
  { country: 'Chile',    value:  17000, color: '#c89f3c' },
  { country: 'Argentina', value:  13892, color: '#a33b2a', highlight: true },
  { country: 'Brasil',   value:  11000, color: '#8c5a3c' },
  { country: 'México',   value:  13500, color: '#d4b564' },
]

export function PibPerCapitaSlide() {
  const lineRef = useRef<SVGSVGElement | null>(null)
  const barRef = useRef<SVGSVGElement | null>(null)
  const lineWrapRef = useRef<HTMLDivElement | null>(null)
  const barWrapRef = useRef<HTMLDivElement | null>(null)
  const [lineSize, setLineSize] = useState({ w: 520, h: 240 })
  const [barSize, setBarSize] = useState({ w: 520, h: 240 })

  useEffect(() => {
    const observe = (ref: HTMLDivElement | null, set: (s: { w: number; h: number }) => void) => {
      if (!ref) return null
      const ro = new ResizeObserver((entries) => {
        for (const e of entries) {
          const w = Math.max(320, Math.floor(e.contentRect.width))
          const vh = window.innerHeight
          const h = Math.max(200, Math.min(Math.round(w * 0.6), vh * 0.42))
          set({ w, h })
        }
      })
      ro.observe(ref)
      return ro
    }
    const ro1 = observe(lineWrapRef.current, setLineSize)
    const ro2 = observe(barWrapRef.current, setBarSize)
    return () => {
      ro1?.disconnect()
      ro2?.disconnect()
    }
  }, [])

  // Línea: Argentina PIB per cápita USD 2015-2024
  useEffect(() => {
    if (!lineRef.current) return
    const svg = d3.select(lineRef.current)
    svg.selectAll('*').remove()

    const data = argentinaGdpTimeSeries
    const margin = { top: 14, right: 14, bottom: 28, left: 48 }
    const w = lineSize.w - margin.left - margin.right
    const h = lineSize.h - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${lineSize.w} ${lineSize.h}`)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, w])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.gdpPerCapitaUsd)! * 1.1])
      .range([h, 0]).nice()

    g.append('g').attr('class', 'pc-chart__grid').selectAll('line').data(y.ticks(5))
      .enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', (d) => y(d)).attr('y2', (d) => y(d))

    const area = d3.area<typeof data[number]>()
      .x((d) => x(d.year))
      .y0(h)
      .y1((d) => y(d.gdpPerCapitaUsd))
      .curve(d3.curveMonotoneX)

    const line = d3.line<typeof data[number]>()
      .x((d) => x(d.year))
      .y((d) => y(d.gdpPerCapitaUsd))
      .curve(d3.curveMonotoneX)

    g.append('path').datum(data).attr('d', area)
      .attr('fill', 'var(--color-accent)').attr('opacity', 0.18)
    g.append('path').datum(data).attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-accent)').attr('stroke-width', 2.2)

    g.selectAll('circle').data(data).enter().append('circle')
      .attr('cx', (d) => x(d.year)).attr('cy', (d) => y(d.gdpPerCapitaUsd))
      .attr('r', 3).attr('fill', 'var(--color-accent)')

    // Etiquetas
    g.selectAll('text.label').data(data).enter().append('text')
      .attr('class', 'pc-chart__point-label')
      .attr('x', (d) => x(d.year))
      .attr('y', (d) => y(d.gdpPerCapitaUsd) - 8)
      .attr('text-anchor', 'middle')
      .text((d) => `${(d.gdpPerCapitaUsd / 1000).toFixed(1)}k`)

    g.append('g').attr('transform', `translate(0,${h})`).attr('class', 'pc-chart__axis')
      .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')).tickSize(0))
      .call((a) => a.select('.domain').remove())

    g.append('g').attr('class', 'pc-chart__axis')
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `$${(+d / 1000).toFixed(0)}k`).tickSize(0))
      .call((a) => a.select('.domain').remove())
  }, [lineSize])

  // Barras comparación internacional
  useEffect(() => {
    if (!barRef.current) return
    const svg = d3.select(barRef.current)
    svg.selectAll('*').remove()

    const data = [...countryComparison].sort((a, b) => b.value - a.value)
    const margin = { top: 10, right: 48, bottom: 18, left: 80 }
    const w = barSize.w - margin.left - margin.right
    const h = barSize.h - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${barSize.w} ${barSize.h}`)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const y = d3.scaleBand<string>().domain(data.map((d) => d.country))
      .range([0, h]).padding(0.18)
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)! * 1.1]).range([0, w])

    g.selectAll('rect').data(data).enter().append('rect')
      .attr('x', 0).attr('y', (d) => y(d.country)!)
      .attr('width', (d) => x(d.value)).attr('height', y.bandwidth())
      .attr('fill', (d) => d.color)
      .attr('opacity', (d) => d.highlight ? 1 : 0.75)
      .attr('rx', 2)

    g.selectAll('text.val').data(data).enter().append('text')
      .attr('class', 'pc-chart__bar-label')
      .attr('x', (d) => x(d.value) + 6)
      .attr('y', (d) => (y(d.country) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text((d) => `$${(d.value / 1000).toFixed(1)}k`)

    g.append('g').attr('class', 'pc-chart__axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call((a) => a.select('.domain').remove())
      .selectAll('text')
      .style('font-weight', (d) => (d === 'Argentina' ? 'bold' : 'normal'))
      .style('fill', (d) => (d === 'Argentina' ? 'var(--color-danger)' : 'var(--color-text-muted)'))
  }, [barSize])

  return (
    <div className="pc">
      <header className="pc__header">
        <p className="pc__eyebrow">PIB per cápita</p>
        <h2 className="pc__title">Del agregado al habitante</h2>
        <p className="pc__lead">
          Dividir el PIB por la población convierte un agregado en una proxy de bienestar
          promedio — imperfecta pero comparable entre países y períodos.
        </p>
      </header>

      <div className="pc__formula" aria-label="Fórmula">
        <span className="pc__formula-lhs">PIB per cápita</span>
        <span className="pc__formula-eq">=</span>
        <span className="frac">
          <span className="frac__num">PIB</span>
          <span className="frac__den">Población</span>
        </span>
      </div>

      <div className="pc__grid">
        <div className="pc__panel">
          <h3 className="pc__panel-title">Argentina · USD corrientes · 2015 – 2024</h3>
          <div className="pc__chart" ref={lineWrapRef}>
            <svg ref={lineRef} width="100%" height={lineSize.h} />
          </div>
          <p className="pc__panel-note">
            Cae de ~USD 13,8k (2015) a USD 8,5k en 2020 y recupera hacia 2024 sin superar el nivel
            inicial. Estancamiento de una década.
          </p>
        </div>

        <div className="pc__panel">
          <h3 className="pc__panel-title">Comparación internacional · USD 2024</h3>
          <div className="pc__chart" ref={barWrapRef}>
            <svg ref={barRef} width="100%" height={barSize.h} />
          </div>
          <p className="pc__panel-note">
            Argentina se ubica cerca del promedio regional pero lejos de las economías avanzadas.
          </p>
        </div>
      </div>

      <aside className="pc__caveats">
        <strong>Limitaciones.</strong>{' '}
        <span>No captura desigualdad; usa tipo de cambio que puede distorsionar (de ahí el ajuste PPA);
        no mide bienes no mercantiles (cuidado, ocio, medio ambiente).</span>
      </aside>
    </div>
  )
}
