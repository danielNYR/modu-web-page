import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideUserCheck } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { AccountsService } from '../data/accounts.service';
import type { BuscarCuentasParams, EstatusUsuario, RegistryPhase } from '../models/account.model';

const ESTATUS_FILTERS: Array<{ label: string; value: EstatusUsuario | 'todos' }> = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activo', value: 'ACTIVO' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Eliminado', value: 'ELIMINADO' },
];

const FASE_FILTERS: Array<{ label: string; value: RegistryPhase | 'todas' }> = [
  { label: 'Todas las fases', value: 'todas' },
  { label: 'Sin verificar', value: 'CREATED' },
  { label: 'Verificado', value: 'VERIFIED' },
  { label: 'Datos personales', value: 'PERSONAL_REGISTERED' },
  { label: 'Institución creada', value: 'INSTITUTION_CREATED' },
  { label: 'Dirección', value: 'ADDRESS_ADDED' },
  { label: 'Plan elegido', value: 'MODULO_SELECCIONADOS' },
  { label: 'Completo', value: 'PAGADO' },
];

const ESTATUS_VARIANT: Record<EstatusUsuario, string> = {
  ACTIVO: 'default',
  SUSPENDIDO: 'destructive',
  ELIMINADO: 'outline',
};

@Component({
  selector: 'moldhea-accounts-list',
  imports: [
    DatePipe,
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
  providers: [provideIcons({ lucideSearch, lucideUserCheck })],
  templateUrl: './accounts-list.html',
})
export class AccountsList {
  private readonly accountsService = inject(AccountsService);

  protected readonly estatusFilters = ESTATUS_FILTERS;
  protected readonly faseFilters = FASE_FILTERS;
  protected readonly estatusVariant = ESTATUS_VARIANT;

  protected readonly activeEstatus = signal<EstatusUsuario | 'todos'>('todos');
  protected readonly activeFase = signal<RegistryPhase | 'todas'>('todas');
  protected readonly search = signal('');
  protected readonly page = signal(0);

  private readonly params = computed<BuscarCuentasParams>(() => {
    const estatus = this.activeEstatus();
    const fase = this.activeFase();

    return {
      q: this.search().trim() || undefined,
      estatus: estatus === 'todos' ? undefined : estatus,
      fase: fase === 'todas' ? undefined : fase,
      page: this.page(),
      size: 20,
    };
  });

  protected readonly cuentasResource = this.accountsService.list(this.params);

  protected setEstatus(value: EstatusUsuario | 'todos') {
    this.activeEstatus.set(value);
    this.page.set(0);
  }

  protected setFase(value: RegistryPhase | 'todas') {
    this.activeFase.set(value);
    this.page.set(0);
  }

  protected onSearch(value: string) {
    this.search.set(value);
    this.page.set(0);
  }

  protected phaseLabel(phase: string | null): string {
    const map: Record<string, string> = {
      CREATED: 'Sin verificar',
      VERIFIED: 'Verificado',
      GOOGLE_CREATED: 'Google',
      PERSONAL_REGISTERED: 'Datos pers.',
      INSTITUTION_CREATED: 'Institución',
      ADDRESS_ADDED: 'Dirección',
      MODULO_SELECCIONADOS: 'Plan elegido',
      PAGADO: 'Completo ✓',
    };
    return phase ? (map[phase] ?? phase) : '—';
  }
}
