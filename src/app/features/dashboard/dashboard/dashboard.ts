import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideBuilding2, lucideClock, lucideKeyRound, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { StatCard } from '@app/shared/components/stat-card/stat-card';
import { ESTATUS_SUSCRIPCION_VARIANT, type BadgeVariant } from '@app/core/models/badge-variants';
import type { EstatusSuscripcion } from '@app/core/models/enums';
import { MetricsService } from '@app/features/dashboard/data/metrics.service';

@Component({
  selector: 'moldhea-dashboard',
  imports: [
    RouterLink,
    DecimalPipe,
    KeyValuePipe,
    PageHeader,
    StatCard,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    HlmBadge,
  ],
  providers: [provideIcons({ lucideBuilding2, lucideKeyRound, lucideClock, lucideTrendingUp })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly metricsService = inject(MetricsService);

  protected readonly metricsResource = this.metricsService.dashboard();
  protected readonly proximasAVencerDias = signal(7);
  protected readonly proximasAVencerResource = this.metricsService.proximasAVencer(this.proximasAVencerDias);

  protected estatusVariant(estatus: string): BadgeVariant {
    return ESTATUS_SUSCRIPCION_VARIANT[estatus as EstatusSuscripcion];
  }

  protected readonly revenueDelta = computed(() => {
    const metrics = this.metricsResource.value();
    if (!metrics || !metrics.revenueMesAnterior) return null;
    return ((metrics.revenueMesActual - metrics.revenueMesAnterior) / metrics.revenueMesAnterior) * 100;
  });
}
