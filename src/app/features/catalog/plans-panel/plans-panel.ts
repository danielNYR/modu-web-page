import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
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
    CurrencyPipe,
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
  protected readonly girosResource = this.catalogService.giros();
  protected readonly planesResource = this.catalogService.planes(this.filterProducto);

  protected productoNombre(idProducto: number): string {
    return this.productosResource.value().find((p) => p.idProducto === idProducto)?.nombre ?? `#${idProducto}`;
  }

  // --- Crear plan ---------------------------------------------------------

  protected readonly showForm = signal(false);
  protected readonly formProducto = signal<number | undefined>(undefined);
  protected readonly formGiros = signal<Set<number>>(new Set());
  protected readonly formModulos = signal<Set<number>>(new Set());
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly precioMensual = signal<number | undefined>(undefined);
  protected readonly precioAnual = signal<number | undefined>(undefined);
  /** true cuando el usuario editó manualmente el precio anual (desvincula el cálculo automático) */
  protected readonly precioAnualEditado = signal(false);
  protected readonly tieneTrialEnabled = signal(false);
  protected readonly trialDias = signal<number | undefined>(undefined);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  /**
   * Valor mostrado en el campo de precio anual.
   * Se actualiza imperativamante — evita la cadena computed→ngModel que no propaga en Angular 22.
   */
  protected readonly precioAnualDisplay = signal<number | undefined>(undefined);

  protected onPrecioMensualChange(val: number | null): void {
    const num = val !== null && val !== undefined && !isNaN(val) ? val : undefined;
    this.precioMensual.set(num);
    if (!this.precioAnualEditado()) {
      // Actualiza el campo anual directamente: mensual × 12 con 10% de descuento
      this.precioAnualDisplay.set(
        num != null ? Math.round(num * 12 * 0.9 * 100) / 100 : undefined,
      );
    }
  }

  protected onPrecioAnualChange(val: number | null): void {
    const num = val !== null && val !== undefined && !isNaN(val) ? val : undefined;
    this.precioAnualDisplay.set(num);
    this.precioAnualEditado.set(num !== undefined);
  }

  protected readonly ahorroPorPlan = computed(() =>
    this.planesResource.value().map((p) => {
      if (!p.precioMensual || !p.precioAnual || p.precioAnual <= 0) return { idPlan: p.idPlan, ahorro: 0 };
      const ahorro = Math.round(p.precioMensual * 12 - p.precioAnual);
      return { idPlan: p.idPlan, ahorro: ahorro > 0 ? ahorro : 0 };
    }),
  );

  protected ahorroDelPlan(idPlan: number): number {
    return this.ahorroPorPlan().find((a) => a.idPlan === idPlan)?.ahorro ?? 0;
  }

  protected giroNombres(idGiros: number[] | undefined): string {
    if (!idGiros || !idGiros.length) return '—';
    return idGiros
      .map((idGiro) => this.girosResource.value().find((g) => g.idGiro === idGiro)?.nombreGiro ?? `#${idGiro}`)
      .join(', ');
  }

  // --- Selección de módulos y giro(s) en el formulario de creación --------

  protected readonly modulosDelFormulario = this.catalogService.modulos(this.formProducto);

  protected toggleFormGiro(idGiro: number): void {
    const next = new Set(this.formGiros());
    next.has(idGiro) ? next.delete(idGiro) : next.add(idGiro);
    this.formGiros.set(next);
  }

  protected toggleFormModulo(idModulo: number): void {
    const next = new Set(this.formModulos());
    next.has(idModulo) ? next.delete(idModulo) : next.add(idModulo);
    this.formModulos.set(next);
  }

  /** Suma del precio mensual base de los módulos marcados — punto de partida para el descuento. */
  protected readonly precioBase = computed(() => {
    const seleccionados = this.formModulos();
    return this.modulosDelFormulario
      .value()
      .filter((m) => seleccionados.has(m.idModulo))
      .reduce((sum, m) => sum + (m.precioMensualBase ?? 0), 0);
  });

  protected readonly todosLosModulosSeleccionados = computed(() => {
    const total = this.modulosDelFormulario.value().length;
    return total > 0 && this.formModulos().size === total;
  });

  /** 10/15/20% si es una selección parcial de módulos, 15/25/35% si se marcaron todos. */
  protected readonly descuentoPcts = signal<[number, number, number]>([10, 15, 20]);

  constructor() {
    // Auto-selecciona el producto cuando solo hay uno (Ej. Modular)
    effect(() => {
      const productos = this.productosResource.value();
      if (productos.length === 1 && this.formProducto() === undefined) {
        this.formProducto.set(productos[0].idProducto);
      }
    });

    // Cambia el set de descuentos sugeridos solo en la transición parcial↔todos —
    // no pisa una edición manual del admin en cada render.
    let todosPrevio: boolean | undefined;
    effect(() => {
      const todos = this.todosLosModulosSeleccionados();
      if (todos !== todosPrevio) {
        this.descuentoPcts.set(todos ? [15, 25, 35] : [10, 15, 20]);
        todosPrevio = todos;
      }
    });

    // Reconstruye la lista editable cuando cambian el plan seleccionado o llegan sus datos
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
          const actual = asignadosMap.get(modulo.idModulo);
          return {
            idModulo: modulo.idModulo,
            nombre: modulo.nombre,
            habilitado: actual?.habilitado ?? false,
            limiteUso: actual?.limiteUso ?? null,
            unidadLimite: actual?.unidadLimite ?? null,
          };
        }),
      );
    });
  }

  protected setDescuentoPct(index: number, value: number): void {
    if (index < 0 || index > 2) return;
    const next = [...this.descuentoPcts()] as [number, number, number];
    next[index] = value;
    this.descuentoPcts.set(next);
  }

  protected precioConDescuento(pct: number): number {
    return Math.round(this.precioBase() * (1 - pct / 100) * 100) / 100;
  }

  protected aplicarDescuento(pct: number): void {
    this.onPrecioMensualChange(this.precioConDescuento(pct));
  }

  private resetForm(): void {
    this.formGiros.set(new Set());
    this.formModulos.set(new Set());
    this.slug.set('');
    this.nombre.set('');
    this.precioMensual.set(undefined);
    this.precioAnual.set(undefined);
    this.precioAnualDisplay.set(undefined);
    this.precioAnualEditado.set(false);
    this.tieneTrialEnabled.set(false);
    this.trialDias.set(undefined);
    this.error.set(null);
    // Volver a auto-seleccionar si hay un solo producto
    const productos = this.productosResource.value();
    if (productos.length === 1) {
      this.formProducto.set(productos[0].idProducto);
    }
  }

  protected cancelarForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  crear(): void {
    if (!this.formProducto() || !this.slug().trim() || !this.nombre().trim()) return;

    const req: PlanRequest = {
      idProducto: this.formProducto()!,
      idGiros: [...this.formGiros()],
      slug: this.slug().trim(),
      nombre: this.nombre().trim(),
      precioMensual: this.precioMensual() ?? 0,
      precioAnual: this.precioAnualDisplay() ?? 0,
      trialDias: this.tieneTrialEnabled() ? (this.trialDias() ?? 14) : 0,
      modulos: [...this.formModulos()].map((idModulo) => ({
        idModulo,
        habilitado: true,
        limiteUso: null,
        unidadLimite: null,
      })),
    };

    this.saving.set(true);
    this.error.set(null);
    this.catalogService.crearPlan(req).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.resetForm();
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
    () => this.planesResource.value().find((p) => p.idPlan === this.managingPlanId())?.idProducto,
  );
  protected readonly modulosDelProducto = this.catalogService.modulos(this.managingIdProducto);
  protected readonly modulosDelPlan = this.catalogService.modulosDelPlan(this.managingPlanId);

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
