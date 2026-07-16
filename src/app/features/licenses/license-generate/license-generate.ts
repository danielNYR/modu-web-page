import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { PERIODOS, TIPOS_DESPLIEGUE, type Periodo, type TipoDespliegue } from '@app/core/models/enums';
import { extractErrorMessage } from '@app/core/http/error-message';
import { CatalogService } from '@app/features/catalog/data/catalog.service';
import { LicensesService } from '@app/features/licenses/data/licenses.service';
import type { GenerarLicenciaRequest, ModuloOverride } from '@app/features/licenses/models/license.model';

@Component({
  selector: 'moldhea-license-generate',
  imports: [FormsModule, RouterLink, NgIcon, HlmButtonImports, HlmCardImports, HlmInput, HlmLabel],
  providers: [provideIcons({ lucideArrowLeft })],
  templateUrl: './license-generate.html',
  styleUrl: './license-generate.css',
})
export class LicenseGenerate {
  private readonly catalogService = inject(CatalogService);
  private readonly licensesService = inject(LicensesService);
  private readonly router = inject(Router);

  protected readonly periodos = PERIODOS;
  protected readonly tiposDespliegue = TIPOS_DESPLIEGUE;

  protected readonly idTenant = signal<number | undefined>(undefined);
  protected readonly idUsuario = signal<number | undefined>(undefined);
  protected readonly idProducto = signal<number | undefined>(undefined);
  protected readonly idPlan = signal<number | undefined>(undefined);
  protected readonly periodo = signal<Periodo>('MENSUAL');
  protected readonly tipoDespliegue = signal<TipoDespliegue>('CLOUD');

  /** idModulo -> habilitado, solo para módulos que el usuario cambió respecto al default del plan. */
  protected readonly moduleOverrides = signal<Map<number, boolean>>(new Map());

  protected readonly productosResource = this.catalogService.productos();
  protected readonly planesResource = this.catalogService.planes(this.idProducto);
  protected readonly modulosPlanResource = this.catalogService.modulosDelPlan(this.idPlan);

  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly claveOffline = signal<string | null>(null);
  protected readonly licenciaCreadaId = signal<number | null>(null);

  protected readonly canSubmit = computed(
    () => !!this.idTenant() && !!this.idUsuario() && !!this.idPlan() && !!this.idProducto(),
  );

  onProductoChange(value: string): void {
    this.idProducto.set(value ? Number(value) : undefined);
    this.idPlan.set(undefined);
    this.moduleOverrides.set(new Map());
  }

  onPlanChange(value: string): void {
    this.idPlan.set(value ? Number(value) : undefined);
    this.moduleOverrides.set(new Map());
  }

  toggleModulo(idModulo: number, defaultHabilitado: boolean, checked: boolean): void {
    const next = new Map(this.moduleOverrides());
    if (checked === defaultHabilitado) {
      next.delete(idModulo);
    } else {
      next.set(idModulo, checked);
    }
    this.moduleOverrides.set(next);
  }

  isChecked(idModulo: number, defaultHabilitado: boolean): boolean {
    return this.moduleOverrides().get(idModulo) ?? defaultHabilitado;
  }

  submit(): void {
    if (!this.canSubmit()) return;

    const modulosOverride: ModuloOverride[] = Array.from(this.moduleOverrides().entries()).map(
      ([idModulo, habilitado]) => ({ idModulo, habilitado }),
    );

    const req: GenerarLicenciaRequest = {
      idTenant: this.idTenant()!,
      idUsuario: this.idUsuario()!,
      idProducto: this.idProducto()!,
      idPlan: this.idPlan()!,
      periodo: this.periodo(),
      tipoDespliegue: this.tipoDespliegue(),
      ...(modulosOverride.length ? { modulosOverride } : {}),
    };

    this.submitting.set(true);
    this.submitError.set(null);
    this.licensesService.generar(req).subscribe({
      next: (licencia) => {
        this.submitting.set(false);
        this.licenciaCreadaId.set(licencia.idLicencia);
        this.claveOffline.set(licencia.claveOffline);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(extractErrorMessage(err, 'No se pudo generar la licencia.'));
      },
    });
  }

  goToLicencia(): void {
    const id = this.licenciaCreadaId();
    if (id) this.router.navigate(['/licencias', id]);
  }
}
