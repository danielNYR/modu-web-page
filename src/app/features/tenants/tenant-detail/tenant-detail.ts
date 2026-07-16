import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { ESTATUS_SUSCRIPCION_VARIANT, ESTATUS_TENANT_VARIANT } from '@app/core/models/badge-variants';
import { TenantsService } from '@app/features/tenants/data/tenants.service';

@Component({
  selector: 'moldhea-tenant-detail',
  imports: [
    RouterLink,
    NgIcon,
    HlmBadge,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
  ],
  providers: [provideIcons({ lucideArrowLeft })],
  templateUrl: './tenant-detail.html',
  styleUrl: './tenant-detail.css',
})
export class TenantDetail {
  private readonly tenantsService = inject(TenantsService);

  readonly idTenant = input<string>();

  private readonly idTenantNum = computed(() => {
    const raw = this.idTenant();
    return raw ? Number(raw) : undefined;
  });

  protected readonly tenantResource = this.tenantsService.detail(this.idTenantNum);

  protected tenantEstatusVariant = ESTATUS_TENANT_VARIANT;
  protected licenciaEstatusVariant = ESTATUS_SUSCRIPCION_VARIANT;
}
