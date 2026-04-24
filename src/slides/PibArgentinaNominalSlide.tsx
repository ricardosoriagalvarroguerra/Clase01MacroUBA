import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { argentinaGdpTimeSeries, type ArgentinaGdpRow } from '@/data/argentinaNominal'
import './PibArgentinaNominalSlide.css'

const fmtAr = (n: number) => d3.format(',.0f')(n)
const fmtPct = (n: number | null) => (n === null ? '—' : `${n.toFixed(1)}%`)

// Formato compacto para montos grandes en ARS
const fmtCompactArs = (n: number) => {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} B MM`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(0)} mil M MM`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(0)} M MM`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(0)}k MM`
  return String(n)
}

interface Tooltip {
  x: number
  y: number
  row: ArgentinaGdpRow
}

export function PibArgentinaNominalSlide() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 720, h: 280 })
  const [tip, setTip] = useState<Tooltip | null>(null)

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

    const data = argentinaGdpTimeSeries
    const margin = { top: 16, right: 60, bottom: 36, left: 78 }
    const w = size.w - margin.left - margin.right
    const h = size.h - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${size.w} ${size.h}`)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand<number>()
      .domain(data.map((d) => d.year))
      .range([0, w])
      .padding(0.25)

    // PIB nominal en log para evitar que 2024 aplaste todo
    const yL = d3
      .scaleLog()
      .domain([d3.min(data, (d) => d.nominal)!, d3.max(data, (d) => d.nominal)!])
      .range([h, 0])
      .nice()

    const yR = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.deflator ?? 0)! * 1.1])
      .range([h, 0])
      .nice()

    // Grid
    g.append('g')
      .attr('class', 'nx-chart__grid')
      .selectAll('line')
      .data(yR.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => yR(d)).attr('y2', (d) => yR(d))

    // Barras PIB nominal
    g.selectAll('rect.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.year)!)
      .attr('width', x.bandwidth())
      .attr('y', (d) => yL(d.nominal))
      .attr('height', (d) => h - yL(d.nominal))
      .attr('fill', 'var(--color-accent)')
      .attr('opacity', 0.85)
      .attr('rx', 2)
      .on('mousemove', function (event, d) {
        const rect = svgRef.current!.getBoundingClientRect()
        setTip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          row: d,
        })
        d3.select(this).attr('opacity', 1)
      })
      .on('mouseleave', function () {
        setTip(null)
        d3.select(this).attr('opacity', 0.85)
      })

    // Línea deflactor
    const line = d3
      .line<typeof data[number]>()
      .defined((d) => d.deflator !== null)
      .x((d) => x(d.year)! + x.bandwidth() / 2)
      .y((d) => yR(d.deflator!))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('class', 'nx-chart__line')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2)

    g.selectAll('circle.dot')
      .data(data.filter((d) => d.deflator !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d.year)! + x.bandwidth() / 2)
      .attr('cy', (d) => yR(d.deflator!))
      .attr('r', 3.5)
      .attr('fill', 'var(--color-primary)')
      .attr('stroke', 'var(--color-surface)')
      .attr('stroke-width', 1.5)

    // Área de hover invisible por año (captura todo el ancho de la banda)
    g.selectAll('rect.hover-zone')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'hover-zone')
      .attr('x', (d) => x(d.year)!)
      .attr('width', x.bandwidth())
      .attr('y', 0)
      .attr('height', h)
      .attr('fill', 'transparent')
      .on('mousemove', function (event, d) {
        const rect = svgRef.current!.getBoundingClientRect()
        setTip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          row: d,
        })
      })
      .on('mouseleave', () => setTip(null))

    // Eje X
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .attr('class', 'nx-chart__axis')
      .call(d3.axisBottom(x).tickFormat((d) => String(d)).tickSize(0))
      .call((a) => a.select('.domain').remove())

    // Eje Y izquierdo (log) — sólo potencias de 10 entre el dominio de datos
    const yLDomain = yL.domain() as [number, number]
    const minExp = Math.ceil(Math.log10(yLDomain[0]))
    const maxExp = Math.floor(Math.log10(yLDomain[1]))
    const logTicks: number[] = []
    for (let e = minExp; e <= maxExp; e++) logTicks.push(Math.pow(10, e))

    const fmtLogTick = (n: number) => {
      if (n >= 1e9) return `${(n / 1e9).toFixed(0)} Bn`
      if (n >= 1e6) return `${(n / 1e6).toFixed(0)} M`
      if (n >= 1e3) return `${(n / 1e3).toFixed(0)} k`
      return String(n)
    }
    g.append('g')
      .attr('class', 'nx-chart__axis nx-chart__axis--left')
      .call(
        d3.axisLeft(yL)
          .tickValues(logTicks)
          .tickFormat((d) => fmtLogTick(d as number))
          .tickSize(0),
      )
      .call((a) => a.select('.domain').remove())

    // Eje Y derecho (%)
    g.append('g')
      .attr('transform', `translate(${w},0)`)
      .attr('class', 'nx-chart__axis nx-chart__axis--right')
      .call(d3.axisRight(yR).ticks(5).tickFormat((d) => `${d}%`).tickSize(0))
      .call((a) => a.select('.domain').remove())

    // Etiquetas ejes
    g.append('text').attr('class', 'nx-chart__y-label')
      .attr('transform', `translate(-66,${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('PIB nominal · MM ARS · log')

    g.append('text').attr('class', 'nx-chart__y-label')
      .attr('transform', `translate(${w + 48},${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Deflactor (% y/y)')
  }, [size])

  return (
    <div className="nx">
      <header className="nx__header">
        <p className="nx__eyebrow">Caso Argentina · 2015 – 2024 · estimaciones INDEC</p>
        <h2 className="nx__title">PIB nominal e inflación del deflactor</h2>
        <p className="nx__lead">
          La alta inflación hace que el PIB medido en pesos corrientes explote.
          ¿Cuánto de ese crecimiento es producción real y cuánto son precios?
        </p>
      </header>

      <div className="nx__body">
        {/* Tabla */}
        <div className="nx__table">
          <table>
            <thead>
              <tr>
                <th>Año</th>
                <th className="num">PIB nom. (MM ARS)</th>
                <th className="num">Δ nom. y/y</th>
                <th className="num">Deflactor y/y</th>
              </tr>
            </thead>
            <tbody>
              {argentinaGdpTimeSeries.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td className="num">{fmtAr(r.nominal)}</td>
                  <td className="num">{fmtPct(r.nominalGrowth)}</td>
                  <td className="num nx__defl">{fmtPct(r.deflator)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfico */}
        <div className="nx__chart" ref={wrapRef}>
          <svg ref={svgRef} width="100%" height={size.h} />
          {tip && (
            <div
              className="nx__tooltip"
              style={{
                left: Math.min(tip.x + 12, size.w - 210),
                top: Math.max(tip.y - 8, 8),
              }}
              role="tooltip"
            >
              <div className="nx__tooltip-year">{tip.row.year}</div>
              <div className="nx__tooltip-row">
                <span className="nx__sw" style={{ background: 'var(--color-accent)' }} />
                <span className="nx__tooltip-label">PIB nominal</span>
                <span className="nx__tooltip-val">{fmtCompactArs(tip.row.nominal)}</span>
              </div>
              {tip.row.nominalGrowth !== null && (
                <div className="nx__tooltip-sub">
                  Δ y/y: <strong>{fmtPct(tip.row.nominalGrowth)}</strong>
                </div>
              )}
              <div className="nx__tooltip-row">
                <span className="nx__sw nx__sw--line" style={{ background: 'var(--color-primary)' }} />
                <span className="nx__tooltip-label">Deflactor</span>
                <span className="nx__tooltip-val">{fmtPct(tip.row.deflator)}</span>
              </div>
            </div>
          )}
          <div className="nx__legend">
            <span className="nx__legend-item">
              <span className="nx__sw" style={{ background: 'var(--color-accent)' }} />
              PIB nominal (MM ARS, escala log)
            </span>
            <span className="nx__legend-item">
              <span className="nx__sw nx__sw--line" style={{ background: 'var(--color-primary)' }} />
              Deflactor implícito (% y/y)
            </span>
          </div>
        </div>
      </div>

      <aside className="nx__note">
        <strong>Lectura:</strong> entre 2015 y 2024 el PIB nominal se multiplicó por más de 78×,
        pero eso no significa que la economía sea 78 veces más grande. La línea azul muestra el
        deflactor — la inflación promedio de la economía — por encima del 100% los últimos años.
      </aside>
    </div>
  )
}
