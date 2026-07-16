import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsContent, HlmTabsList, HlmTabsTrigger, HlmTabs } from '@spartan-ng/helm/tabs';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { ProductsPanel } from '@app/features/catalog/products-panel/products-panel';
import { PlansPanel } from '@app/features/catalog/plans-panel/plans-panel';
import { ModulesPanel } from '@app/features/catalog/modules-panel/modules-panel';

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
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {}
