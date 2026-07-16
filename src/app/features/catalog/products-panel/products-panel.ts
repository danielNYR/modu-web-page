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

@Component({
  selector: 'moldhea-products-panel',
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
  templateUrl: './products-panel.html',
  styleUrl: './products-panel.css',
})
export class ProductsPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly productosResource = this.catalogService.productos();

  protected readonly showForm = signal(false);
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  crear(): void {
    if (!this.slug().trim() || !this.nombre().trim()) return;

    this.saving.set(true);
    this.error.set(null);
    this.catalogService.crearProducto({ slug: this.slug().trim(), nombre: this.nombre().trim() }).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.slug.set('');
        this.nombre.set('');
        this.productosResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo crear el producto.'));
      },
    });
  }

  cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoProducto(id, isActive).subscribe({
      next: () => this.productosResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }
}
