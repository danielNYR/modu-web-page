import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { ESTATUS_TENANT, type EstatusTenant } from '@app/core/models/enums';
import { ESTATUS_TENANT_VARIANT } from '@app/core/models/badge-variants';
import { TenantsService } from '@app/features/tenants/data/tenants.service';
import type { BuscarTenantsParams } from '@app/features/tenants/models/tenant.model';

const FILTERS: Array<{ label: string; value: EstatusTenant | 'todos' }> = [
  { label: 'Todos', value: 'todos' },
  ...ESTATUS_TENANT.map((estatus) => ({ label: capitalize(estatus), value: estatus })),
];

function capitalize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

@Component({
  selector: 'moldhea-tenants-list',
  imports: [
    FormsModule,
    RouterLink,
    PageHeader,
    Pagination,
    NgIcon,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    HlmBadge,
  ],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './tenants-list.html',
  styleUrl: './tenants-list.css',
})
export class TenantsList {
  private readonly tenantsService = inject(TenantsService);

  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<EstatusTenant | 'todos'>('todos');
  protected readonly search = signal('');
  protected readonly page = signal(0);

  private readonly params = computed<BuscarTenantsParams>(() => {
    const estatus = this.activeFilter();
    return {
      estatus: estatus === 'todos' ? undefined : estatus,
      q: this.search().trim() || undefined,
      page: this.page(),
      size: 20,
    };
  });

  protected readonly tenantsResource = this.tenantsService.list(this.params);

  protected setFilter(value: EstatusTenant | 'todos'): void {
    this.activeFilter.set(value);
    this.page.set(0);
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(0);
  }

  protected estatusVariant(estatus: EstatusTenant) {
    return ESTATUS_TENANT_VARIANT[estatus];
  }
}
