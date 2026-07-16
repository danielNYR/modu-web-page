import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    title: 'Iniciar sesión · Moldhea Accounts',
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Dashboard · Moldhea Accounts',
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./features/tenants/tenants-list/tenants-list').then((m) => m.TenantsList),
        title: 'Tenants · Moldhea Accounts',
      },
      {
        path: 'tenants/:idTenant',
        loadComponent: () =>
          import('./features/tenants/tenant-detail/tenant-detail').then((m) => m.TenantDetail),
        title: 'Detalle de tenant · Moldhea Accounts',
      },
      {
        path: 'licencias',
        loadComponent: () =>
          import('./features/licenses/licenses-list/licenses-list').then((m) => m.LicensesList),
        title: 'Licencias · Moldhea Accounts',
      },
      {
        path: 'licencias/nueva',
        loadComponent: () =>
          import('./features/licenses/license-generate/license-generate').then(
            (m) => m.LicenseGenerate,
          ),
        title: 'Generar licencia · Moldhea Accounts',
      },
      {
        path: 'licencias/:idLicencia',
        loadComponent: () =>
          import('./features/licenses/license-detail/license-detail').then((m) => m.LicenseDetail),
        title: 'Detalle de licencia · Moldhea Accounts',
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./features/catalog/catalog/catalog').then((m) => m.Catalog),
        title: 'Catálogo · Moldhea Accounts',
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./features/notifications/notifications-list/notifications-list').then(
            (m) => m.NotificationsList,
          ),
        title: 'Notificaciones · Moldhea Accounts',
      },
      {
        path: 'auditoria',
        loadComponent: () =>
          import('./features/audit/audit-list/audit-list').then((m) => m.AuditList),
        title: 'Auditoría · Moldhea Accounts',
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
