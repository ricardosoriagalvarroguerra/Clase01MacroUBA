import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  countriesGdp,
  getExpenditureData,
  getSectorData,
  expenditureKeys,
  expenditureLabels,
  expenditureColors,
  sectorKeys,
  sectorColors,
  type CountrySeries,
} from '@/data/countriesGdp'
import './CountriesGdpSlide.css'

type ViewMode = 'total' | 'gasto' | 'sector'
type Unit = 'usd' | 'pct'

interface ChartDeps {
  country: CountrySeries
  mode?: ViewMode
  unit?: Unit
  compact: boolean
}

function useSize<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [size, setSize] = useState({ w: 400, h: 220 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        setSize({ w: Math.max(260, Math.floor(width)), h: Math.max(160, Math.floor(height)) })
      }
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function formatUsd(v: number, compact: boolean) {
  if (compact) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}B`
    return `${Math.round(v)}`
  }
  return d3.format(',.0f')(v)
}

function GdpChart({ country, mode = 'total', unit = 'usd', compact }: ChartDeps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const size = useSize(wrapRef)
  const [tip, setTip] = useState<{ x: number; y: number; year: number; key: string; value: number; pct: number } | null>(null)

  const config = useMemo(() => {
    if (mode === 'gasto') {
      return {
        data: getExpenditureData(country.id) as unknown as Array<Record<string, number>>,
        keys: [...expenditureKeys] as string[],
        colors: expenditureColors as Record<string, string>,
        labels: expenditureLabels as Record<string, string>,
        stacked: true,
      }
    }
    if (mode === 'sector') {
      const lbls: Record<string, string> = Object.fromEntries(sectorKeys.map((k) => [k, k]))
      return {
        data: getSectorData(country.id) as unknown as Array<Record<string, number>>,
        keys: [...sectorKeys] as string[],
        colors: sectorColors,
        labels: lbls,
        stacked: true,
      }
    }
    return {
      data: country.data.map((r) => ({ year: r.year, gdp: r.gdp })) as Array<Record<string, number>>,
      keys: ['gdp'],
      colors: { gdp: country.color },
      labels: { gdp: 'PIB (USD MM)' } as Record<string, string>,
      stacked: false,
    }
  }, [country, mode])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = compact
      ? { top: 10, right: 10, bottom: 24, left: 40 }
      : { top: 18, right: 20, bottom: 40, left: 60 }

    const width = size.w - margin.left - margin.right
    const height = size.h - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 ${size.w} ${size.h}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const yearTotals: Record<number, number> = {}
    for (const row of config.data) {
      yearTotals[row.year] = config.keys.reduce((acc, k) => acc + Math.max(0, row[k] as number), 0)
    }

    // Si unit === 'pct' y estamos en stacked, transformamos a % del total del año
    const workingData =
      unit === 'pct' && config.stacked
        ? config.data.map((row) => {
            const out: Record<string, number> = { year: row.year }
            const t = yearTotals[row.year] || 1
            for (const k of config.keys) {
              out[k] = ((row[k] as number) / t) * 100
            }
            return out
          })
        : config.data

    const stack = d3.stack<Record<string, number>>().keys(config.keys).offset(d3.stackOffsetDiverging)
    const series = stack(workingData)

    const yMin = d3.min(series, (s) => d3.min(s, (d) => d[0])) ?? 0
    const yMax = d3.max(series, (s) => d3.max(s, (d) => d[1])) ?? 0

    const x = d3
      .scaleBand<number>()
      .domain(workingData.map((d) => d.year as number))
      .range([0, width])
      .padding(0.22)

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, yMin) * 1.05, yMax * 1.05])
      .nice()
      .range([height, 0])

    const yTicks = y.ticks(compact ? 4 : 6)
    g.append('g')
      .attr('class', 'cgdp-grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))

    const xFmt = (d: number) => (compact ? String(d).slice(2) : String(d))
    g.append('g')
      .attr('class', 'cgdp-axis cgdp-axis--x')
      .attr('transform', `translate(0,${y(0)})`)
      .call(d3.axisBottom(x).tickFormat((d) => xFmt(d as number)).tickSize(0))
      .call((gAxis) => gAxis.select('.domain').remove())

    g.append('line')
      .attr('class', 'cgdp-zero')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))

    const yFmt = (v: number) =>
      unit === 'pct' && config.stacked ? `${d3.format('.0f')(v)}%` : formatUsd(v, compact)

    g.append('g')
      .attr('class', 'cgdp-axis cgdp-axis--y')
      .call(
        d3
          .axisLeft(y)
          .tickValues(yTicks)
          .tickFormat((d) => yFmt(d as number))
          .tickSize(0),
      )
      .call((gAxis) => gAxis.select('.domain').remove())

    if (!compact) {
      g.append('text')
        .attr('class', 'cgdp-y-label')
        .attr('transform', `translate(-46,${height / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(unit === 'pct' && config.stacked ? '% del total anual' : 'USD mil millones (corrientes)')
    }

    const groups = g
      .append('g')
      .selectAll('g.cgdp-series')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'cgdp-series')
      .attr('fill', (d) => config.colors[d.key as string] ?? '#888')

    groups
      .selectAll('rect')
      .data((s) =>
        s.map((d) => ({
          key: s.key as string,
          year: d.data.year as number,
          v0: d[0],
          v1: d[1],
          raw: config.data.find((r) => r.year === (d.data.year as number))![s.key as string] as number,
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
        const total = yearTotals[d.year] || 1
        setTip({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top,
          year: d.year,
          key: d.key,
          value: d.raw,
          pct: (d.raw / total) * 100,
        })
        d3.select(this).attr('opacity', 0.8)
      })
      .on('mouseleave', function () {
        setTip(null)
        d3.select(this).attr('opacity', 1)
      })
  }, [config, size, compact, unit])

  return (
    <div className="cgdp-chart" ref={wrapRef}>
      <svg ref={svgRef} width="100%" height="100%" />
      {tip && (
        <div className="cgdp-tooltip" style={{ left: tip.x + 12, top: tip.y + 12 }}>
          <div className="cgdp-tooltip__year">{tip.year}</div>
          <div className="cgdp-tooltip__key">
            <span className="cgdp-tooltip__swatch" style={{ background: config.colors[tip.key] }} />
            {config.labels[tip.key]}
          </div>
          <div className="cgdp-tooltip__val">
            {d3.format(',.0f')(tip.value)} USD MM
            {config.stacked && (
              <span className="cgdp-tooltip__pct">({d3.format('.1f')(tip.pct)}%)</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface CardProps {
  country: CountrySeries
  onExpand: () => void
}

function CountryCard({ country, onExpand }: CardProps) {
  const [mode, setMode] = useState<ViewMode>('total')
  const [unit, setUnit] = useState<Unit>('usd')
  const stacked = mode !== 'total'
  const effectiveUnit = stacked ? unit : 'usd'
  const last = country.data[country.data.length - 1]
  const first = country.data[0]
  const growth = ((last.gdp / first.gdp - 1) * 100).toFixed(1)

  return (
    <article className="cgdp-card">
      <header className="cgdp-card__head">
        <div className="cgdp-card__title">
          <span className="cgdp-card__flag">{country.flag}</span>
          <h3>{country.name}</h3>
        </div>
        <div className="cgdp-card__meta">
          <span className="cgdp-card__value">{d3.format(',.0f')(last.gdp)} USD MM</span>
          <span className="cgdp-card__growth" data-neg={Number(growth) < 0}>
            {Number(growth) >= 0 ? '+' : ''}
            {growth}% · {first.year}–{last.year}
          </span>
        </div>
        <button className="cgdp-card__expand" onClick={onExpand} aria-label="Ver en pantalla completa">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </button>
      </header>

      <div className="cgdp-card__toggles">
        <div className="cgdp-toggle" role="tablist" aria-label="Vista">
          {(['total', 'gasto', 'sector'] as ViewMode[]).map((m) => (
            <button
              key={m}
              className="cgdp-toggle__btn"
              data-active={mode === m}
              onClick={() => setMode(m)}
            >
              {m === 'total' ? 'Total' : m === 'gasto' ? 'Gasto' : 'Sector'}
            </button>
          ))}
        </div>
        <div className="cgdp-toggle" role="tablist" aria-label="Unidad" data-disabled={!stacked}>
          <button
            className="cgdp-toggle__btn"
            data-active={effectiveUnit === 'usd'}
            onClick={() => setUnit('usd')}
            disabled={!stacked}
          >
            USD
          </button>
          <button
            className="cgdp-toggle__btn"
            data-active={effectiveUnit === 'pct'}
            onClick={() => setUnit('pct')}
            disabled={!stacked}
          >
            %
          </button>
        </div>
      </div>

      <GdpChart country={country} mode={mode} unit={effectiveUnit} compact />

      <footer className="cgdp-card__foot">
        <span>{country.source}</span>
      </footer>
    </article>
  )
}

interface ModalProps {
  country: CountrySeries
  onClose: () => void
}

function FullscreenModal({ country, onClose }: ModalProps) {
  const [mode, setMode] = useState<ViewMode>('total')
  const [unit, setUnit] = useState<Unit>('usd')
  const stacked = mode !== 'total'
  const effectiveUnit = stacked ? unit : 'usd'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const legendKeys =
    mode === 'gasto'
      ? expenditureKeys.map((k) => ({ k: k as string, label: expenditureLabels[k], color: expenditureColors[k] }))
      : mode === 'sector'
        ? sectorKeys.map((k) => ({ k: k as string, label: k as string, color: sectorColors[k] }))
        : []

  return (
    <div className="cgdp-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cgdp-modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="cgdp-modal__head">
          <div>
            <p className="cgdp-modal__eyebrow">PIB USD corrientes · {country.source}</p>
            <h2 className="cgdp-modal__title">
              <span className="cgdp-modal__flag">{country.flag}</span>
              {country.name} · {country.data[0].year}–{country.data[country.data.length - 1].year}
            </h2>
          </div>
          <div className="cgdp-modal__actions">
            <div className="cgdp-toggle" role="tablist" aria-label="Vista">
              {(['total', 'gasto', 'sector'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  className="cgdp-toggle__btn"
                  data-active={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === 'total' ? 'Total' : m === 'gasto' ? 'Por gasto' : 'Por sector'}
                </button>
              ))}
            </div>
            <div className="cgdp-toggle" role="tablist" aria-label="Unidad" data-disabled={!stacked}>
              <button
                className="cgdp-toggle__btn"
                data-active={effectiveUnit === 'usd'}
                onClick={() => setUnit('usd')}
                disabled={!stacked}
              >
                USD MM
              </button>
              <button
                className="cgdp-toggle__btn"
                data-active={effectiveUnit === 'pct'}
                onClick={() => setUnit('pct')}
                disabled={!stacked}
              >
                % del total
              </button>
            </div>
            <button className="cgdp-modal__close" onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>
        </header>

        <div className="cgdp-modal__chart">
          <GdpChart country={country} mode={mode} unit={effectiveUnit} compact={false} />
        </div>

        {legendKeys.length > 0 && (
          <div className="cgdp-legend">
            {legendKeys.map(({ k, label, color }) => (
              <div key={k} className="cgdp-legend__item">
                <span className="cgdp-legend__swatch" style={{ background: color }} />
                <span className="cgdp-legend__label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function CountriesGdpSlide() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const orderedIds = ['usa', 'mex', 'bra', 'esp', 'sgp', 'chn']
  const ordered = orderedIds
    .map((id) => countriesGdp.find((c) => c.id === id)!)
    .filter(Boolean)

  return (
    <div className="cgdp-slide">
      <header className="cgdp-slide__header">
        <p className="cgdp-slide__eyebrow">PIB comparado · 2015 – 2024</p>
        <h2 className="cgdp-slide__title">PIB nominal — selección de países</h2>
        <p className="cgdp-slide__lead">
          Seis economías contrastadas con desagregación por componente del gasto (C + G + FBKF + ΔExist + X−M)
          y por sector productivo (VAB). Todos los valores en USD corrientes. Click en un card para verlo en pantalla completa.
        </p>
      </header>

      <div className="cgdp-grid">
        {ordered.map((c) => (
          <CountryCard key={c.id} country={c} onExpand={() => setExpanded(c.id)} />
        ))}
      </div>

      {expanded && (
        <FullscreenModal
          country={countriesGdp.find((c) => c.id === expanded)!}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  )
}
