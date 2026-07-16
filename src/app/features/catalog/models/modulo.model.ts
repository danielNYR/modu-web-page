export interface Modulo {
  id: number;
  idProducto: number;
  slug: string;
  nombre: string;
  esCore: boolean;
  isActive: boolean;
}

export interface ModuloRequest {
  idProducto: number;
  slug: string;
  nombre: string;
  esCore?: boolean;
  isActive?: boolean;
}

export interface ModuloDependencia {
  idModuloReq: number;
  esHard: boolean;
  /** No especificado en el contrato si viene enriquecido con slug/nombre; se resuelve client-side si falta. */
  slug?: string;
  nombre?: string;
}

export interface ModuloConDependencias extends Modulo {
  dependenciasHard: ModuloDependencia[];
  dependenciasSoft: ModuloDependencia[];
}

export interface ModuloDependenciaRequest {
  idModuloReq: number;
  esHard?: boolean;
}
