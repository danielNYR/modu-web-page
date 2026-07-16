import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { ESTATUS_SUSCRIPCION, type EstatusSuscripcion } from '@app/core/models/enums';
import { ESTATUS_SUSCRIPCION_VARIANT } from '@app/core/models/badge-variants';
import { CatalogService } from '@app/features/catalog/data/catalog.service';
import { LicensesService } from '@app/features/licenses/data/licenses.service';
import type { BuscarLicenciasParams } from '@app/features/licenses/models/license.model';

const FILTERS: Array<{ label: string; value: EstatusSuscripcion | 'todas' }> = [
  { label: 'Todas', value: 'todas' },
  ...ESTATUS_SUSCRIPCION.map((estatus) => ({ label: capitalize(estatus), value: estatus })),
];

function capitalize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

@Component({
  selector: 'moldhea-licenses-list',
  imports: [
    FormsModule,
    RouterLink,
    PageHeader,
    Pagination,
    NgIcon,
    HlmButtonImports,
    HlmInput,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    HlmBadge,
  ],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './licenses-list.html',
  styleUrl: './licenses-list.css',
})
export class LicensesList {
  private readonly licensesService = inject(LicensesService);
  private readonly catalogService = inject(CatalogService);

  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<EstatusSuscripcion | 'todas'>('todas');
  protected readonly idProducto = signal<number | undefined>(undefined);
  protected readonly idTenant = signal<number | undefined>(undefined);
  protected readonly proximasAVencerDias = signal<number | undefined>(undefined);
  protected readonly page = signal(0);

  protected readonly productosResource = this.catalogService.productos();

  private readonly params = computed<BuscarLicenciasParams>(() => {
    const estatus = this.activeFilter();
    return {
      estatus: estatus === 'todas' ? undefined : estatus,
      idProducto: this.idProducto(),
      idTenant: this.idTenant(),
      proximasAVencerDias: this.proximasAVencerDias(),
      page: this.page(),
      size: 20,
    };
  });

  protected readonly licensesResource = this.licensesService.buscar(this.params);

  protected setFilter(value: EstatusSuscripcion | 'todas'): void {
    this.activeFilter.set(value);
    this.page.set(0);
  }

  protected onProductoChange(value: string): void {
    this.idProducto.set(value ? Number(value) : undefined);
    this.page.set(0);
  }

  protected onTenantChange(value: string): void {
    this.idTenant.set(value ? Number(value) : undefined);
    this.page.set(0);
  }

  protected onProximasAVencerChange(value: string): void {
    this.proximasAVencerDias.set(value ? Number(value) : undefined);
    this.page.set(0);
  }

  protected badgeVariant(status: EstatusSuscripcion) {
    return ESTATUS_SUSCRIPCION_VARIANT[status];
  }
}
