import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { extractErrorMessage } from '@app/core/http/error-message';
import { CatalogService } from '@app/features/catalog/data/catalog.service';
import type { ModuloDependencia, ModuloRequest } from '@app/features/catalog/models/modulo.model';

@Component({
  selector: 'moldhea-modules-panel',
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
  providers: [provideIcons({ lucidePlus, lucideTrash2 })],
  templateUrl: './modules-panel.html',
  styleUrl: './modules-panel.css',
})
export class ModulesPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly filterProducto = signal<number | undefined>(undefined);
  protected readonly productosResource = this.catalogService.productos();
  protected readonly modulosResource = this.catalogService.modulos(this.filterProducto);

  // --- Crear módulo --------------------------------------------------------

  protected readonly showForm = signal(false);
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly esCore = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  crear(): void {
    const idProducto = this.filterProducto();
    if (!idProducto || !this.slug().trim() || !this.nombre().trim()) return;

    const req: ModuloRequest = {
      idProducto,
      slug: this.slug().trim(),
      nombre: this.nombre().trim(),
      esCore: this.esCore(),
    };

    this.saving.set(true);
    this.error.set(null);
    this.catalogService.crearModulo(req).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.slug.set('');
        this.nombre.set('');
        this.esCore.set(false);
        this.modulosResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo crear el módulo.'));
      },
    });
  }

  cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoModulo(id, isActive).subscribe({
      next: () => this.modulosResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }

  // --- Dependencias ----------------------------------------------------------

  protected readonly managingModuloId = signal<number | undefined>(undefined);
  protected readonly nuevaDependenciaId = signal<number | undefined>(undefined);
  protected readonly nuevaDependenciaHard = signal(true);
  protected readonly depError = signal<string | null>(null);

  protected readonly dependenciasResource = httpResource<ModuloDependencia[]>(
    () => {
      const id = this.managingModuloId();
      return id === undefined ? undefined : { url: `/api/admin/catalogo/modulos/${id}/dependencias` };
    },
    { defaultValue: [] },
  );

  protected readonly candidatosDependencia = computed(() =>
    this.modulosResource.value().filter((m) => m.id !== this.managingModuloId()),
  );

  gestionarDependencias(idModulo: number): void {
    this.managingModuloId.set(idModulo);
  }

  cerrarDependencias(): void {
    this.managingModuloId.set(undefined);
    this.nuevaDependenciaId.set(undefined);
  }

  nombreModulo(id: number): string {
    return this.modulosResource.value().find((m) => m.id === id)?.nombre ?? `#${id}`;
  }

  agregarDependencia(): void {
    const id = this.managingModuloId();
    const idModuloReq = this.nuevaDependenciaId();
    if (!id || !idModuloReq) return;

    this.depError.set(null);
    this.catalogService.crearDependencia(id, { idModuloReq, esHard: this.nuevaDependenciaHard() }).subscribe({
      next: () => {
        this.nuevaDependenciaId.set(undefined);
        this.dependenciasResource.reload();
      },
      error: (err) => this.depError.set(extractErrorMessage(err, 'No se pudo agregar la dependencia.')),
    });
  }

  eliminarDependencia(idModuloReq: number): void {
    const id = this.managingModuloId();
    if (!id) return;

    this.depError.set(null);
    this.catalogService.eliminarDependencia(id, idModuloReq).subscribe({
      next: () => this.dependenciasResource.reload(),
      error: (err) => this.depError.set(extractErrorMessage(err, 'No se pudo eliminar la dependencia.')),
    });
  }
}
