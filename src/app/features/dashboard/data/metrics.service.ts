import { Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import type { DashboardMetrics } from '../models/metrics.model';
import type { Licencia } from '@app/features/licenses/models/license.model';

const BASE = '/api/admin/metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  dashboard() {
    return httpResource<DashboardMetrics>(() => ({ url: `${BASE}/dashboard` }));
  }

  proximasAVencer(dias: Signal<number>) {
    return httpResource<Licencia[]>(
      () => ({ url: `${BASE}/licencias/proximas-a-vencer`, params: { dias: dias() } }),
      { defaultValue: [] },
    );
  }
}
