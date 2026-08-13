export type EstatusUsuario = 'ACTIVO' | 'SUSPENDIDO' | 'ELIMINADO';

export type RegistryPhase =
  | 'CREATED'
  | 'VERIFIED'
  | 'GOOGLE_CREATED'
  | 'PERSONAL_REGISTERED'
  | 'INSTITUTION_CREATED'
  | 'ADDRESS_ADDED'
  | 'MODULO_SELECCIONADOS'
  | 'PAGADO';

export interface CuentaListItem {
  idUsuario: number;
  ulid: string;
  email: string;
  nombre: string | null;
  apellido: string | null;
  estatus: EstatusUsuario;
  emailConfirmado: boolean;
  phoneConfirmado: boolean;
  registryPhase: RegistryPhase | null;
  verifiedMethod: string | null;
  idTenant: number | null;
  ultimoAcceso: string | null;
  createdAt: string;
}

export interface SesionResumen {
  idSesion: number;
  ipOrigen: string | null;
  userAgent: string | null;
  deviceNombre: string | null;
  isActive: boolean;
  rememberMe: boolean;
  fechaCreacion: string;
  fechaExpiracion: string;
  revokedAt: string | null;
  revokeRazon: string | null;
}

export interface CuentaDetalle {
  idUsuario: number;
  ulid: string;
  email: string;
  phone: string | null;
  nombre: string | null;
  apellido: string | null;
  avatarUrl: string | null;
  estatus: EstatusUsuario;
  suspensionRazon: string | null;

  emailConfirmado: boolean;
  emailConfirmadoAt: string | null;
  phoneConfirmado: boolean;

  hasPassword: boolean;
  passwordSetAt: string | null;
  mfaEnabled: boolean;
  verifiedMethod: string | null;

  registryPhase: RegistryPhase | null;
  wizardStep: number;
  wizardDescripcion: string;

  idTenant: number | null;
  idInstitucionApp: number | null;
  idPlanSeleccionado: number | null;

  primerAcceso: string | null;
  ultimoAcceso: string | null;
  createdAt: string;
  updatedAt: string | null;

  sesionesRecientes: SesionResumen[];
}

export interface BuscarCuentasParams {
  q?: string;
  estatus?: EstatusUsuario;
  fase?: RegistryPhase;
  page?: number;
  size?: number;
}

export const WIZARD_PHASES: Array<{ phase: RegistryPhase; label: string; step: number }> = [
  { phase: 'CREATED', label: 'Email pendiente', step: 1 },
  { phase: 'VERIFIED', label: 'Email verificado', step: 2 },
  { phase: 'GOOGLE_CREATED', label: 'Google', step: 2 },
  { phase: 'PERSONAL_REGISTERED', label: 'Datos personales', step: 3 },
  { phase: 'INSTITUTION_CREATED', label: 'Institución', step: 4 },
  { phase: 'ADDRESS_ADDED', label: 'Dirección', step: 5 },
  { phase: 'MODULO_SELECCIONADOS', label: 'Plan elegido', step: 6 },
  { phase: 'PAGADO', label: 'Completo', step: 7 },
];
