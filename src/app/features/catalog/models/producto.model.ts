export interface Producto {
  id: number;
  slug: string;
  nombre: string;
  isActive: boolean;
}

export interface ProductoRequest {
  slug: string;
  nombre: string;
  isActive?: boolean;
}
