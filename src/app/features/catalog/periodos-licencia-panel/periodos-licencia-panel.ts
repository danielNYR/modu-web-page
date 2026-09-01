import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { extractErrorMessage } from '@app/core/http/error-message';
import { CatalogService } from '@app/features/catalog/data/catalog.service';
import type { PeriodoLicenciaRequest } from '@app/features/catalog/models/periodo-licencia.model';

@Component({
  selector: 'moldhea-periodos-licencia-panel',
  imports: [
    FormsModule,
    NgIcon,
    HlmBadge,
    HlmButtonImports,
    HlmInput,
    HlmLabel,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
  ],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './periodos-licencia-panel.html',
  styleUrl: './periodos-licencia-panel.css',
})
export class PeriodosLicenciaPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly periodosResource = this.catalogService.periodosLicencia();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | undefined>(undefined);

  protected readonly clave = signal('');
  protected readonly nombre = signal('');
  protected readonly duracionMeses = signal<number | undefined>(undefined);
  protected readonly esPrueba = signal(false);
  protected readonly renovacionCadaMeses = signal<number | undefined>(undefined);
  protected readonly descuentoVsMensualPct = signal<number | undefined>(undefined);
  protected readonly orden = signal<number | undefined>(undefined);

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected nuevoPeriodo(): void {
    this.editingId.set(undefined);
    this.resetForm();
    this.showForm.set(true);
  }

  protected editarPeriodo(id: number): void {
    const p = this.periodosResource.value().find((x) => x.idPeriodo === id);
    if (!p) return;
    this.editingId.set(id);
    this.clave.set(p.clave);
    this.nombre.set(p.nombre);
    this.duracionMeses.set(p.duracionMeses ?? undefined);
    this.esPrueba.set(p.esPrueba);
    this.renovacionCadaMeses.set(p.renovacionCadaMeses ?? undefined);
    this.descuentoVsMensualPct.set(p.descuentoVsMensualPct ?? undefined);
    this.orden.set(p.orden);
    this.error.set(null);
    this.showForm.set(true);
  }

  private resetForm(): void {
    this.clave.set('');
    this.nombre.set('');
    this.duracionMeses.set(undefined);
    this.esPrueba.set(false);
    this.renovacionCadaMeses.set(undefined);
    this.descuentoVsMensualPct.set(undefined);
    this.orden.set(undefined);
    this.error.set(null);
  }

  protected cancelarForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  protected guardar(): void {
    if (!this.clave().trim() || !this.nombre().trim()) return;

    const req: PeriodoLicenciaRequest = {
      clave: this.clave().trim().toUpperCase(),
      nombre: this.nombre().trim(),
      duracionMeses: this.duracionMeses() ?? null,
      esPrueba: this.esPrueba(),
      renovacionCadaMeses: this.renovacionCadaMeses() ?? null,
      descuentoVsMensualPct: this.descuentoVsMensualPct() ?? null,
      orden: this.orden() ?? 0,
    };

    this.saving.set(true);
    this.error.set(null);
    const id = this.editingId();
    const request$ = id
      ? this.catalogService.actualizarPeriodoLicencia(id, req)
      : this.catalogService.crearPeriodoLicencia(req);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.resetForm();
        this.periodosResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo guardar el periodo de licencia.'));
      },
    });
  }

  protected cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoPeriodoLicencia(id, isActive).subscribe({
      next: () => this.periodosResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }
}
