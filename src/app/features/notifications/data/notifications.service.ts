import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type {
  BuscarNotificacionesParams,
  NotificacionLog,
  NotificacionTestRequest,
} from '../models/notification.model';

const BASE = '/api/admin/notificaciones';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);

  log(params: Signal<BuscarNotificacionesParams>) {
    return httpResource<Page<NotificacionLog>>(
      () => ({ url: BASE, params: toHttpParams(params()) }),
      { defaultValue: emptyPage<NotificacionLog>() },
    );
  }

  enviarPrueba(req: NotificacionTestRequest) {
    return this.http.post<{ status: string }>(`${BASE}/test`, req);
  }
}

function toHttpParams(params: BuscarNotificacionesParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.idLicencia !== undefined) query['idLicencia'] = params.idLicencia;
  else if (params.tipoEvento) query['tipoEvento'] = params.tipoEvento;
  if (params.sort) query['sort'] = params.sort;
  return query;
}
