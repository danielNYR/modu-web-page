import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideCopy } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { ESTATUS_SUSCRIPCION_VARIANT } from '@app/core/models/badge-variants';
import { extractErrorMessage } from '@app/core/http/error-message';
import { LicensesService } from '@app/features/licenses/data/licenses.service';

@Component({
  selector: 'moldhea-license-detail',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmBadge,
    HlmButtonImports,
    HlmCardImports,
    HlmInput,
    HlmLabel,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
  ],
  providers: [provideIcons({ lucideArrowLeft, lucideCopy })],
  templateUrl: './license-detail.html',
  styleUrl: './license-detail.css',
})
export class LicenseDetail {
  private readonly licensesService = inject(LicensesService);

  readonly idLicencia = input<string>();

  private readonly idLicenciaNum = computed(() => {
    const raw = this.idLicencia();
    return raw ? Number(raw) : undefined;
  });

  protected readonly licenseResource = this.licensesService.detalle(this.idLicenciaNum);
  protected readonly estatusVariant = ESTATUS_SUSCRIPCION_VARIANT;

  protected readonly showRevoke = signal(false);
  protected readonly showExtend = signal(false);
  protected readonly razon = signal('');
  protected readonly nuevaFechaFin = signal('');
  protected readonly actionPending = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly claveOfflineNueva = signal<string | null>(null);

  revocar(): void {
    const id = this.idLicenciaNum();
    if (id === undefined) return;

    this.actionPending.set(true);
    this.actionError.set(null);
    this.licensesService.revocar(id, { razon: this.razon() || undefined }).subscribe({
      next: () => {
        this.actionPending.set(false);
        this.showRevoke.set(false);
        this.razon.set('');
        this.licenseResource.reload();
      },
      error: (err) => {
        this.actionPending.set(false);
        this.actionError.set(extractErrorMessage(err, 'No se pudo revocar la licencia.'));
      },
    });
  }

  extender(): void {
    const id = this.idLicenciaNum();
    if (id === undefined || !this.nuevaFechaFin()) return;

    this.actionPending.set(true);
    this.actionError.set(null);
    this.licensesService.extender(id, { nuevaFechaFin: this.nuevaFechaFin() }).subscribe({
      next: (licencia) => {
        this.actionPending.set(false);
        this.showExtend.set(false);
        this.nuevaFechaFin.set('');
        if (licencia.claveOffline) {
          this.claveOfflineNueva.set(licencia.claveOffline);
        }
        this.licenseResource.reload();
      },
      error: (err) => {
        this.actionPending.set(false);
        this.actionError.set(extractErrorMessage(err, 'No se pudo extender la licencia.'));
      },
    });
  }
}
