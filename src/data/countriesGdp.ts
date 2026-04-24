// PIB nominal en USD miles de millones — USD corrientes (current US$)
// Totales: World Bank · NY.GDP.MKTP.CD · 2015–2024 (validado vs API oficial)
// Desagregación por gasto: shares promedio 2018–2023 (WB NE.* · OECD National Accounts)
// Desagregación por sector (VAB): shares promedio 2018–2022 (WB NV.* · OECD STAN)
// Todos los valores derivados están expresados en USD corrientes (miles de millones).

export interface CountryGdpRow {
  year: number
  gdp: number
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
// Desagregación por GASTO (C + G + FBKF + ΔExist + (X−M) = PIB)
// Shares típicos por país (WB NE.CON.PRVT.ZS, NE.CON.GOVT.ZS, NE.GDI.FTOT.ZS,
// NE.RSB.GNFS.ZS — promedio 2018–2023). Aplicados al PIB nominal en USD
// corrientes para obtener magnitudes comparables.
// =============================================================

export const expenditureKeys = ['C', 'G', 'FBKF', 'VarExist', 'SaldoComercial'] as const
export type ExpenditureKey = (typeof expenditureKeys)[number]

export const expenditureLabels: Record<ExpenditureKey, string> = {
  C: 'Consumo privado (C)',
  G: 'Consumo público (G)',
  FBKF: 'FBKF (Inversión fija)',
  VarExist: 'Var. existencias',
  SaldoComercial: 'Saldo comercial (X−M)',
}

export const expenditureColors: Record<ExpenditureKey, string> = {
  C: '#1f4e4a',
  G: '#2d6b65',
  FBKF: '#c89f3c',
  VarExist: '#8c5a3c',
  SaldoComercial: '#a33b2a',
}

// Shares (fracciones; suman 1.00). Valores calibrados al promedio 2018-2023
// publicado por el World Bank (indicadores NE.CON.PRVT.ZS, NE.CON.GOVT.ZS,
// NE.GDI.FTOT.ZS y NE.RSB.GNFS.ZS). Validados el 2026-04 contra la API oficial.
const expenditureShares: Record<string, Record<ExpenditureKey, number>> = {
  usa: { C: 0.680, G: 0.143, FBKF: 0.217, VarExist: 0.005, SaldoComercial: -0.045 },
  mex: { C: 0.683, G: 0.114, FBKF: 0.221, VarExist: 0.007, SaldoComercial: -0.025 },
  bra: { C: 0.634, G: 0.193, FBKF: 0.166, VarExist: 0.005, SaldoComercial: 0.002 },
  esp: { C: 0.559, G: 0.199, FBKF: 0.204, VarExist: 0.005, SaldoComercial: 0.033 },
  sgp: { C: 0.318, G: 0.104, FBKF: 0.219, VarExist: 0.010, SaldoComercial: 0.349 },
  chn: { C: 0.387, G: 0.170, FBKF: 0.417, VarExist: 0.010, SaldoComercial: 0.016 },
}

export interface ExpenditureRow {
  year: number
  C: number
  G: number
  FBKF: number
  VarExist: number
  SaldoComercial: number
}

export function getExpenditureData(countryId: string): ExpenditureRow[] {
  const country = countriesGdp.find((c) => c.id === countryId)
  if (!country) return []
  const shares = expenditureShares[countryId]
  return country.data.map(({ year, gdp }) => ({
    year,
    C: Math.round(gdp * shares.C),
    G: Math.round(gdp * shares.G),
    FBKF: Math.round(gdp * shares.FBKF),
    VarExist: Math.round(gdp * shares.VarExist),
    SaldoComercial: Math.round(gdp * shares.SaldoComercial),
  }))
}

// =============================================================
// Desagregación por SECTOR productivo (VAB, 13 ramas)
// Shares por país (WB NV.AGR.TOTL.ZS, NV.IND.MANF.ZS, NV.SRV.TOTL.ZS,
// OECD STAN — promedio 2018–2022). Aplicados al PIB nominal USD corrientes.
// La suma por año se acerca al 100% del PIB (pequeñas diferencias por
// impuestos netos sobre productos, que se promedian dentro de las ramas).
// =============================================================

export const sectorKeys = [
  'Agricultura y ganadería',
  'Minería',
  'Industria manufacturera',
  'Electricidad, gas y agua',
  'Construcción',
  'Comercio',
  'Transporte e info.',
  'Servicios financieros',
  'Inmobiliarios y alquiler',
  'Servicios prof. y empr.',
  'Educación y salud',
  'Gobierno y defensa',
  'Otros servicios',
] as const
export type SectorKey = (typeof sectorKeys)[number]

const sectorPalette = [
  '#1f4e4a', '#2d6b65', '#3e8a82', '#5ba89f',
  '#c89f3c', '#d4b564', '#e3c77a', '#f0d99a',
  '#8c5a3c', '#a8704e', '#c38a68', '#556661',
  '#a33b2a',
]
export const sectorColors: Record<string, string> = Object.fromEntries(
  sectorKeys.map((k, i) => [k, sectorPalette[i % sectorPalette.length]]),
)

const sectorShares: Record<string, Record<SectorKey, number>> = {
  usa: {
    'Agricultura y ganadería': 0.009,
    'Minería': 0.016,
    'Industria manufacturera': 0.110,
    'Electricidad, gas y agua': 0.018,
    'Construcción': 0.043,
    'Comercio': 0.122,
    'Transporte e info.': 0.100,
    'Servicios financieros': 0.082,
    'Inmobiliarios y alquiler': 0.135,
    'Servicios prof. y empr.': 0.130,
    'Educación y salud': 0.086,
    'Gobierno y defensa': 0.119,
    'Otros servicios': 0.030,
  },
  mex: {
    'Agricultura y ganadería': 0.034,
    'Minería': 0.049,
    'Industria manufacturera': 0.190,
    'Electricidad, gas y agua': 0.022,
    'Construcción': 0.074,
    'Comercio': 0.192,
    'Transporte e info.': 0.083,
    'Servicios financieros': 0.042,
    'Inmobiliarios y alquiler': 0.100,
    'Servicios prof. y empr.': 0.075,
    'Educación y salud': 0.057,
    'Gobierno y defensa': 0.038,
    'Otros servicios': 0.044,
  },
  bra: {
    'Agricultura y ganadería': 0.052,
    'Minería': 0.024,
    'Industria manufacturera': 0.113,
    'Electricidad, gas y agua': 0.029,
    'Construcción': 0.033,
    'Comercio': 0.132,
    'Transporte e info.': 0.082,
    'Servicios financieros': 0.069,
    'Inmobiliarios y alquiler': 0.094,
    'Servicios prof. y empr.': 0.075,
    'Educación y salud': 0.085,
    'Gobierno y defensa': 0.176,
    'Otros servicios': 0.036,
  },
  esp: {
    'Agricultura y ganadería': 0.029,
    'Minería': 0.003,
    'Industria manufacturera': 0.123,
    'Electricidad, gas y agua': 0.024,
    'Construcción': 0.059,
    'Comercio': 0.139,
    'Transporte e info.': 0.094,
    'Servicios financieros': 0.039,
    'Inmobiliarios y alquiler': 0.115,
    'Servicios prof. y empr.': 0.112,
    'Educación y salud': 0.104,
    'Gobierno y defensa': 0.121,
    'Otros servicios': 0.038,
  },
  sgp: {
    'Agricultura y ganadería': 0.0003,
    'Minería': 0.001,
    'Industria manufacturera': 0.215,
    'Electricidad, gas y agua': 0.015,
    'Construcción': 0.034,
    'Comercio': 0.172,
    'Transporte e info.': 0.118,
    'Servicios financieros': 0.140,
    'Inmobiliarios y alquiler': 0.033,
    'Servicios prof. y empr.': 0.130,
    'Educación y salud': 0.042,
    'Gobierno y defensa': 0.070,
    'Otros servicios': 0.030,
  },
  chn: {
    'Agricultura y ganadería': 0.073,
    'Minería': 0.040,
    'Industria manufacturera': 0.277,
    'Electricidad, gas y agua': 0.028,
    'Construcción': 0.069,
    'Comercio': 0.098,
    'Transporte e info.': 0.090,
    'Servicios financieros': 0.079,
    'Inmobiliarios y alquiler': 0.067,
    'Servicios prof. y empr.': 0.040,
    'Educación y salud': 0.050,
    'Gobierno y defensa': 0.049,
    'Otros servicios': 0.040,
  },
}

export interface SectorRow {
  year: number
  [sector: string]: number
}

export function getSectorData(countryId: string): SectorRow[] {
  const country = countriesGdp.find((c) => c.id === countryId)
  if (!country) return []
  const shares = sectorShares[countryId]
  return country.data.map(({ year, gdp }) => {
    const row: SectorRow = { year }
    for (const k of sectorKeys) {
      row[k] = Math.round(gdp * shares[k])
    }
    return row
  })
}
