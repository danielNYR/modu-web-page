import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import type { Producto, ProductoRequest } from '../models/producto.model';
import type { Plan, PlanModulo, PlanModuloRequest, PlanRequest } from '../models/plan.model';
import type {
  Modulo,
  ModuloAdminRequest,
  ModuloConDependencias,
  ModuloDependencia,
  ModuloDependenciaRequest,
  ModuloRequest,
} from '../models/modulo.model';
import type { Paquete, PaqueteRequest } from '../models/paquete.model';
import type { Descuento, DescuentoRequest } from '../models/descuento.model';
import type { PeriodoLicencia, PeriodoLicenciaRequest } from '../models/periodo-licencia.model';

export interface Giro {
  idGiro: number;
  nombreGiro: string;
}

const BASE = '/api/admin/catalogo';
// Descuentos y periodos de licencia viven en su propio controller, fuera de /api/admin/catalogo.
const DESCUENTOS_BASE = '/api/admin/descuentos';
const PERIODOS_LICENCIA_BASE = '/api/admin/periodos-licencia';

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

  // --- Giros (read-only) ---------------------------------------------------

  giros() {
    return httpResource<Giro[]>(() => ({ url: `${BASE}/giros` }), { defaultValue: [] });
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

  girosDePlan(idPlan: Signal<number | undefined>) {
    return httpResource<Giro[]>(
      () => {
        const id = idPlan();
        return id === undefined ? undefined : { url: `${BASE}/planes/${id}/giros` };
      },
      { defaultValue: [] },
    );
  }

  asignarGirosAPlan(idPlan: number, idGiros: number[]) {
    return this.http.put<Giro[]>(`${BASE}/planes/${idPlan}/giros`, idGiros);
  }

  // --- Módulos ---------------------------------------------------------------

  girosDeModulo(idModulo: Signal<number | undefined>) {
    return httpResource<Giro[]>(
      () => {
        const id = idModulo();
        return id === undefined ? undefined : { url: `${BASE}/modulos/${id}/giros` };
      },
      { defaultValue: [] },
    );
  }

  asignarGirosAModulo(idModulo: number, idGiros: number[]) {
    return this.http.put<Giro[]>(`${BASE}/modulos/${idModulo}/giros`, idGiros);
  }

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

  actualizarModuloAdmin(slug: string, req: ModuloAdminRequest) {
    return this.http.put<Modulo>(`/api/admin/modulos/${slug}`, req);
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

  // --- Paquetes ---------------------------------------------------------------

  paquetes(idProducto: Signal<number | undefined>) {
    return httpResource<Paquete[]>(
      () => {
        const id = idProducto();
        return { url: `${BASE}/paquetes`, params: id === undefined ? undefined : { idProducto: id } };
      },
      { defaultValue: [] },
    );
  }

  crearPaquete(req: PaqueteRequest) {
    return this.http.post<Paquete>(`${BASE}/paquetes`, req);
  }

  actualizarPaquete(id: number, req: PaqueteRequest) {
    return this.http.put<Paquete>(`${BASE}/paquetes/${id}`, req);
  }

  cambiarEstadoPaquete(id: number, isActive: boolean) {
    return this.http.patch<Paquete>(`${BASE}/paquetes/${id}/estado`, { isActive });
  }

  agregarModuloAPaquete(idPaquete: number, idModulo: number) {
    return this.http.post<Paquete>(`${BASE}/paquetes/${idPaquete}/modulos/${idModulo}`, {});
  }

  eliminarModuloDePaquete(idPaquete: number, idModulo: number) {
    return this.http.delete<void>(`${BASE}/paquetes/${idPaquete}/modulos/${idModulo}`);
  }

  girosDePaquete(idPaquete: Signal<number | undefined>) {
    return httpResource<Giro[]>(
      () => {
        const id = idPaquete();
        return id === undefined ? undefined : { url: `${BASE}/paquetes/${id}/giros` };
      },
      { defaultValue: [] },
    );
  }

  asignarGirosAPaquete(idPaquete: number, idGiros: number[]) {
    return this.http.put<Giro[]>(`${BASE}/paquetes/${idPaquete}/giros`, idGiros);
  }

  // --- Descuentos ---------------------------------------------------------

  descuentos() {
    return httpResource<Descuento[]>(() => ({ url: DESCUENTOS_BASE }), { defaultValue: [] });
  }

  crearDescuento(req: DescuentoRequest) {
    return this.http.post<Descuento>(DESCUENTOS_BASE, req);
  }

  actualizarDescuento(id: number, req: DescuentoRequest) {
    return this.http.put<Descuento>(`${DESCUENTOS_BASE}/${id}`, req);
  }

  cambiarEstadoDescuento(id: number, isActive: boolean) {
    return this.http.patch<Descuento>(`${DESCUENTOS_BASE}/${id}/estado`, { isActive });
  }

  // --- Periodos de licencia -------------------------------------------------

  periodosLicencia() {
    return httpResource<PeriodoLicencia[]>(() => ({ url: PERIODOS_LICENCIA_BASE }), { defaultValue: [] });
  }

  crearPeriodoLicencia(req: PeriodoLicenciaRequest) {
    return this.http.post<PeriodoLicencia>(PERIODOS_LICENCIA_BASE, req);
  }

  actualizarPeriodoLicencia(id: number, req: PeriodoLicenciaRequest) {
    return this.http.put<PeriodoLicencia>(`${PERIODOS_LICENCIA_BASE}/${id}`, req);
  }

  cambiarEstadoPeriodoLicencia(id: number, isActive: boolean) {
    return this.http.patch<PeriodoLicencia>(`${PERIODOS_LICENCIA_BASE}/${id}/estado`, { isActive });
  }
}
