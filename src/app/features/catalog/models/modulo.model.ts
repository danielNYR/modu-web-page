export const CATEGORIAS_MODULO = [
  'CORE',
  'OPERACIONES',
  'VENTAS',
  'FINANZAS',
  'INTELIGENCIA',
  'WEB',
  'GIRO_ESPECIFICO',
] as const;
export type CategoriaModulo = (typeof CATEGORIAS_MODULO)[number];

export interface Modulo {
  idModulo: number;
  idProducto: number;
  slug: string;
  nombre: string;
  esCore: boolean;
  descripcion: string | null;
  icono: string | null;
  orden: number | null;
  categoria: CategoriaModulo | null;
  precioMensualBase: number | null;
  esAddon: boolean;
  isActive: boolean;
}

export interface ModuloRequest {
  idProducto: number;
  slug: string;
  nombre: string;
  esCore?: boolean;
  descripcion?: string;
  icono?: string;
  orden?: number;
  categoria?: CategoriaModulo;
  isActive?: boolean;
}

export interface ModuloAdminRequest {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  icono?: string;
  precioMensualBase?: number | null;
  esAddon?: boolean;
  isActive?: boolean;
  orden?: number;
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
