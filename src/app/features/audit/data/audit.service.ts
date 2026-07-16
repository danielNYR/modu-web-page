import { Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type { AuditoriaLog, BuscarAuditoriaParams } from '../models/audit.model';

const BASE = '/api/admin/auditoria';

@Injectable({ providedIn: 'root' })
export class AuditService {
  log(params: Signal<BuscarAuditoriaParams>) {
    return httpResource<Page<AuditoriaLog>>(
      () => ({ url: BASE, params: toHttpParams(params()) }),
      { defaultValue: emptyPage<AuditoriaLog>() },
    );
  }
}

/** Solo se manda el primer filtro con datos completos, respetando la prioridad del backend. */
function toHttpParams(params: BuscarAuditoriaParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.sort) query['sort'] = params.sort;

  if (params.entidad && params.entidadId) {
    query['entidad'] = params.entidad;
    query['entidadId'] = params.entidadId;
  } else if (params.accion) {
    query['accion'] = params.accion;
  } else if (params.desde && params.hasta) {
    query['desde'] = params.desde;
    query['hasta'] = params.hasta;
  } else if (params.idTenant !== undefined) {
    query['idTenant'] = params.idTenant;
  }

  return query;
}
