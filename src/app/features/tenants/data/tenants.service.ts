import { Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type { BuscarTenantsParams, TenantDetail, TenantListItem } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  list(params: Signal<BuscarTenantsParams>) {
    return httpResource<Page<TenantListItem>>(
      () => ({
        url: '/api/admin/tenants',
        params: toHttpParams(params()),
      }),
      { defaultValue: emptyPage<TenantListItem>() },
    );
  }

  detail(idTenant: Signal<number | undefined>) {
    return httpResource<TenantDetail | undefined>(() => {
      const id = idTenant();
      return id === undefined ? undefined : { url: `/api/admin/tenants/${id}` };
    });
  }
}

function toHttpParams(params: BuscarTenantsParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.estatus) query['estatus'] = params.estatus;
  else if (params.q) query['q'] = params.q;
  if (params.sort) query['sort'] = params.sort;
  return query;
}
