import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { ACCIONES_AUDITORIA } from '@app/core/models/enums';
import { AuditService } from '@app/features/audit/data/audit.service';
import type { AuditFilterMode, BuscarAuditoriaParams } from '@app/features/audit/models/audit.model';

const MODES: Array<{ label: string; value: AuditFilterMode }> = [
  { label: 'Todo', value: 'ninguno' },
  { label: 'Por entidad', value: 'entidad' },
  { label: 'Por acción', value: 'accion' },
  { label: 'Por rango de fechas', value: 'rango' },
  { label: 'Por tenant', value: 'tenant' },
];

@Component({
  selector: 'moldhea-audit-list',
  imports: [
    FormsModule,
    PageHeader,
    Pagination,
    HlmBadge,
    HlmCardImports,
    HlmInput,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
  ],
  templateUrl: './audit-list.html',
  styleUrl: './audit-list.css',
})
export class AuditList {
  private readonly auditService = inject(AuditService);

  protected readonly modes = MODES;
  protected readonly mode = signal<AuditFilterMode>('ninguno');

  protected readonly acciones = ACCIONES_AUDITORIA;

  protected readonly entidad = signal('');
  protected readonly entidadId = signal('');
  protected readonly accion = signal('');
  protected readonly desde = signal('');
  protected readonly hasta = signal('');
  protected readonly idTenant = signal<number | undefined>(undefined);
  protected readonly page = signal(0);

  private readonly params = computed<BuscarAuditoriaParams>(() => {
    const mode = this.mode();
    const base = { page: this.page(), size: 20 };
    switch (mode) {
      case 'entidad':
        return { ...base, entidad: this.entidad() || undefined, entidadId: this.entidadId() || undefined };
      case 'accion':
        return { ...base, accion: this.accion() || undefined };
      case 'rango':
        return { ...base, desde: this.desde() || undefined, hasta: this.hasta() || undefined };
      case 'tenant':
        return { ...base, idTenant: this.idTenant() };
      default:
        return base;
    }
  });

  protected readonly logResource = this.auditService.log(this.params);

  setMode(mode: AuditFilterMode): void {
    this.mode.set(mode);
    this.page.set(0);
  }

  setEntidad(value: string): void {
    this.entidad.set(value);
    this.page.set(0);
  }

  setEntidadId(value: string): void {
    this.entidadId.set(value);
    this.page.set(0);
  }

  setAccion(value: string): void {
    this.accion.set(value);
    this.page.set(0);
  }

  setDesde(value: string): void {
    this.desde.set(value);
    this.page.set(0);
  }

  setHasta(value: string): void {
    this.hasta.set(value);
    this.page.set(0);
  }

  setIdTenant(value: string): void {
    this.idTenant.set(value ? Number(value) : undefined);
    this.page.set(0);
  }
}
