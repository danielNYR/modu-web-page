export interface PeriodoLicencia {
  idPeriodo: number;
  clave: string;
  nombre: string;
  duracionMeses: number | null;
  esPrueba: boolean;
  renovacionCadaMeses: number | null;
  descuentoVsMensualPct: number | null;
  orden: number;
  isActive: boolean;
}

export interface PeriodoLicenciaRequest {
  clave: string;
  nombre: string;
  duracionMeses?: number | null;
  esPrueba?: boolean;
  renovacionCadaMeses?: number | null;
  descuentoVsMensualPct?: number | null;
  orden?: number;
  isActive?: boolean;
}
