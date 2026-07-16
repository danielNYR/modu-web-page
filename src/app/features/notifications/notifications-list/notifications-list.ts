import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { TIPOS_EVENTO_NOTIFICACION, type TipoEventoNotificacion } from '@app/core/models/enums';
import { extractErrorMessage } from '@app/core/http/error-message';
import { NotificationsService } from '@app/features/notifications/data/notifications.service';
import type { BuscarNotificacionesParams, NotificacionEstatus } from '@app/features/notifications/models/notification.model';

const ESTATUS_VARIANT: Record<NotificacionEstatus, 'default' | 'destructive' | 'outline'> = {
  ENVIADO: 'default',
  FALLIDO: 'destructive',
  OMITIDO_SIN_DESTINATARIO: 'outline',
};

@Component({
  selector: 'moldhea-notifications-list',
  imports: [
    FormsModule,
    PageHeader,
    Pagination,
    NgIcon,
    HlmButtonImports,
    HlmInput,
    HlmLabel,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    HlmBadge,
  ],
  providers: [provideIcons({ lucideSend })],
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css',
})
export class NotificationsList {
  private readonly notificationsService = inject(NotificationsService);

  protected readonly tiposEvento = TIPOS_EVENTO_NOTIFICACION;

  protected readonly idLicencia = signal<number | undefined>(undefined);
  protected readonly tipoEvento = signal<TipoEventoNotificacion | undefined>(undefined);
  protected readonly page = signal(0);

  private readonly params = computed<BuscarNotificacionesParams>(() => ({
    idLicencia: this.idLicencia(),
    tipoEvento: this.tipoEvento(),
    page: this.page(),
    size: 20,
  }));

  protected readonly logResource = this.notificationsService.log(this.params);
  protected readonly estatusVariant = ESTATUS_VARIANT;

  onIdLicenciaChange(value: string): void {
    this.idLicencia.set(value ? Number(value) : undefined);
    this.page.set(0);
  }

  onTipoEventoChange(value: TipoEventoNotificacion | ''): void {
    this.tipoEvento.set(value || undefined);
    this.page.set(0);
  }

  // --- Envío de prueba -------------------------------------------------------

  protected readonly showTest = signal(false);
  protected readonly testDestinatario = signal('');
  protected readonly testTipoEvento = signal<TipoEventoNotificacion>('LICENCIA_GENERADA');
  protected readonly testSending = signal(false);
  protected readonly testResult = signal<string | null>(null);
  protected readonly testError = signal<string | null>(null);

  enviarPrueba(): void {
    if (!this.testDestinatario().trim()) return;

    this.testSending.set(true);
    this.testResult.set(null);
    this.testError.set(null);
    this.notificationsService
      .enviarPrueba({ destinatario: this.testDestinatario().trim(), tipoEvento: this.testTipoEvento() })
      .subscribe({
        next: (res) => {
          this.testSending.set(false);
          this.testResult.set(`Correo de prueba: ${res.status}`);
        },
        error: (err) => {
          this.testSending.set(false);
          this.testError.set(extractErrorMessage(err, 'No se pudo enviar el correo de prueba.'));
        },
      });
  }
}
