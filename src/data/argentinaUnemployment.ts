// Tasa de desempleo — Argentina, 31 aglomerados urbanos (INDEC EPH)
// Promedios anuales. Fuente: INDEC · Encuesta Permanente de Hogares continua.

export interface UnemploymentRow {
  year: number
  rate: number
  note?: string
}

export const argentinaUnemployment: UnemploymentRow[] = [
  { year: 2003, rate: 17.3, note: 'Salida de la crisis 2001-2002' },
  { year: 2004, rate: 14.8 },
  { year: 2005, rate: 11.6 },
  { year: 2006, rate: 10.2 },
  { year: 2007, rate: 8.5 },
  { year: 2008, rate: 7.9 },
  { year: 2009, rate: 8.7, note: 'Crisis financiera global' },
  { year: 2010, rate: 7.7 },
  { year: 2011, rate: 7.2 },
  { year: 2012, rate: 7.2 },
  { year: 2013, rate: 7.1 },
  { year: 2014, rate: 7.3 },
  { year: 2015, rate: 6.5 },
  { year: 2016, rate: 8.5 },
  { year: 2017, rate: 8.4 },
  { year: 2018, rate: 9.1 },
  { year: 2019, rate: 9.8 },
  { year: 2020, rate: 11.7, note: 'Pandemia COVID-19' },
  { year: 2021, rate: 8.2 },
  { year: 2022, rate: 6.9 },
  { year: 2023, rate: 6.2 },
  { year: 2024, rate: 7.7, note: 'Recesión + ajuste fiscal' },
]

// Estructura poblacional — Argentina Q4 2024 (INDEC EPH)
// Totales aproximados en millones, aglomerados urbanos
export const laborStructure = {
  poblacionTotal: 29.7,
  menores: 5.2, // <14 años (no integran PET en criterio clásico)
  pet: 24.5, // Población en edad de trabajar (≥14)
  pea: 14.8, // Económicamente activa
  pei: 9.7, // Económicamente inactiva
  ocupados: 13.9,
  desocupados: 0.9,
  // Tasas derivadas
  tasaActividad: 60.4, // PEA / PET × 100
  tasaEmpleo: 56.7, // Ocupados / PET × 100
  tasaDesempleo: 6.1, // Desocupados / PEA × 100
  periodo: 'Q4 2024',
  fuente: 'INDEC · EPH continua',
}
