import type { EstatusTenant } from '@app/core/models/enums';
import type { Licencia } from '@app/features/licenses/models/license.model';

/**
 * El backend no documenta el shape exacto de TenantListItemResponse / TenantDetailResponse /
 * UsuarioResumenResponse en instrucciones_frontend.md más allá de "resumida" / "detalle completo
 * con usuarios y licencias". Campos abajo son el mejor esfuerzo a partir del dominio descrito
 * (tenant = cuenta cliente, usuario = persona dentro del tenant) — verificar contra payloads
 * reales y ajustar cuando se valide la integración.
 */
export interface TenantListItem {
  idTenant: number;
  nombre: string;
  estatus: EstatusTenant;
  creadoEn?: string;
}

export interface UsuarioResumen {
  idUsuario: number;
  nombre: string;
  email: string;
  rol?: string;
}

export interface TenantDetail extends TenantListItem {
  usuarios: UsuarioResumen[];
  licencias: Licencia[];
}

export interface BuscarTenantsParams {
  estatus?: EstatusTenant;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
}
