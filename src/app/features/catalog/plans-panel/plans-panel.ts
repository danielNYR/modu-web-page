import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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
import type { PlanModuloRequest, PlanRequest } from '@app/features/catalog/models/plan.model';

interface ModuloEdit {
  idModulo: number;
  nombre: string;
  habilitado: boolean;
  limiteUso: number | null;
  unidadLimite: string | null;
}

@Component({
  selector: 'moldhea-plans-panel',
  imports: [
    FormsModule,
    DecimalPipe,
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
  templateUrl: './plans-panel.html',
  styleUrl: './plans-panel.css',
})
export class PlansPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly filterProducto = signal<number | undefined>(undefined);
  protected readonly productosResource = this.catalogService.productos();
  protected readonly planesResource = this.catalogService.planes(this.filterProducto);

  protected productoNombre(idProducto: number): string {
    return this.productosResource.value().find((p) => p.id === idProducto)?.nombre ?? `#${idProducto}`;
  }

  // --- Crear plan ---------------------------------------------------------

  protected readonly showForm = signal(false);
  protected readonly formProducto = signal<number | undefined>(undefined);
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly precioMensual = signal<number | undefined>(undefined);
  protected readonly precioAnual = signal<number | undefined>(undefined);
  protected readonly trialDias = signal<number | undefined>(undefined);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  crear(): void {
    if (!this.formProducto() || !this.slug().trim() || !this.nombre().trim()) return;

    const req: PlanRequest = {
      idProducto: this.formProducto()!,
      slug: this.slug().trim(),
      nombre: this.nombre().trim(),
      precioMensual: this.precioMensual() ?? 0,
      precioAnual: this.precioAnual() ?? 0,
      trialDias: this.trialDias(),
    };

    this.saving.set(true);
    this.error.set(null);
    this.catalogService.crearPlan(req).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.slug.set('');
        this.nombre.set('');
        this.precioMensual.set(undefined);
        this.precioAnual.set(undefined);
        this.trialDias.set(undefined);
        this.planesResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo crear el plan.'));
      },
    });
  }

  cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoPlan(id, isActive).subscribe({
      next: () => this.planesResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }

  // --- Gestionar módulos del plan ------------------------------------------

  protected readonly managingPlanId = signal<number | undefined>(undefined);
  protected readonly moduleEdits = signal<ModuloEdit[]>([]);
  protected readonly moduleSaving = signal(false);

  private readonly managingIdProducto = computed(
    () => this.planesResource.value().find((p) => p.id === this.managingPlanId())?.idProducto,
  );
  protected readonly modulosDelProducto = this.catalogService.modulos(this.managingIdProducto);
  protected readonly modulosDelPlan = this.catalogService.modulosDelPlan(this.managingPlanId);

  constructor() {
    // Reconstruye la lista editable cuando cambian el plan seleccionado o llegan sus datos.
    effect(() => {
      const idPlan = this.managingPlanId();
      const catalogo = this.modulosDelProducto.value();
      const asignados = this.modulosDelPlan.value();
      if (!idPlan) {
        this.moduleEdits.set([]);
        return;
      }
      const asignadosMap = new Map(asignados.map((m) => [m.idModulo, m]));
      this.moduleEdits.set(
        catalogo.map((modulo) => {
          const actual = asignadosMap.get(modulo.id);
          return {
            idModulo: modulo.id,
            nombre: modulo.nombre,
            habilitado: actual?.habilitado ?? false,
            limiteUso: actual?.limiteUso ?? null,
            unidadLimite: actual?.unidadLimite ?? null,
          };
        }),
      );
    });
  }

  gestionarModulos(idPlan: number): void {
    this.managingPlanId.set(idPlan);
  }

  cerrarGestionModulos(): void {
    this.managingPlanId.set(undefined);
  }

  toggleModuleEdit(idModulo: number, habilitado: boolean): void {
    this.moduleEdits.set(
      this.moduleEdits().map((m) => (m.idModulo === idModulo ? { ...m, habilitado } : m)),
    );
  }

  setLimiteUso(idModulo: number, value: string): void {
    const limiteUso = value === '' ? null : Number(value);
    this.moduleEdits.set(
      this.moduleEdits().map((m) => (m.idModulo === idModulo ? { ...m, limiteUso } : m)),
    );
  }

  guardarModulos(): void {
    const idPlan = this.managingPlanId();
    if (!idPlan) return;

    const req: PlanModuloRequest[] = this.moduleEdits().map((m) => ({
      idModulo: m.idModulo,
      habilitado: m.habilitado,
      limiteUso: m.limiteUso,
      unidadLimite: m.unidadLimite,
    }));

    this.moduleSaving.set(true);
    this.error.set(null);
    this.catalogService.actualizarModulosDelPlan(idPlan, req).subscribe({
      next: () => {
        this.moduleSaving.set(false);
        this.modulosDelPlan.reload();
      },
      error: (err) => {
        this.moduleSaving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo actualizar los módulos del plan.'));
      },
    });
  }
}
