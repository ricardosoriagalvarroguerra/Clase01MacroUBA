import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  gdpByExpenditure,
  gdpBySector,
  expenditureKeys,
  expenditureLabels,
  expenditureColors,
  sectorKeys,
  sectorColors,
} from '@/data/argentinaGdp'
import './ArgentinaGdpSlide.css'

type Mode = 'gasto' | 'sector'
type Unit = 'usd' | 'pct'

interface Tooltip {
  x: number
  y: number
  year: number
  key: string
  value: number
  pct: number
}

export function ArgentinaGdpSlide() {
  const [mode, setMode] = useState<Mode>('gasto')
  const [unit, setUnit] = useState<Unit>('usd')
  const [tip, setTip] = useState<Tooltip | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 900, h: 360 })

  // Responsive container — alto adaptativo según ancho y viewport
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width } = e.contentRect
        const vh = window.innerHeight
        const h = Math.max(260, Math.min(Math.round(width * 0.42), vh * 0.48))
        setSize({ w: Math.max(420, Math.floor(width)), h })
      }
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const { data, keys, colors, labels } = useMemo(() => {
    if (mode === 'gasto') {
      return {
        data: gdpByExpenditure.map((r) => ({ ...r })) as Array<Record<string, number>>,
        keys: [...expenditureKeys] as string[],
        colors: expenditureColors,
        labels: expenditureLabels,
      }
    }
    const lbls: Record<string, string> = Object.fromEntries(sectorKeys.map((k) => [k, k]))
    return {
      data: gdpBySector as unknown as Array<Record<string, number>>,
      keys: sectorKeys,
      colors: sectorColors,
      labels: lbls,
    }
  }, [mode])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 44, left: 68 }
    const width = size.w - margin.left - margin.right
    const height = size.h - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 ${size.w} ${size.h}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Compute totals (abs sum of positives) per year for % mode scaling
    const yearTotals: Record<number, number> = {}
    for (const row of data) {
      yearTotals[row.year] = keys.reduce((acc, k) => acc + Math.max(0, row[k] as number), 0)
    }

    // Transform values for unit
    const working = data.map((row) => {
      const out: Record<string, number> = { year: row.year }
      for (const k of keys) {
        const v = row[k] as number
        out[k] = unit === 'pct' ? (v / yearTotals[row.year]) * 100 : v
      }
      return out
    })

    const stack = d3
      .stack<Record<string, number>>()
      .keys(keys)
      .offset(d3.stackOffsetDiverging)
    const series = stack(working)

    const yMin = d3.min(series, (s) => d3.min(s, (d) => d[0])) ?? 0
    const yMax = d3.max(series, (s) => d3.max(s, (d) => d[1])) ?? 0

    const x = d3
      .scaleBand<number>()
      .domain(working.map((d) => d.year))
      .range([0, width])
      .padding(0.22)

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, yMin) * 1.05, yMax * 1.05])
      .nice()
      .range([height, 0])

    // Grid
    const yTicks = y.ticks(6)
    g.append('g')
      .attr('class', 'gdp-chart__grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))

    // Axis X
    g.append('g')
      .attr('class', 'gdp-chart__axis gdp-chart__axis--x')
      .attr('transform', `translate(0,${y(0)})`)
      .call(d3.axisBottom(x).tickFormat((d) => String(d)).tickSize(0))
      .call((gAxis) => gAxis.select('.domain').remove())

    // Baseline 0
    g.append('line')
      .attr('class', 'gdp-chart__zero')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))

    // Axis Y
    const yFmt = unit === 'pct' ? (v: number) => `${d3.format('.0f')(v)}%` : (v: number) => d3.format(',.0f')(v)
    g.append('g')
      .attr('class', 'gdp-chart__axis gdp-chart__axis--y')
      .call(d3.axisLeft(y).tickValues(yTicks).tickFormat((d) => yFmt(d as number)).tickSize(0))
      .call((gAxis) => gAxis.select('.domain').remove())

    // Axis Y label
    g.append('text')
      .attr('class', 'gdp-chart__y-label')
      .attr('transform', `translate(-52,${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(unit === 'pct' ? '% del total' : 'USD MM (corrientes)')

    // Bars
    const groups = g
      .append('g')
      .selectAll('g.series')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'series')
      .attr('fill', (d) => colors[d.key as string] ?? '#888')

    groups
      .selectAll('rect')
      .data((s) =>
        s.map((d) => ({
          key: s.key as string,
          year: d.data.year as number,
          v0: d[0],
          v1: d[1],
          raw: data.find((r) => r.year === (d.data.year as number))![s.key as string] as number,
        })),
      )
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.year)!)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(Math.max(d.v0, d.v1)))
      .attr('height', (d) => Math.abs(y(d.v0) - y(d.v1)))
      .attr('rx', 2)
      .on('mousemove', function (event, d) {
        const svgRect = svgRef.current!.getBoundingClientRect()
        const pxPct = (d.raw / (yearTotals[d.year] || 1)) * 100
        setTip({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top,
          year: d.year,
          key: d.key,
          value: d.raw,
          pct: pxPct,
        })
        d3.select(this).attr('opacity', 0.8)
      })
      .on('mouseleave', function () {
        setTip(null)
        d3.select(this).attr('opacity', 1)
      })
  }, [data, keys, colors, unit, size])

  return (
    <div className="gdp-slide">
      <header className="gdp-slide__header">
        <p className="gdp-slide__eyebrow">Datos · INDEC / FMI (USD corrientes)</p>
        <h2 className="gdp-slide__title">Argentina · PIB 2015 – 2025</h2>
        <p className="gdp-slide__lead">
          Descomposición interactiva por componente del gasto y por sector productivo (VAB).
        </p>
      </header>

      <div className="gdp-slide__controls">
        <div className="gdp-toggle" role="tablist" aria-label="Vista">
          <button
            role="tab"
            aria-selected={mode === 'gasto'}
            className="gdp-toggle__btn"
            data-active={mode === 'gasto'}
            onClick={() => setMode('gasto')}
          >
            Por gasto
          </button>
          <button
            role="tab"
            aria-selected={mode === 'sector'}
            className="gdp-toggle__btn"
            data-active={mode === 'sector'}
            onClick={() => setMode('sector')}
          >
            Por sector
          </button>
        </div>

        <div className="gdp-toggle" role="tablist" aria-label="Unidad">
          <button
            role="tab"
            aria-selected={unit === 'usd'}
            className="gdp-toggle__btn"
            data-active={unit === 'usd'}
            onClick={() => setUnit('usd')}
          >
            USD MM
          </button>
          <button
            role="tab"
            aria-selected={unit === 'pct'}
            className="gdp-toggle__btn"
            data-active={unit === 'pct'}
            onClick={() => setUnit('pct')}
          >
            % del total
          </button>
        </div>
      </div>

      <div className="gdp-slide__chart" ref={wrapRef}>
        <svg ref={svgRef} width="100%" height={size.h} />
        {tip && (
          <div
            className="gdp-tooltip"
            style={{ left: tip.x + 12, top: tip.y + 12 }}
            role="tooltip"
          >
            <div className="gdp-tooltip__year">{tip.year}</div>
            <div className="gdp-tooltip__key">
              <span
                className="gdp-tooltip__swatch"
                style={{ background: colors[tip.key] }}
              />
              {labels[tip.key]}
            </div>
            <div className="gdp-tooltip__val">
              {d3.format(',.0f')(tip.value)} USD MM
              <span className="gdp-tooltip__pct">({d3.format('.1f')(tip.pct)}%)</span>
            </div>
          </div>
        )}
      </div>

      <div className="gdp-legend">
        {keys.map((k) => (
          <div key={k} className="gdp-legend__item">
            <span className="gdp-legend__swatch" style={{ background: colors[k] }} />
            <span className="gdp-legend__label">{labels[k]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
