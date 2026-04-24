import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { argentinaUnemployment } from '@/data/argentinaUnemployment'
import './ArgentinaUnemploymentSlide.css'

interface Tip {
  x: number
  y: number
  year: number
  rate: number
  note?: string
}

export function ArgentinaUnemploymentSlide() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 900, h: 360 })
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width } = e.contentRect
        const vh = window.innerHeight
        const h = Math.max(240, Math.min(Math.round(width * 0.42), vh * 0.48))
        setSize({ w: Math.max(420, Math.floor(width)), h })
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 28, bottom: 40, left: 44 }
    const width = size.w - margin.left - margin.right
    const height = size.h - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 ${size.w} ${size.h}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const data = argentinaUnemployment

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, Math.ceil((d3.max(data, (d) => d.rate) ?? 18) + 2)])
      .nice()
      .range([height, 0])

    // Grid
    const yTicks = y.ticks(6)
    g.append('g')
      .attr('class', 'une-grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))

    g.append('g')
      .attr('class', 'une-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(data.length, 11))
          .tickFormat((d) => String(d))
          .tickSize(0),
      )
      .call((gAxis) => gAxis.select('.domain').remove())

    g.append('g')
      .attr('class', 'une-axis')
      .call(
        d3
          .axisLeft(y)
          .tickValues(yTicks)
          .tickFormat((d) => `${d}%`)
          .tickSize(0),
      )
      .call((gAxis) => gAxis.select('.domain').remove())

    // Area
    const area = d3
      .area<(typeof data)[number]>()
      .x((d) => x(d.year))
      .y0(height)
      .y1((d) => y(d.rate))
      .curve(d3.curveMonotoneX)

    g.append('path').datum(data).attr('class', 'une-area').attr('d', area)

    // Line
    const line = d3
      .line<(typeof data)[number]>()
      .x((d) => x(d.year))
      .y((d) => y(d.rate))
      .curve(d3.curveMonotoneX)

    g.append('path').datum(data).attr('class', 'une-line').attr('d', line)

    // Dots
    g.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'une-dot')
      .attr('cx', (d) => x(d.year))
      .attr('cy', (d) => y(d.rate))
      .attr('r', (d) => (d.note ? 5 : 3.5))
      .classed('une-dot--flag', (d) => !!d.note)
      .on('mousemove', function (event, d) {
        const rect = svgRef.current!.getBoundingClientRect()
        setTip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          year: d.year,
          rate: d.rate,
          note: d.note,
        })
        d3.select(this).attr('r', 6.5)
      })
      .on('mouseleave', function (_e, d) {
        setTip(null)
        d3.select(this).attr('r', d.note ? 5 : 3.5)
      })

    // Annotations
    const annotations = data.filter((d) => d.note)
    g.append('g')
      .selectAll('text.une-annot')
      .data(annotations)
      .enter()
      .append('text')
      .attr('class', 'une-annot')
      .attr('x', (d) => x(d.year))
      .attr('y', (d) => y(d.rate) - 10)
      .attr('text-anchor', (d) => (d.year < 2010 ? 'start' : 'middle'))
      .text((d) => d.note!)
  }, [size])

  const minYear = argentinaUnemployment[0].year
  const maxYear = argentinaUnemployment[argentinaUnemployment.length - 1].year
  const min = argentinaUnemployment.reduce((a, b) => (a.rate < b.rate ? a : b))
  const max = argentinaUnemployment.reduce((a, b) => (a.rate > b.rate ? a : b))
  const last = argentinaUnemployment[argentinaUnemployment.length - 1]

  return (
    <div className="une-slide">
      <header className="une-slide__header">
        <p className="une-slide__eyebrow">Argentina · Tasa de desempleo</p>
        <h2 className="une-slide__title">El desempleo argentino, {minYear}–{maxYear}</h2>
        <p className="une-slide__lead">
          Promedios anuales de la EPH del INDEC. Se marcan los picos y los episodios relevantes.
          Hover en los puntos para ver el valor exacto.
        </p>
      </header>

      <div className="une-stats">
        <div className="une-stats__item">
          <span className="une-stats__tag">Mínimo</span>
          <span className="une-stats__val">{min.rate.toFixed(1)}%</span>
          <span className="une-stats__year">en {min.year}</span>
        </div>
        <div className="une-stats__item">
          <span className="une-stats__tag">Máximo</span>
          <span className="une-stats__val une-stats__val--bad">{max.rate.toFixed(1)}%</span>
          <span className="une-stats__year">en {max.year}</span>
        </div>
        <div className="une-stats__item">
          <span className="une-stats__tag">Último dato</span>
          <span className="une-stats__val">{last.rate.toFixed(1)}%</span>
          <span className="une-stats__year">{last.year}</span>
        </div>
      </div>

      <div className="une-chart" ref={wrapRef}>
        <svg ref={svgRef} width="100%" height={size.h} />
        {tip && (
          <div className="une-tooltip" style={{ left: tip.x + 12, top: tip.y + 12 }}>
            <div className="une-tooltip__year">{tip.year}</div>
            <div className="une-tooltip__rate">{tip.rate.toFixed(1)}%</div>
            {tip.note && <div className="une-tooltip__note">{tip.note}</div>}
          </div>
        )}
      </div>

      <aside className="une-note">
        <strong>Lectura conjunta.</strong> Baja del desempleo sola no alcanza: si se acompaña de caída en
        la tasa de actividad, puede ser que haya más <em>desalentados</em>. En 2024 la caída fue más
        por menor empleo formal que por dinamismo del mercado.
      </aside>
    </div>
  )
}
