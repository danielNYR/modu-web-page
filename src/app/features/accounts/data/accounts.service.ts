import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type {
  BuscarCuentasParams,
  CuentaDetalle,
  CuentaListItem,
} from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly http = inject(HttpClient);

  list(params: Signal<BuscarCuentasParams>) {
    return httpResource<Page<CuentaListItem>>(
      () => ({
        url: '/api/admin/cuentas/buscar',
        params: toHttpParams(params()),
      }),
      { defaultValue: emptyPage<CuentaListItem>() },
    );
  }

  detail(idUsuario: Signal<number | undefined>) {
    return httpResource<CuentaDetalle | undefined>(() => {
      const id = idUsuario();
      return id === undefined ? undefined : { url: `/api/admin/cuentas/${id}` };
    });
  }

  suspender(idUsuario: number, razon: string) {
    return this.http.post(`/api/admin/cuentas/${idUsuario}/suspender`, null, {
      params: { razon },
    });
  }

  reactivar(idUsuario: number) {
    return this.http.post(`/api/admin/cuentas/${idUsuario}/reactivar`, null);
  }

  verificarEmail(idUsuario: number) {
    return this.http.post(`/api/admin/cuentas/${idUsuario}/verificar-email`, null);
  }

  revocarSesiones(idUsuario: number) {
    return this.http.delete(`/api/admin/cuentas/${idUsuario}/sesiones`);
  }
}

function toHttpParams(p: BuscarCuentasParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: p.page ?? 0,
    size: p.size ?? 20,
  };
  if (p.q) query['q'] = p.q;
  if (p.estatus) query['estatus'] = p.estatus;
  if (p.fase) query['fase'] = p.fase;
  return query;
}
