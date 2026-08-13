export interface Producto {
  idProducto: number;
  slug: string;
  nombre: string;
  isActive: boolean;
}

export interface ProductoRequest {
  slug: string;
  nombre: string;
  isActive?: boolean;
}
