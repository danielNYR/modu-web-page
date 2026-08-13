export interface Paquete {
  idPaquete: number;
  idProducto: number;
  slug: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  precioMensual?: number;
  precioAnual?: number;
  moneda: string;
  isActive: boolean;
  modulos: PaqueteModulo[];
}

export interface PaqueteModulo {
  idModulo: number;
  slug: string;
  nombre: string;
}

export interface PaqueteRequest {
  idProducto: number;
  slug: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden?: number;
  precioMensual?: number;
  precioAnual?: number;
  moneda?: string;
  isActive?: boolean;
}
