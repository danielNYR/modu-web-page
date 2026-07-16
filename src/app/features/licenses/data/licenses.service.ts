import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type {
  BuscarLicenciasParams,
  ExtenderLicenciaRequest,
  GenerarLicenciaRequest,
  Licencia,
  ModuloHabilitado,
  RevocarLicenciaRequest,
} from '../models/license.model';

const BASE = '/api/licencias';

@Injectable({ providedIn: 'root' })
export class LicensesService {
  private readonly http = inject(HttpClient);

  buscar(params: Signal<BuscarLicenciasParams>) {
    return httpResource<Page<Licencia>>(
      () => ({ url: BASE, params: toHttpParams(params()) }),
      { defaultValue: emptyPage<Licencia>() },
    );
  }

  detalle(idLicencia: Signal<number | undefined>) {
    return httpResource<Licencia | undefined>(() => {
      const id = idLicencia();
      return id === undefined ? undefined : { url: `${BASE}/${id}` };
    });
  }

  modulos(idLicencia: number) {
    return this.http.get<ModuloHabilitado[]>(`${BASE}/${idLicencia}/modulos`);
  }

  activaPorUsuario(idUsuario: number) {
    return this.http.get<Licencia>(`${BASE}/usuario/${idUsuario}/activa`);
  }

  activaPorTenant(idTenant: number) {
    return this.http.get<Licencia>(`${BASE}/tenant/${idTenant}/activa`);
  }

  generar(req: GenerarLicenciaRequest) {
    return this.http.post<Licencia>(`${BASE}/generar`, req);
  }

  revocar(idLicencia: number, req: RevocarLicenciaRequest) {
    return this.http.patch<Licencia>(`${BASE}/${idLicencia}/revocar`, req);
  }

  extender(idLicencia: number, req: ExtenderLicenciaRequest) {
    return this.http.patch<Licencia>(`${BASE}/${idLicencia}/extender`, req);
  }
}

function toHttpParams(params: BuscarLicenciasParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.estatus) query['estatus'] = params.estatus;
  if (params.idProducto !== undefined) query['idProducto'] = params.idProducto;
  if (params.idTenant !== undefined) query['idTenant'] = params.idTenant;
  if (params.proximasAVencerDias !== undefined) query['proximasAVencerDias'] = params.proximasAVencerDias;
  if (params.sort) query['sort'] = params.sort;
  return query;
}
