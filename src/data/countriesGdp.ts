// PIB nominal en USD miles de millones — USD corrientes (current US$)
// Totales: World Bank · NY.GDP.MKTP.CD · 2015–2024 (validado vs API oficial)
// Desagregación por GASTO: shares ANUALES reales del World Bank
//   (NE.CON.PRVT.ZS, NE.CON.GOVT.ZS, NE.GDI.FTOT.ZS, NE.RSB.GNFS.ZS)
// Desagregación por SECTOR: agregados ANUALES reales (NV.AGR.TOTL.ZS,
//   NV.IND.TOTL.ZS, NV.SRV.TOTL.ZS) × pesos estructurales por subrama.
// Cuando WB no publica un año (USA 2023-24 cuentas nacionales) se arrastra
// el último dato disponible.

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
// Desagregación por GASTO — shares ANUALES reales (% del PIB)
// Columnas: [C, G, FBKF, ΔExist, X−M]  · Años 2015–2024 (índice 0..9)
// VarExist = 100 − C − G − FBKF − (X−M)  (residual; puede ser negativo en
// años de desacumulación de inventarios)
// Fuente: World Bank (NE.CON.PRVT.ZS, NE.CON.GOVT.ZS, NE.GDI.FTOT.ZS,
// NE.RSB.GNFS.ZS). Validado el 2026-04.
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

const EXP_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

// [C, G, FBKF, VarExist, SaldoComercial] en puntos porcentuales
const expenditureSharesByYear: Record<string, number[][]> = {
  usa: [
    [67.55, 14.30, 20.75, 0.28, -2.88],
    [68.08, 14.19, 20.80, -0.38, -2.69],
    [68.24, 13.94, 21.13, -0.52, -2.79],
    [67.86, 13.93, 21.42, -0.32, -2.89],
    [67.43, 14.10, 21.49, -0.32, -2.70],
    [67.45, 15.09, 21.89, -1.46, -2.97],
    [68.81, 14.44, 21.62, -1.18, -3.69],
    [68.39, 13.94, 21.71, -0.29, -3.75],
    [68.39, 13.94, 21.73, -1.14, -2.92], // C/G: WB no publica 2023 → carry 2022
    [68.39, 13.94, 21.70, -0.87, -3.16], // C/G: WB no publica 2024 → carry 2022
  ],
  chn: [
    [38.06, 16.26, 41.62, 0.88, 3.18],
    [39.16, 16.40, 41.08, 1.13, 2.23],
    [38.95, 16.50, 41.42, 1.41, 1.72],
    [38.94, 16.84, 42.38, 1.19, 0.65],
    [39.35, 17.15, 42.25, 0.34, 0.91],
    [38.17, 17.60, 41.85, 0.01, 2.37],
    [38.37, 16.35, 41.35, 1.40, 2.53],
    [37.78, 16.66, 41.23, 1.18, 3.15],
    [39.57, 17.19, 40.45, 0.69, 2.10],
    [39.93, 16.63, 39.87, 0.72, 2.85],
  ],
  mex: [
    [69.15, 11.90, 23.16, -2.12, -2.09],
    [68.93, 11.57, 23.73, -2.17, -2.06],
    [68.24, 11.22, 23.23, -0.77, -1.92],
    [67.39, 11.26, 23.05, 0.42, -2.12],
    [67.12, 11.11, 21.67, 0.50, -0.40],
    [66.15, 12.20, 20.11, -0.08, 1.62],
    [68.33, 11.40, 21.31, 0.89, -1.93],
    [70.56, 11.13, 22.42, -1.18, -2.93],
    [69.77, 11.13, 23.87, -3.33, -1.44],
    [70.22, 11.21, 24.12, -4.37, -1.18],
  ],
  bra: [
    [63.96, 19.78, 17.84, -0.43, -1.15],
    [64.25, 20.38, 15.52, -0.55, 0.40],
    [64.49, 20.16, 14.56, 0.07, 0.72],
    [64.62, 19.90, 15.10, -0.01, 0.39],
    [65.14, 19.98, 15.47, 0.05, -0.64],
    [63.14, 20.14, 16.56, -0.45, 0.61],
    [61.37, 18.55, 17.92, 1.60, 0.56],
    [63.06, 18.40, 17.80, 0.29, 0.45],
    [62.92, 19.04, 16.41, -0.64, 2.27],
    [63.96, 18.77, 16.91, 0.07, 0.29],
  ],
  esp: [
    [57.97, 19.36, 18.30, 1.35, 3.02],
    [57.73, 18.96, 18.19, 1.15, 3.97],
    [57.96, 18.54, 18.91, 0.96, 3.63],
    [57.70, 18.58, 19.67, 1.31, 2.74],
    [56.99, 18.74, 20.31, 0.98, 2.98],
    [55.57, 21.82, 20.62, 0.47, 1.52],
    [55.62, 21.01, 20.20, 2.18, 0.99],
    [55.72, 19.93, 20.49, 2.98, 0.88],
    [54.29, 19.47, 20.47, 1.93, 3.84],
    [54.29, 19.47, 20.29, 1.79, 4.16], // C/G: WB no publica 2024 → carry 2023
  ],
  sgp: [
    [37.16, 10.19, 27.22, -1.87, 27.30],
    [36.46, 10.24, 25.94, 1.10, 26.26],
    [35.21, 10.17, 25.21, 2.72, 26.69],
    [34.57, 9.96, 22.39, 3.28, 29.80],
    [35.65, 10.27, 22.89, 1.80, 29.39],
    [32.09, 12.26, 20.99, 3.14, 31.52],
    [28.72, 10.64, 22.12, 2.26, 36.26],
    [27.99, 9.24, 20.75, 2.14, 39.88],
    [31.59, 10.00, 22.39, -1.41, 37.43],
    [31.49, 10.59, 21.90, 0.84, 35.18],
  ],
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
  const years = expenditureSharesByYear[countryId]
  if (!years) return []
  return country.data.map(({ year, gdp }) => {
    const idx = EXP_YEARS.indexOf(year)
    const row = years[idx >= 0 ? idx : years.length - 1]
    const [cC, cG, cI, cV, cNX] = row
    return {
      year,
      C: Math.round((gdp * cC) / 100),
      G: Math.round((gdp * cG) / 100),
      FBKF: Math.round((gdp * cI) / 100),
      VarExist: Math.round((gdp * cV) / 100),
      SaldoComercial: Math.round((gdp * cNX) / 100),
    }
  })
}

// =============================================================
// Desagregación por SECTOR productivo (VAB, 13 ramas)
// Agregados ANUALES reales (agri / industria / servicios) del World Bank
// (NV.AGR.TOTL.ZS, NV.IND.TOTL.ZS, NV.SRV.TOTL.ZS), distribuidos entre las
// 13 subramas según los pesos estructurales típicos de cada país.
// (La suma puede no ser 100% exacto: el residuo son impuestos netos sobre
// los productos + SIFMI, que WB no descompone por rama.)
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

type SectorGroup = 'agri' | 'industry' | 'services'
const SECTOR_GROUP: Record<SectorKey, SectorGroup> = {
  'Agricultura y ganadería': 'agri',
  'Minería': 'industry',
  'Industria manufacturera': 'industry',
  'Electricidad, gas y agua': 'industry',
  'Construcción': 'industry',
  'Comercio': 'services',
  'Transporte e info.': 'services',
  'Servicios financieros': 'services',
  'Inmobiliarios y alquiler': 'services',
  'Servicios prof. y empr.': 'services',
  'Educación y salud': 'services',
  'Gobierno y defensa': 'services',
  'Otros servicios': 'services',
}

// Pesos estructurales por país (promedio 2018-2022). Se usan para distribuir
// el agregado anual entre subramas de cada grupo.
const sectorStructuralShares: Record<string, Record<SectorKey, number>> = {
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

// Agregados anuales reales de WB — [agri, industry, services] en puntos porcentuales
// Años 2015..2024. USA 2022-24: WB no publica → carry 2021.
const sectorAggregatesByYear: Record<string, number[][]> = {
  usa: [
    [1.03, 18.59, 76.74],
    [0.94, 18.04, 77.44],
    [0.95, 18.44, 77.03],
    [0.90, 18.63, 76.74],
    [0.84, 18.28, 77.18],
    [0.95, 17.51, 78.14],
    [0.96, 17.88, 75.60],
    [0.96, 17.88, 75.60],
    [0.96, 17.88, 75.60],
    [0.96, 17.88, 75.60],
  ],
  chn: [
    [8.22, 40.05, 51.73],
    [7.90, 38.81, 53.29],
    [7.33, 39.13, 53.54],
    [6.92, 38.98, 54.11],
    [7.01, 37.76, 55.23],
    [7.54, 36.91, 55.55],
    [7.09, 38.09, 54.82],
    [7.15, 37.89, 54.96],
    [6.89, 36.77, 56.34],
    [6.78, 36.48, 56.75],
  ],
  mex: [
    [3.09, 30.84, 60.51],
    [3.25, 30.62, 60.08],
    [3.30, 31.96, 59.37],
    [3.30, 32.04, 59.27],
    [3.32, 31.84, 59.16],
    [3.71, 31.00, 59.19],
    [3.78, 31.97, 58.33],
    [3.90, 33.16, 58.13],
    [3.84, 32.61, 57.56],
    [3.72, 31.78, 58.10],
  ],
  bra: [
    [4.32, 19.36, 62.31],
    [4.89, 18.35, 63.20],
    [4.60, 18.19, 63.34],
    [4.42, 18.75, 62.65],
    [4.21, 18.75, 63.07],
    [5.71, 19.51, 61.45],
    [6.56, 22.12, 56.91],
    [5.77, 22.82, 58.09],
    [6.02, 22.14, 59.18],
    [5.75, 20.94, 59.17],
  ],
  esp: [
    [2.72, 19.92, 68.23],
    [2.82, 19.79, 68.17],
    [2.80, 19.90, 67.98],
    [2.70, 19.74, 68.12],
    [2.52, 19.98, 68.27],
    [2.78, 20.12, 68.40],
    [2.77, 20.32, 67.45],
    [2.37, 21.22, 67.60],
    [2.61, 19.96, 68.69],
    [2.75, 19.45, 68.90],
  ],
  sgp: [
    [0.03, 24.29, 69.95],
    [0.03, 23.20, 70.75],
    [0.03, 23.50, 70.39],
    [0.03, 25.38, 69.36],
    [0.03, 24.07, 70.80],
    [0.03, 23.24, 72.10],
    [0.03, 24.61, 70.17],
    [0.03, 23.84, 71.60],
    [0.03, 22.15, 72.69],
    [0.03, 21.38, 73.03],
  ],
}

export interface SectorRow {
  year: number
  [sector: string]: number
}

export function getSectorData(countryId: string): SectorRow[] {
  const country = countriesGdp.find((c) => c.id === countryId)
  if (!country) return []
  const aggs = sectorAggregatesByYear[countryId]
  const structural = sectorStructuralShares[countryId]
  if (!aggs || !structural) return []

  // Totales estructurales por grupo (denominador para pesos internos)
  const groupTotals: Record<SectorGroup, number> = { agri: 0, industry: 0, services: 0 }
  for (const k of sectorKeys) groupTotals[SECTOR_GROUP[k]] += structural[k]

  return country.data.map(({ year, gdp }) => {
    const idx = EXP_YEARS.indexOf(year)
    const [agri, industry, services] = aggs[idx >= 0 ? idx : aggs.length - 1]
    const aggByGroup: Record<SectorGroup, number> = {
      agri: agri / 100,
      industry: industry / 100,
      services: services / 100,
    }
    const row: SectorRow = { year }
    for (const k of sectorKeys) {
      const group = SECTOR_GROUP[k]
      const weightInGroup = structural[k] / groupTotals[group]
      const share = aggByGroup[group] * weightInGroup
      row[k] = Math.round(gdp * share)
    }
    return row
  })
}
