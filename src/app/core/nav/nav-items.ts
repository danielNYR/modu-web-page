export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'lucideLayoutDashboard', route: '/dashboard' },
  { label: 'Tenants', icon: 'lucideUsers', route: '/tenants' },
  { label: 'Cuentas', icon: 'lucideUserCheck', route: '/cuentas' },
  { label: 'Licencias', icon: 'lucideKeyRound', route: '/licencias' },
  { label: 'Catálogo', icon: 'lucideBoxes', route: '/catalogo' },
  { label: 'Notificaciones', icon: 'lucideBell', route: '/notificaciones' },
  { label: 'Auditoría', icon: 'lucideScrollText', route: '/auditoria' },
];
