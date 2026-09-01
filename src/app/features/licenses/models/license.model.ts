import type { EstatusSuscripcion, TipoDespliegue } from '@app/core/models/enums';

export interface ModuloHabilitado {
  idModulo: number;
  slug: string;
  nombre: string;
  limiteUso: number | null;
  unidadLimite: string | null;
}

export interface Licencia {
  idLicencia: number;
  idTenant: number;
  idUsuario: number;
  planSlug: string;
  planNombre: string | null;
  periodo: string;
  estatus: EstatusSuscripcion;
  tipoDespliegue: TipoDespliegue;
  fechaInicio: string;
  fechaFin: string | null;
  diasGraciaOffline: number;
  claveOffline: string | null;
  modulosHabilitados: ModuloHabilitado[];
  creadoEn: string;
}

export interface ModuloOverride {
  idModulo: number;
  habilitado: boolean;
  limiteUso?: number | null;
  razon?: string;
}

export interface GenerarLicenciaRequest {
  idUsuario: number;
  idTenant: number;
  idPlan: number;
  idProducto: number;
  periodo: string;
  tipoDespliegue?: TipoDespliegue;
  modulosOverride?: ModuloOverride[];
}

export interface RevocarLicenciaRequest {
  razon?: string;
}

export interface ExtenderLicenciaRequest {
  nuevaFechaFin: string;
}

export interface BuscarLicenciasParams {
  estatus?: EstatusSuscripcion;
  idProducto?: number;
  idTenant?: number;
  proximasAVencerDias?: number;
  page?: number;
  size?: number;
  sort?: string;
}
