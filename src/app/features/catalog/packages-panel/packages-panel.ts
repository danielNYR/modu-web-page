import { Component, HostListener, computed, inject, signal } from '@angular/core';
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
import type { PaqueteRequest } from '@app/features/catalog/models/paquete.model';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
  selector: 'moldhea-packages-panel',
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
    Pagination,
  ],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './packages-panel.html',
  styleUrl: './packages-panel.css',
})
export class PackagesPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly filterProducto = signal<number | undefined>(undefined);
  protected readonly productosResource = this.catalogService.productos();
  protected readonly girosResource = this.catalogService.giros();
  protected readonly paquetesResource = this.catalogService.paquetes(this.filterProducto);
  protected readonly page = signal(0);
  protected readonly pageSize = 10;
  protected readonly totalElements = computed(() => this.paquetesResource.value().length);
  protected readonly totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize));
  protected readonly paginatedPaquetes = computed(() => {
    const start = this.page() * this.pageSize;
    return this.paquetesResource.value().slice(start, start + this.pageSize);
  });

  protected giroNombres(idGiros: number[] | undefined): string {
    if (!idGiros || !idGiros.length) return '—';
    return idGiros
      .map((idGiro) => this.girosResource.value().find((g) => g.idGiro === idGiro)?.nombreGiro ?? `#${idGiro}`)
      .join(', ');
  }

  // --- Crear paquete ---

  protected readonly showForm = signal(false);
  protected readonly formProducto = signal<number | undefined>(undefined);
  protected readonly formGiros = signal<Set<number>>(new Set());
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly descripcion = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected cambiarProducto(idProducto: number | undefined): void {
    this.filterProducto.set(idProducto);
    this.page.set(0);
  }

  protected abrirFormulario(): void {
    this.error.set(null);
    this.formProducto.set(this.filterProducto());
    this.showForm.set(true);
  }

  protected cerrarFormulario(): void {
    if (this.saving()) return;
    this.showForm.set(false);
    this.formGiros.set(new Set());
    this.slug.set('');
    this.nombre.set('');
    this.descripcion.set('');
  }

  protected cambiarPagina(page: number): void {
    this.page.set(Math.max(0, Math.min(page, Math.max(this.totalPages() - 1, 0))));
  }

  @HostListener('document:keydown.escape')
  protected cerrarConEscape(): void {
    if (this.showForm()) this.cerrarFormulario();
  }

  protected toggleFormGiro(idGiro: number): void {
    const next = new Set(this.formGiros());
    next.has(idGiro) ? next.delete(idGiro) : next.add(idGiro);
    this.formGiros.set(next);
  }

  crear(): void {
    if (!this.formProducto() || !this.slug().trim() || !this.nombre().trim()) return;

    const req: PaqueteRequest = {
      idProducto: this.formProducto()!,
      idGiros: [...this.formGiros()],
      slug: this.slug().trim(),
      nombre: this.nombre().trim(),
      descripcion: this.descripcion().trim() || undefined,
    };

    this.saving.set(true);
    this.error.set(null);
    this.catalogService.crearPaquete(req).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.formGiros.set(new Set());
        this.slug.set('');
        this.nombre.set('');
        this.descripcion.set('');
        this.paquetesResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo crear el paquete.'));
      },
    });
  }

  cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoPaquete(id, isActive).subscribe({
      next: () => this.paquetesResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }
}
