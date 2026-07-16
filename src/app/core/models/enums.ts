export type EstatusSuscripcion = 'TRIAL' | 'ACTIVA' | 'VENCIDA' | 'CANCELADA' | 'SUSPENDIDA';

export const ESTATUS_SUSCRIPCION: EstatusSuscripcion[] = [
  'TRIAL',
  'ACTIVA',
  'VENCIDA',
  'CANCELADA',
  'SUSPENDIDA',
];

export type Periodo = 'TRIAL' | 'MENSUAL' | 'ANUAL' | 'FOREVER';

export const PERIODOS: Periodo[] = ['TRIAL', 'MENSUAL', 'ANUAL', 'FOREVER'];

export type TipoDespliegue = 'CLOUD' | 'OFFLINE' | 'HYBRID';

export const TIPOS_DESPLIEGUE: TipoDespliegue[] = ['CLOUD', 'OFFLINE', 'HYBRID'];

export type TipoEventoNotificacion =
  | 'LICENCIA_GENERADA'
  | 'TRIAL_POR_VENCER'
  | 'LICENCIA_POR_VENCER'
  | 'LICENCIA_REVOCADA'
  | 'LICENCIA_EXTENDIDA';

export const TIPOS_EVENTO_NOTIFICACION: TipoEventoNotificacion[] = [
  'LICENCIA_GENERADA',
  'TRIAL_POR_VENCER',
  'LICENCIA_POR_VENCER',
  'LICENCIA_REVOCADA',
  'LICENCIA_EXTENDIDA',
];

export type EstatusTenant = 'TRIAL' | 'ACTIVO' | 'SUSPENDIDO' | 'CANCELADO' | 'ELIMINADO';

export const ESTATUS_TENANT: EstatusTenant[] = [
  'TRIAL',
  'ACTIVO',
  'SUSPENDIDO',
  'CANCELADO',
  'ELIMINADO',
];

/** Acciones registradas por el backend en /api/admin/auditoria (ver instrucciones_frontend.md §7). */
export const ACCIONES_AUDITORIA: string[] = [
  'LICENCIA_GENERADA',
  'LICENCIA_REVOCADA',
  'LICENCIA_EXTENDIDA',
  'PRODUCTO_CREADO',
  'PRODUCTO_ACTUALIZADO',
  'PLAN_CREADO',
  'PLAN_ACTUALIZADO',
  'PLAN_MODULOS_ACTUALIZADOS',
  'MODULO_CREADO',
  'MODULO_ACTUALIZADO',
  'MODULO_DEPENDENCIA_CREADA',
  'MODULO_DEPENDENCIA_ELIMINADA',
];
