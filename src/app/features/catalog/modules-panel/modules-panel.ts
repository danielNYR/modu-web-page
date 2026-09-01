import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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
import { Pagination } from '@app/shared/components/pagination/pagination';
import { CatalogService } from '@app/features/catalog/data/catalog.service';
import { CATEGORIAS_MODULO } from '@app/features/catalog/models/modulo.model';
import type { Modulo, ModuloAdminRequest, ModuloDependencia, ModuloRequest } from '@app/features/catalog/models/modulo.model';

@Component({
  selector: 'moldhea-modules-panel',
  imports: [
    DecimalPipe,
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
    Pagination,
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
  protected readonly page = signal(0);
  protected readonly pageSize = 10;
  protected readonly totalElements = computed(() => this.modulosResource.value().length);
  protected readonly totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize));
  protected readonly paginatedModulos = computed(() => {
    const start = this.page() * this.pageSize;
    return this.modulosResource.value().slice(start, start + this.pageSize);
  });

  protected cambiarProducto(idProducto: number | undefined): void {
    this.filterProducto.set(idProducto);
    this.page.set(0);
  }

  protected cambiarPagina(page: number): void {
    this.page.set(Math.max(0, Math.min(page, Math.max(this.totalPages() - 1, 0))));
  }

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

  // --- Edición de campos de negocio (precio, categoría, addon) ----------------

  protected readonly CATEGORIAS = CATEGORIAS_MODULO;
  protected readonly editingModulo = signal<Modulo | undefined>(undefined);
  protected readonly editNombre = signal('');
  protected readonly editDescripcion = signal('');
  protected readonly editCategoria = signal('');
  protected readonly editIcono = signal('');
  protected readonly editPrecio = signal<number | null>(null);
  protected readonly editAddon = signal(false);
  protected readonly editOrden = signal(0);
  protected readonly editSaving = signal(false);
  protected readonly editError = signal<string | null>(null);

  abrirEdicion(modulo: Modulo): void {
    this.cerrarDependencias();
    this.cerrarGiros();
    this.editingModulo.set(modulo);
    this.editNombre.set(modulo.nombre);
    this.editDescripcion.set(modulo.descripcion ?? '');
    this.editCategoria.set(modulo.categoria ?? '');
    this.editIcono.set(modulo.icono ?? '');
    this.editPrecio.set(modulo.precioMensualBase);
    this.editAddon.set(modulo.esAddon ?? false);
    this.editOrden.set(modulo.orden ?? 0);
    this.editError.set(null);
  }

  cerrarEdicion(): void {
    this.editingModulo.set(undefined);
    this.editError.set(null);
  }

  @HostListener('document:keydown.escape')
  protected cerrarModalConEscape(): void {
    if (this.editingModulo() && !this.editSaving()) this.cerrarEdicion();
  }

  guardarAdmin(): void {
    const m = this.editingModulo();
    if (!m) return;

    const req: ModuloAdminRequest = {
      nombre: this.editNombre().trim() || undefined,
      descripcion: this.editDescripcion().trim() || undefined,
      categoria: this.editCategoria() || undefined,
      icono: this.editIcono().trim() || undefined,
      precioMensualBase: this.editPrecio(),
      esAddon: this.editAddon(),
      orden: this.editOrden(),
    };

    this.editSaving.set(true);
    this.editError.set(null);
    this.catalogService.actualizarModuloAdmin(m.slug, req).subscribe({
      next: () => {
        this.editSaving.set(false);
        this.cerrarEdicion();
        this.modulosResource.reload();
      },
      error: (err) => {
        this.editSaving.set(false);
        this.editError.set(extractErrorMessage(err, 'No se pudo actualizar el módulo.'));
      },
    });
  }

  // --- Giros del módulo -------------------------------------------------------

  protected readonly managingGirosModuloId = signal<number | undefined>(undefined);
  protected readonly giroEdits = signal<Set<number>>(new Set());
  protected readonly giroSaving = signal(false);
  protected readonly giroError = signal<string | null>(null);

  protected readonly allGirosResource = this.catalogService.giros();
  protected readonly girosDeModuloResource = this.catalogService.girosDeModulo(this.managingGirosModuloId);

  constructor() {
    effect(() => {
      const idModulo = this.managingGirosModuloId();
      const giros = this.girosDeModuloResource.value();
      if (idModulo !== undefined) {
        this.giroEdits.set(new Set(giros.map((g) => g.idGiro)));
      }
    });
  }

  protected nombreModuloGiro(id: number): string {
    return this.modulosResource.value().find((m) => m.idModulo === id)?.nombre ?? `#${id}`;
  }

  gestionarGiros(idModulo: number): void {
    this.cerrarEdicion();
    this.cerrarDependencias();
    this.managingGirosModuloId.set(idModulo);
  }

  cerrarGiros(): void {
    this.managingGirosModuloId.set(undefined);
    this.giroEdits.set(new Set());
    this.giroError.set(null);
  }

  toggleGiro(idGiro: number, checked: boolean): void {
    const next = new Set(this.giroEdits());
    if (checked) next.add(idGiro);
    else next.delete(idGiro);
    this.giroEdits.set(next);
  }

  guardarGiros(): void {
    const idModulo = this.managingGirosModuloId();
    if (!idModulo) return;

    this.giroSaving.set(true);
    this.giroError.set(null);
    this.catalogService.asignarGirosAModulo(idModulo, [...this.giroEdits()]).subscribe({
      next: () => {
        this.giroSaving.set(false);
        this.girosDeModuloResource.reload();
      },
      error: (err) => {
        this.giroSaving.set(false);
        this.giroError.set(extractErrorMessage(err, 'No se pudieron guardar los giros.'));
      },
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
    this.modulosResource.value().filter((m) => m.idModulo !== this.managingModuloId()),
  );

  gestionarDependencias(idModulo: number): void {
    this.cerrarEdicion();
    this.cerrarGiros();
    this.managingModuloId.set(idModulo);
  }

  cerrarDependencias(): void {
    this.managingModuloId.set(undefined);
    this.nuevaDependenciaId.set(undefined);
  }

  nombreModulo(id: number): string {
    return this.modulosResource.value().find((m) => m.idModulo === id)?.nombre ?? `#${id}`;
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
