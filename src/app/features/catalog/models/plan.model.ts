export interface Plan {
  idPlan: number;
  idProducto: number;
  idGiros: number[];
  slug: string;
  nombre: string;
  precioMensual: number;
  precioAnual: number;
  moneda: string;
  trialDias: number;
  isActive: boolean;
}

export interface PlanRequest {
  idProducto: number;
  idGiros?: number[];
  slug: string;
  nombre: string;
  precioMensual: number;
  precioAnual: number;
  moneda?: string;
  trialDias?: number;
  isActive?: boolean;
  modulos?: PlanModuloRequest[];
}

export interface PlanModulo {
  idModulo: number;
  limiteUso: number | null;
  unidadLimite: string | null;
  habilitado: boolean;
}

export interface PlanModuloRequest {
  idModulo: number;
  limiteUso?: number | null;
  unidadLimite?: string | null;
  habilitado: boolean;
}
