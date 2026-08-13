import type { EstatusSuscripcion, EstatusTenant } from '@app/core/models/enums';
import type { Licencia } from '@app/features/licenses/models/license.model';

export interface TenantListItem {
  idTenant: number;
  ulid: string;
  nombre: string;
  slug: string;
  pais: string | null;
  estatus: EstatusTenant;
  trialFin: string | null;
  creadoEn: string;
}

export interface UsuarioResumen {
  idUsuario: number;
  email: string;
  nombre: string;
  apellido: string | null;
  estatus: string | null;
  creadoEn: string;
}

export interface TenantDetail extends TenantListItem {
  suspensionRazon: string | null;
  usuarios: UsuarioResumen[];
  licencias: Licencia[];
}

export type ModoAcceso = 'FULL' | 'READ_ONLY' | 'BLOCKED';

export interface EntitlementResponse {
  idTenant: number;
  licenciaEstado: EstatusSuscripcion | null;
  planSlug: string | null;
  planNombre: string | null;
  modulos: string[];
  renovacion: string | null;
  trialFin: string | null;
  modoAcceso: ModoAcceso;
}

export interface BuscarTenantsParams {
  estatus?: EstatusTenant;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
}
