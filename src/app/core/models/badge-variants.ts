import type { EstatusSuscripcion, EstatusTenant } from './enums';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export const ESTATUS_SUSCRIPCION_VARIANT: Record<EstatusSuscripcion, BadgeVariant> = {
  TRIAL: 'secondary',
  ACTIVA: 'default',
  VENCIDA: 'destructive',
  CANCELADA: 'outline',
  SUSPENDIDA: 'destructive',
};

export const ESTATUS_TENANT_VARIANT: Record<EstatusTenant, BadgeVariant> = {
  TRIAL: 'secondary',
  ACTIVO: 'default',
  SUSPENDIDO: 'destructive',
  CANCELADO: 'outline',
  ELIMINADO: 'outline',
};
