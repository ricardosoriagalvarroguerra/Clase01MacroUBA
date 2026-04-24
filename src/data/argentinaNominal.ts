// Estimaciones aproximadas con fines didácticos.
// Fuente: INDEC (cuentas nacionales), Banco Mundial, FMI.
// Cifras de PIB nominal en millones de pesos corrientes; deflactor e inflación en %.

export interface ArgentinaGdpRow {
  year: number
  nominal: number      // MM ARS corrientes
  nominalGrowth: number | null // % y/y
  deflator: number | null      // % y/y (variación del deflactor implícito)
  real2015: number     // MM ARS a precios de 2015 (base)
  realGrowth: number | null    // % y/y
  population: number   // millones
  gdpPerCapitaUsd: number // USD corrientes
}

export const argentinaGdpTimeSeries: ArgentinaGdpRow[] = [
  { year: 2015, nominal: 5955000,    nominalGrowth: null,  deflator: null,  real2015: 5955000, realGrowth: null,  population: 43.13, gdpPerCapitaUsd: 13789 },
  { year: 2016, nominal: 8189000,    nominalGrowth: 37.5,  deflator: 40.5,  real2015: 5830000, realGrowth: -2.1, population: 43.59, gdpPerCapitaUsd: 12791 },
  { year: 2017, nominal: 10646000,   nominalGrowth: 30.0,  deflator: 26.5,  real2015: 5994000, realGrowth: 2.8,  population: 44.04, gdpPerCapitaUsd: 14613 },
  { year: 2018, nominal: 14745000,   nominalGrowth: 38.5,  deflator: 42.0,  real2015: 5838000, realGrowth: -2.6, population: 44.49, gdpPerCapitaUsd: 11795 },
  { year: 2019, nominal: 21745000,   nominalGrowth: 47.5,  deflator: 50.5,  real2015: 5721000, realGrowth: -2.0, population: 44.94, gdpPerCapitaUsd: 10041 },
  { year: 2020, nominal: 27550000,   nominalGrowth: 26.7,  deflator: 40.5,  real2015: 5155000, realGrowth: -9.9, population: 45.38, gdpPerCapitaUsd: 8496 },
  { year: 2021, nominal: 47400000,   nominalGrowth: 72.0,  deflator: 55.4,  real2015: 5706000, realGrowth: 10.7, population: 45.81, gdpPerCapitaUsd: 10657 },
  { year: 2022, nominal: 85500000,   nominalGrowth: 80.4,  deflator: 71.6,  real2015: 6003000, realGrowth: 5.2,  population: 46.23, gdpPerCapitaUsd: 13565 },
  { year: 2023, nominal: 203000000,  nominalGrowth: 137.4, deflator: 141.0, real2015: 5907000, realGrowth: -1.6, population: 46.65, gdpPerCapitaUsd: 13766 },
  { year: 2024, nominal: 470000000,  nominalGrowth: 131.5, deflator: 135.7, real2015: 5806000, realGrowth: -1.7, population: 47.07, gdpPerCapitaUsd: 13892 },
]
