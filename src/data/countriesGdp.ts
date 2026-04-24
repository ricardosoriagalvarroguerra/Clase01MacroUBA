// PIB nominal en USD miles de millones — USD corrientes (current US$)
// Fuente primaria: World Bank · indicador NY.GDP.MKTP.CD · rango 2015–2024
// Validado contra API oficial: https://api.worldbank.org/v2/country/…/indicator/NY.GDP.MKTP.CD

export interface CountryGdpRow {
  year: number
  gdp: number // USD mil millones
}

export interface CountrySeries {
  id: string
  name: string
  flag: string
  color: string
  source: string
  data: CountryGdpRow[]
}

export const countriesGdp: CountrySeries[] = [
  {
    id: 'usa',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    color: '#1f4e4a',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 18206 },
      { year: 2016, gdp: 18695 },
      { year: 2017, gdp: 19477 },
      { year: 2018, gdp: 20533 },
      { year: 2019, gdp: 21381 },
      { year: 2020, gdp: 21060 },
      { year: 2021, gdp: 23315 },
      { year: 2022, gdp: 25605 },
      { year: 2023, gdp: 27292 },
      { year: 2024, gdp: 28751 },
    ],
  },
  {
    id: 'mex',
    name: 'México',
    flag: '🇲🇽',
    color: '#c89f3c',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 1213 },
      { year: 2016, gdp: 1112 },
      { year: 2017, gdp: 1191 },
      { year: 2018, gdp: 1256 },
      { year: 2019, gdp: 1304 },
      { year: 2020, gdp: 1121 },
      { year: 2021, gdp: 1317 },
      { year: 2022, gdp: 1467 },
      { year: 2023, gdp: 1798 },
      { year: 2024, gdp: 1856 },
    ],
  },
  {
    id: 'bra',
    name: 'Brasil',
    flag: '🇧🇷',
    color: '#2d6b65',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 1802 },
      { year: 2016, gdp: 1796 },
      { year: 2017, gdp: 2064 },
      { year: 2018, gdp: 1917 },
      { year: 2019, gdp: 1873 },
      { year: 2020, gdp: 1476 },
      { year: 2021, gdp: 1671 },
      { year: 2022, gdp: 1952 },
      { year: 2023, gdp: 2191 },
      { year: 2024, gdp: 2186 },
    ],
  },
  {
    id: 'esp',
    name: 'España',
    flag: '🇪🇸',
    color: '#a33b2a',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 1206 },
      { year: 2016, gdp: 1243 },
      { year: 2017, gdp: 1322 },
      { year: 2018, gdp: 1432 },
      { year: 2019, gdp: 1403 },
      { year: 2020, gdp: 1290 },
      { year: 2021, gdp: 1461 },
      { year: 2022, gdp: 1449 },
      { year: 2023, gdp: 1619 },
      { year: 2024, gdp: 1726 },
    ],
  },
  {
    id: 'sgp',
    name: 'Singapur',
    flag: '🇸🇬',
    color: '#8c5a3c',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 308 },
      { year: 2016, gdp: 320 },
      { year: 2017, gdp: 344 },
      { year: 2018, gdp: 377 },
      { year: 2019, gdp: 376 },
      { year: 2020, gdp: 349 },
      { year: 2021, gdp: 437 },
      { year: 2022, gdp: 509 },
      { year: 2023, gdp: 505 },
      { year: 2024, gdp: 547 },
    ],
  },
  {
    id: 'chn',
    name: 'China',
    flag: '🇨🇳',
    color: '#3e8a82',
    source: 'World Bank · NY.GDP.MKTP.CD',
    data: [
      { year: 2015, gdp: 11281 },
      { year: 2016, gdp: 11456 },
      { year: 2017, gdp: 12538 },
      { year: 2018, gdp: 14148 },
      { year: 2019, gdp: 14560 },
      { year: 2020, gdp: 14996 },
      { year: 2021, gdp: 18202 },
      { year: 2022, gdp: 18317 },
      { year: 2023, gdp: 18270 },
      { year: 2024, gdp: 18744 },
    ],
  },
]

// =============================================================
// México — desagregación por gasto (USD mil millones, corrientes)
// Fuente: INEGI/BIE, participaciones aproximadas aplicadas al PIB nominal en USD
// Participaciones típicas: C≈67%, G≈12%, FBKF≈22%, ΔExist≈1%, X−M≈-2%
// =============================================================

export interface MexExpRow {
  year: number
  C: number
  G: number
  FBKF: number
  VarExist: number
  SaldoComercial: number
}

export const mexicoByExpenditure: MexExpRow[] = [
  { year: 2015, C: 813, G: 146, FBKF: 267, VarExist: 12, SaldoComercial: -24 },
  { year: 2016, C: 745, G: 133, FBKF: 245, VarExist: 11, SaldoComercial: -22 },
  { year: 2017, C: 798, G: 143, FBKF: 262, VarExist: 12, SaldoComercial: -24 },
  { year: 2018, C: 842, G: 151, FBKF: 276, VarExist: 13, SaldoComercial: -25 },
  { year: 2019, C: 874, G: 156, FBKF: 287, VarExist: 13, SaldoComercial: -26 },
  { year: 2020, C: 751, G: 135, FBKF: 247, VarExist: 11, SaldoComercial: -22 },
  { year: 2021, C: 882, G: 158, FBKF: 290, VarExist: 13, SaldoComercial: -26 },
  { year: 2022, C: 983, G: 176, FBKF: 323, VarExist: 15, SaldoComercial: -29 },
  { year: 2023, C: 1205, G: 216, FBKF: 396, VarExist: 18, SaldoComercial: -36 },
  { year: 2024, C: 1244, G: 223, FBKF: 408, VarExist: 19, SaldoComercial: -37 },
]

export const mexExpenditureKeys = ['C', 'G', 'FBKF', 'VarExist', 'SaldoComercial'] as const
export const mexExpenditureLabels: Record<string, string> = {
  C: 'Consumo privado (C)',
  G: 'Consumo público (G)',
  FBKF: 'FBKF',
  VarExist: 'Var. existencias',
  SaldoComercial: 'Saldo comercial (X−M)',
}
export const mexExpenditureColors: Record<string, string> = {
  C: '#1f4e4a',
  G: '#2d6b65',
  FBKF: '#c89f3c',
  VarExist: '#8c5a3c',
  SaldoComercial: '#a33b2a',
}

// =============================================================
// México — desagregación por sector productivo (VAB) — USD mil millones
// Fuente: INEGI, participaciones promedio por sector (SCIAN) aplicadas al PIB
// =============================================================

export interface MexSectorRow {
  year: number
  [sector: string]: number
}

const mexSectorShares: Record<string, number> = {
  'Agricultura y ganadería': 0.034,
  'Minería (incl. petróleo)': 0.049,
  'Industria manufacturera': 0.19,
  'Electricidad, gas y agua': 0.022,
  'Construcción': 0.074,
  'Comercio': 0.192,
  'Transporte e info.': 0.083,
  'Servicios financieros': 0.042,
  'Inmobiliarios y alquiler': 0.1,
  'Servicios prof. y empr.': 0.075,
  'Educación y salud': 0.057,
  'Gobierno y defensa': 0.038,
  'Otros servicios': 0.044,
}

export const mexSectorKeys: string[] = Object.keys(mexSectorShares)

export const mexicoBySector: MexSectorRow[] = countriesGdp
  .find((c) => c.id === 'mex')!
  .data.map(({ year, gdp }) => {
    const row: MexSectorRow = { year }
    for (const k of mexSectorKeys) {
      row[k] = Math.round(gdp * mexSectorShares[k])
    }
    return row
  })

const mexSectorPalette = [
  '#1f4e4a', '#2d6b65', '#3e8a82', '#5ba89f',
  '#c89f3c', '#d4b564', '#e3c77a', '#f0d99a',
  '#8c5a3c', '#a8704e', '#c38a68', '#556661',
  '#a33b2a',
]
export const mexSectorColors: Record<string, string> = Object.fromEntries(
  mexSectorKeys.map((k, i) => [k, mexSectorPalette[i % mexSectorPalette.length]]),
)
