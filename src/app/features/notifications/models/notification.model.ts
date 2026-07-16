import type { TipoEventoNotificacion } from '@app/core/models/enums';

export type NotificacionEstatus = 'ENVIADO' | 'FALLIDO' | 'OMITIDO_SIN_DESTINATARIO';

export interface NotificacionLog {
  id: number;
  idLicencia: number;
  tipoEvento: TipoEventoNotificacion;
  fechaObjetivo: string;
  canal: string;
  destinatario: string | null;
  estatus: NotificacionEstatus;
  enviadoAt: string | null;
}

export interface BuscarNotificacionesParams {
  idLicencia?: number;
  tipoEvento?: TipoEventoNotificacion;
  page?: number;
  size?: number;
  sort?: string;
}

export interface NotificacionTestRequest {
  destinatario: string;
  tipoEvento: TipoEventoNotificacion;
}
