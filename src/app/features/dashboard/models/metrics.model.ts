import type { EstatusSuscripcion, EstatusTenant } from '@app/core/models/enums';

export interface DashboardMetrics {
  licenciasPorEstatus: Record<EstatusSuscripcion, number>;
  tenantsPorEstatus: Record<EstatusTenant, number>;
  totalTenants: number;
  totalLicenciasActivas: number;
  proximasAVencer7dias: number;
  revenueMesActual: number;
  revenueMesAnterior: number;
}

export interface RevenuePeriodo {
  periodo: string;
  total: number;
}

export interface ChurnResponse {
  desde: string;
  hasta: string;
  canceladasEnPeriodo: number;
  activasAhora: number;
  churnRateAproximado: number;
}
