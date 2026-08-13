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
import type { PaqueteRequest } from '@app/features/catalog/models/paquete.model';

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
  ],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './packages-panel.html',
  styleUrl: './packages-panel.css',
})
export class PackagesPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly filterProducto = signal<number | undefined>(undefined);
  protected readonly productosResource = this.catalogService.productos();
  protected readonly paquetesResource = this.catalogService.paquetes(this.filterProducto);

  // --- Crear paquete ---

  protected readonly showForm = signal(false);
  protected readonly formProducto = signal<number | undefined>(undefined);
  protected readonly slug = signal('');
  protected readonly nombre = signal('');
  protected readonly descripcion = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  crear(): void {
    if (!this.formProducto() || !this.slug().trim() || !this.nombre().trim()) return;

    const req: PaqueteRequest = {
      idProducto: this.formProducto()!,
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
