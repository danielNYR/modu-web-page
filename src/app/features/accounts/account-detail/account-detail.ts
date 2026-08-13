import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideCheck,
  lucideX,
  lucideShieldCheck,
  lucideShieldOff,
  lucideSmartphone,
  lucideMonitor,
  lucideAlertTriangle,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTable, HlmTr } from '@spartan-ng/helm/table';
import { AccountsService } from '../data/accounts.service';
import { WIZARD_PHASES } from '../models/account.model';

const ESTATUS_VARIANT: Record<string, string> = {
  ACTIVO: 'default',
  SUSPENDIDO: 'destructive',
  ELIMINADO: 'outline',
};

@Component({
  selector: 'moldhea-account-detail',
  imports: [
    DatePipe,
    RouterLink,
    NgIcon,
    HlmBadge,
    HlmCardImports,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
  ],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideCheck,
      lucideX,
      lucideShieldCheck,
      lucideShieldOff,
      lucideSmartphone,
      lucideMonitor,
      lucideAlertTriangle,
    }),
  ],
  templateUrl: './account-detail.html',
})
export class AccountDetail {
  private readonly accountsService = inject(AccountsService);

  readonly idUsuario = input<string>();

  private readonly idNum = computed(() => {
    const raw = this.idUsuario();
    return raw ? Number(raw) : undefined;
  });

  protected readonly cuentaResource = this.accountsService.detail(this.idNum);
  protected readonly wizardPhases = WIZARD_PHASES;
  protected readonly estatusVariant = ESTATUS_VARIANT;

  protected readonly actionPending = signal(false);
  protected readonly actionMsg = signal<string | null>(null);

  protected suspender(): void {
    const id = this.idNum();
    if (!id) return;
    const razon = prompt('Motivo de la suspensión (requerido):');
    if (!razon?.trim()) return;
    this.runAction(this.accountsService.suspender(id, razon.trim()), 'Cuenta suspendida.');
  }

  protected reactivar(): void {
    const id = this.idNum();
    if (!id || !confirm('¿Reactivar esta cuenta?')) return;
    this.runAction(this.accountsService.reactivar(id), 'Cuenta reactivada.');
  }

  protected verificarEmail(): void {
    const id = this.idNum();
    if (!id || !confirm('¿Marcar email como verificado sin enviar correo?')) return;
    this.runAction(this.accountsService.verificarEmail(id), 'Email marcado como verificado.');
  }

  protected revocarSesiones(): void {
    const id = this.idNum();
    if (!id || !confirm('¿Revocar TODAS las sesiones activas? El usuario deberá volver a iniciar sesión.')) return;
    this.runAction(this.accountsService.revocarSesiones(id), 'Sesiones revocadas.');
  }

  private runAction(obs: ReturnType<typeof this.accountsService.reactivar>, msg: string): void {
    this.actionPending.set(true);
    this.actionMsg.set(null);
    obs.subscribe({
      next: () => {
        this.actionMsg.set(msg);
        this.actionPending.set(false);
        this.cuentaResource.reload();
      },
      error: () => {
        this.actionMsg.set('Error al ejecutar la acción. Verifica la conexión con el backend.');
        this.actionPending.set(false);
      },
    });
  }

  protected isMobile(userAgent: string | null): boolean {
    if (!userAgent) return false;
    return /mobile|android|iphone|ipad/i.test(userAgent);
  }
}
