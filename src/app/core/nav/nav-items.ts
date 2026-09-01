export interface NavItem {
  label: string;
  icon: string;
  route: string;
  queryParams?: Record<string, string>;
  children?: Array<{ label: string; route: string; queryParams: Record<string, string> }>;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'lucideLayoutDashboard', route: '/dashboard' },
  {
    label: 'Catálogo',
    icon: 'lucideBoxes',
    route: '/catalogo',
    children: [
      { label: 'Productos', route: '/catalogo', queryParams: { tab: 'productos' } },
      { label: 'Planes', route: '/catalogo', queryParams: { tab: 'planes' } },
      { label: 'Módulos', route: '/catalogo', queryParams: { tab: 'modulos' } },
      { label: 'Paquetes', route: '/catalogo', queryParams: { tab: 'paquetes' } },
      { label: 'Descuentos', route: '/catalogo', queryParams: { tab: 'descuentos' } },
      { label: 'Periodos', route: '/catalogo', queryParams: { tab: 'periodos-licencia' } },
    ],
  },
  { label: 'Tenants', icon: 'lucideUsers', route: '/tenants' },
  { label: 'Cuentas', icon: 'lucideUserCheck', route: '/cuentas' },
  { label: 'Licencias', icon: 'lucideKeyRound', route: '/licencias' },
  { label: 'Notificaciones', icon: 'lucideBell', route: '/notificaciones' },
  { label: 'Auditoría', icon: 'lucideScrollText', route: '/auditoria' },
];
