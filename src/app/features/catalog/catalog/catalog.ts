import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsContent, HlmTabsList, HlmTabsTrigger, HlmTabs } from '@spartan-ng/helm/tabs';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { ProductsPanel } from '@app/features/catalog/products-panel/products-panel';
import { PlansPanel } from '@app/features/catalog/plans-panel/plans-panel';
import { ModulesPanel } from '@app/features/catalog/modules-panel/modules-panel';
import { PackagesPanel } from '@app/features/catalog/packages-panel/packages-panel';
import { DescuentosPanel } from '@app/features/catalog/descuentos-panel/descuentos-panel';
import { PeriodosLicenciaPanel } from '@app/features/catalog/periodos-licencia-panel/periodos-licencia-panel';

const CATALOG_TABS = new Set(['productos', 'planes', 'modulos', 'paquetes', 'descuentos', 'periodos-licencia']);

@Component({
  selector: 'moldhea-catalog',
  imports: [
    PageHeader,
    HlmCardImports,
    HlmTabs,
    HlmTabsList,
    HlmTabsTrigger,
    HlmTabsContent,
    ProductsPanel,
    PlansPanel,
    ModulesPanel,
    PackagesPanel,
    DescuentosPanel,
    PeriodosLicenciaPanel,
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly activeTab = signal(this.initialTab());

  protected selectTab(tab: string): void {
    if (!CATALOG_TABS.has(tab)) return;
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private initialTab(): string {
    const tab = this.route.snapshot.queryParamMap.get('tab') ?? 'productos';
    return CATALOG_TABS.has(tab) ? tab : 'productos';
  }
}
