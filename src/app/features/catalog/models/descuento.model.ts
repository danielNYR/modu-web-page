export const TIPOS_VALOR_DESCUENTO = ['PORCENTAJE', 'MONTO_FIJO'] as const;
export type TipoValorDescuento = (typeof TIPOS_VALOR_DESCUENTO)[number];

export interface Descuento {
  idDescuento: number;
  idProducto: number | null;
  nombre: string;
  tipoValor: TipoValorDescuento;
  valor: number;
  moneda: string;
  idGiro: number | null;
  soloPrimeraCompra: boolean;
  minModulos: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  isActive: boolean;
}

export interface DescuentoRequest {
  idProducto?: number | null;
  nombre: string;
  tipoValor: TipoValorDescuento;
  valor: number;
  moneda?: string;
  idGiro?: number | null;
  soloPrimeraCompra?: boolean;
  minModulos?: number | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  isActive?: boolean;
}
