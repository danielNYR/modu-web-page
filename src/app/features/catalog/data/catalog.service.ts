import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import type { Producto, ProductoRequest } from '../models/producto.model';
import type { Plan, PlanModulo, PlanModuloRequest, PlanRequest } from '../models/plan.model';
import type {
  Modulo,
  ModuloConDependencias,
  ModuloDependencia,
  ModuloDependenciaRequest,
  ModuloRequest,
} from '../models/modulo.model';

const BASE = '/api/admin/catalogo';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  // --- Productos ---------------------------------------------------------

  productos() {
    return httpResource<Producto[]>(() => ({ url: `${BASE}/productos` }), { defaultValue: [] });
  }

  crearProducto(req: ProductoRequest) {
    return this.http.post<Producto>(`${BASE}/productos`, req);
  }

  actualizarProducto(id: number, req: ProductoRequest) {
    return this.http.put<Producto>(`${BASE}/productos/${id}`, req);
  }

  cambiarEstadoProducto(id: number, isActive: boolean) {
    return this.http.patch<Producto>(`${BASE}/productos/${id}/estado`, { isActive });
  }

  // --- Planes --------------------------------------------------------------

  planes(idProducto: Signal<number | undefined>) {
    return httpResource<Plan[]>(
      () => {
        const id = idProducto();
        return { url: `${BASE}/planes`, params: id === undefined ? undefined : { idProducto: id } };
      },
      { defaultValue: [] },
    );
  }

  crearPlan(req: PlanRequest) {
    return this.http.post<Plan>(`${BASE}/planes`, req);
  }

  actualizarPlan(id: number, req: PlanRequest) {
    return this.http.put<Plan>(`${BASE}/planes/${id}`, req);
  }

  cambiarEstadoPlan(id: number, isActive: boolean) {
    return this.http.patch<Plan>(`${BASE}/planes/${id}/estado`, { isActive });
  }

  modulosDelPlan(idPlan: Signal<number | undefined>) {
    return httpResource<PlanModulo[]>(
      () => {
        const id = idPlan();
        return id === undefined ? undefined : { url: `${BASE}/planes/${id}/modulos` };
      },
      { defaultValue: [] },
    );
  }

  actualizarModulosDelPlan(idPlan: number, modulos: PlanModuloRequest[]) {
    return this.http.put<PlanModulo[]>(`${BASE}/planes/${idPlan}/modulos`, modulos);
  }

  // --- Módulos ---------------------------------------------------------------

  modulos(idProducto: Signal<number | undefined>) {
    return httpResource<Modulo[]>(
      () => {
        const id = idProducto();
        return { url: `${BASE}/modulos`, params: id === undefined ? undefined : { idProducto: id } };
      },
      { defaultValue: [] },
    );
  }

  crearModulo(req: ModuloRequest) {
    return this.http.post<Modulo>(`${BASE}/modulos`, req);
  }

  actualizarModulo(id: number, req: ModuloRequest) {
    return this.http.put<Modulo>(`${BASE}/modulos/${id}`, req);
  }

  cambiarEstadoModulo(id: number, isActive: boolean) {
    return this.http.patch<Modulo>(`${BASE}/modulos/${id}/estado`, { isActive });
  }

  modulosConDependencias(idProducto: Signal<number | undefined>) {
    return httpResource<ModuloConDependencias[]>(
      () => {
        const id = idProducto();
        return id === undefined ? undefined : { url: `${BASE}/modulos/dependencias`, params: { idProducto: id } };
      },
      { defaultValue: [] },
    );
  }

  dependenciasDeModulo(id: number) {
    return this.http.get<ModuloDependencia[]>(`${BASE}/modulos/${id}/dependencias`);
  }

  crearDependencia(id: number, req: ModuloDependenciaRequest) {
    return this.http.post<ModuloDependencia>(`${BASE}/modulos/${id}/dependencias`, req);
  }

  eliminarDependencia(id: number, idModuloReq: number) {
    return this.http.delete<void>(`${BASE}/modulos/${id}/dependencias/${idModuloReq}`);
  }
}
