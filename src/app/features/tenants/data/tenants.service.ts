import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { emptyPage, type Page } from '@app/core/models/page.model';
import type {
  BuscarTenantsParams,
  EntitlementResponse,
  TenantDetail,
  TenantListItem,
} from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private readonly http = inject(HttpClient);

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

  entitlements(idTenant: Signal<number | undefined>) {
    return httpResource<EntitlementResponse | undefined>(() => {
      const id = idTenant();
      return id === undefined ? undefined : { url: `/api/tenants/${id}/entitlements` };
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
