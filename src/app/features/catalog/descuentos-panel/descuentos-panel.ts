import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
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
import type { DescuentoRequest, TipoValorDescuento } from '@app/features/catalog/models/descuento.model';

@Component({
  selector: 'moldhea-descuentos-panel',
  imports: [
    FormsModule,
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
  templateUrl: './descuentos-panel.html',
  styleUrl: './descuentos-panel.css',
})
export class DescuentosPanel {
  private readonly catalogService = inject(CatalogService);

  protected readonly descuentosResource = this.catalogService.descuentos();
  protected readonly productosResource = this.catalogService.productos();
  protected readonly girosResource = this.catalogService.giros();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | undefined>(undefined);

  protected readonly nombre = signal('');
  protected readonly tipoValor = signal<TipoValorDescuento>('PORCENTAJE');
  protected readonly valor = signal<number | undefined>(undefined);
  protected readonly idProducto = signal<number | undefined>(undefined);
  protected readonly idGiro = signal<number | undefined>(undefined);
  protected readonly soloPrimeraCompra = signal(false);
  protected readonly minModulos = signal<number | undefined>(undefined);
  protected readonly fechaInicio = signal('');
  protected readonly fechaFin = signal('');

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected giroNombre(idGiro: number | null): string {
    if (!idGiro) return 'Cualquier giro';
    return this.girosResource.value().find((g) => g.idGiro === idGiro)?.nombreGiro ?? `#${idGiro}`;
  }

  protected productoNombre(idProducto: number | null): string {
    if (!idProducto) return 'Cualquier producto';
    return this.productosResource.value().find((p) => p.idProducto === idProducto)?.nombre ?? `#${idProducto}`;
  }

  protected nuevoDescuento(): void {
    this.editingId.set(undefined);
    this.resetForm();
    this.showForm.set(true);
  }

  protected editarDescuento(id: number): void {
    const d = this.descuentosResource.value().find((x) => x.idDescuento === id);
    if (!d) return;
    this.editingId.set(id);
    this.nombre.set(d.nombre);
    this.tipoValor.set(d.tipoValor);
    this.valor.set(d.valor);
    this.idProducto.set(d.idProducto ?? undefined);
    this.idGiro.set(d.idGiro ?? undefined);
    this.soloPrimeraCompra.set(d.soloPrimeraCompra);
    this.minModulos.set(d.minModulos ?? undefined);
    this.fechaInicio.set(d.fechaInicio ? d.fechaInicio.slice(0, 16) : '');
    this.fechaFin.set(d.fechaFin ? d.fechaFin.slice(0, 16) : '');
    this.error.set(null);
    this.showForm.set(true);
  }

  private resetForm(): void {
    this.nombre.set('');
    this.tipoValor.set('PORCENTAJE');
    this.valor.set(undefined);
    this.idProducto.set(undefined);
    this.idGiro.set(undefined);
    this.soloPrimeraCompra.set(false);
    this.minModulos.set(undefined);
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.error.set(null);
  }

  protected cancelarForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  protected guardar(): void {
    if (!this.nombre().trim() || this.valor() == null) return;

    const req: DescuentoRequest = {
      nombre: this.nombre().trim(),
      tipoValor: this.tipoValor(),
      valor: this.valor()!,
      idProducto: this.idProducto() ?? null,
      idGiro: this.idGiro() ?? null,
      soloPrimeraCompra: this.soloPrimeraCompra(),
      minModulos: this.minModulos() ?? null,
      // LocalDateTime en el backend espera segundos — datetime-local no los trae.
      fechaInicio: this.fechaInicio() ? `${this.fechaInicio()}:00` : null,
      fechaFin: this.fechaFin() ? `${this.fechaFin()}:00` : null,
    };

    this.saving.set(true);
    this.error.set(null);
    const id = this.editingId();
    const request$ = id ? this.catalogService.actualizarDescuento(id, req) : this.catalogService.crearDescuento(req);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.resetForm();
        this.descuentosResource.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo guardar el descuento.'));
      },
    });
  }

  protected cambiarEstado(id: number, isActive: boolean): void {
    this.catalogService.cambiarEstadoDescuento(id, isActive).subscribe({
      next: () => this.descuentosResource.reload(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo cambiar el estado.')),
    });
  }
}
