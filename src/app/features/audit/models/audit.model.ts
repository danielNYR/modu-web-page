export interface AuditoriaLog {
  id: number;
  idUsuario: number | null;
  idTenant: number | null;
  accion: string;
  entidad: string;
  entidadId: string;
  resultado: string;
  metadata: Record<string, unknown> | null;
  creadoEn: string;
}

/**
 * Los filtros del backend NO se combinan entre sí (if/else secuencial, ver
 * instrucciones_frontend.md §7): solo se aplica el primero que matchee, en este orden de
 * prioridad: entidad+entidadId > accion > desde+hasta > idTenant > (nada, devuelve todo).
 */
export type AuditFilterMode = 'ninguno' | 'entidad' | 'accion' | 'rango' | 'tenant';

export interface BuscarAuditoriaParams {
  entidad?: string;
  entidadId?: string;
  accion?: string;
  desde?: string;
  hasta?: string;
  idTenant?: number;
  page?: number;
  size?: number;
  sort?: string;
}
