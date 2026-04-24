export interface GdpByExpenditureRow {
  year: number
  C: number
  G: number
  FBKF: number
  VarExist: number
  SaldoComercial: number
  total: number
}

export interface GdpBySectorRow {
  year: number
  [sector: string]: number
}

export const gdpByExpenditure: GdpByExpenditureRow[] = [
  { year: 2015, C: 391974, G: 106500, FBKF: 100000, VarExist: 2379, SaldoComercial: -10702, total: 590151 },
  { year: 2016, C: 366420, G: 98900, FBKF: 92000, VarExist: 2788, SaldoComercial: -3369, total: 556739 },
  { year: 2017, C: 429555, G: 113902, FBKF: 117140, VarExist: 7080, SaldoComercial: -16748, total: 650929 },
  { year: 2018, C: 364593, G: 91844, FBKF: 88170, VarExist: 2099, SaldoComercial: -11550, total: 535156 },
  { year: 2019, C: 301560, G: 77461, FBKF: 63134, VarExist: -448, SaldoComercial: 14281, total: 455988 },
  { year: 2020, C: 247275, G: 64439, FBKF: 51689, VarExist: 2314, SaldoComercial: 13127, total: 378844 },
  { year: 2021, C: 312000, G: 77193, FBKF: 86122, VarExist: 8758, SaldoComercial: 11617, total: 495690 },
  { year: 2022, C: 413000, G: 99900, FBKF: 113485, VarExist: 17118, SaldoComercial: -3768, total: 639735 },
  { year: 2023, C: 417764, G: 102826, FBKF: 118666, VarExist: 7569, SaldoComercial: -6225, total: 640600 },
  { year: 2024, C: 417786, G: 92214, FBKF: 97939, VarExist: 4329, SaldoComercial: 21032, total: 633300 },
  { year: 2025, C: 450000, G: 95500, FBKF: 118000, VarExist: 5320, SaldoComercial: 16700, total: 685520 },
]

export const expenditureKeys = ['C', 'G', 'FBKF', 'VarExist', 'SaldoComercial'] as const
export const expenditureLabels: Record<string, string> = {
  C: 'Consumo privado (C)',
  G: 'Consumo público (G)',
  FBKF: 'FBKF',
  VarExist: 'Var. existencias',
  SaldoComercial: 'Saldo comercial (X−M)',
}
export const expenditureColors: Record<string, string> = {
  C: '#1f4e4a',
  G: '#2d6b65',
  FBKF: '#c89f3c',
  VarExist: '#8c5a3c',
  SaldoComercial: '#a33b2a',
}

// Sectores (VAB) — 2018–2025
const sectorMatrix = [
  ['A — Agricultura, ganadería, caza y silvicultura', 29761, 30773, 21885, 32203, 40220, 37321, 35433, 40918],
  ['B — Pesca', 1946, 1578, 1227, 1521, 1693, 1463, 1619, 1714],
  ['C — Explotación de minas y canteras', 19850, 17585, 12161, 17665, 22494, 24966, 25940, 30175],
  ['D — Industria manufacturera', 65988, 57685, 59876, 81491, 101331, 104302, 96904, 104671],
  ['E — Electricidad, gas y agua', 12476, 11508, 6220, 5421, 5174, 5686, 9078, 13499],
  ['F — Construcción', 21107, 17158, 12560, 17482, 23524, 25489, 21213, 27914],
  ['G — Comercio mayorista y minorista', 67298, 57167, 63114, 80465, 103556, 106822, 104163, 116199],
  ['H — Hoteles y restaurantes', 10564, 8761, 4437, 5970, 11551, 13590, 14412, 20517],
  ['I — Transporte, almacenamiento y comunicaciones', 30240, 26634, 18725, 22211, 29167, 27436, 30716, 36816],
  ['J — Intermediación financiera', 21626, 16227, 14177, 13280, 16695, 11326, 23163, 30414],
  ['K — Inmobiliarias, empresariales, alquiler', 52184, 43928, 37652, 45648, 59423, 58952, 59913, 92031],
  ['L — Administración pública y defensa', 36386, 29695, 26803, 32199, 40428, 43193, 37612, 45117],
  ['M — Enseñanza', 26044, 21890, 20663, 22755, 29616, 31206, 28745, 36035],
  ['N — Servicios sociales y de salud', 26580, 21953, 17543, 20336, 27564, 28082, 26589, 33682],
  ['O — Otros servicios comunitarios, sociales y pers.', 14133, 11803, 7431, 10041, 13498, 13725, 14040, 18181],
  ['P — Hogares privados con servicio doméstico', 3423, 2871, 2226, 2389, 3413, 3504, 3019, 3705],
] as const

const sectorYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

export const sectorKeys: string[] = sectorMatrix.map((r) => r[0] as string)

export const gdpBySector: GdpBySectorRow[] = sectorYears.map((year, colIdx) => {
  const row: GdpBySectorRow = { year }
  for (const r of sectorMatrix) {
    row[r[0] as string] = r[colIdx + 1] as number
  }
  return row
})

const sectorPalette = [
  '#1f4e4a', '#2d6b65', '#3e8a82', '#5ba89f',
  '#c89f3c', '#d4b564', '#e3c77a', '#f0d99a',
  '#8c5a3c', '#a8704e', '#c38a68', '#d9a484',
  '#556661', '#6f8580', '#89a39d', '#a33b2a',
]
export const sectorColors: Record<string, string> = Object.fromEntries(
  sectorKeys.map((k, i) => [k, sectorPalette[i % sectorPalette.length]]),
)
