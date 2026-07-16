# Moldhea Accounts Frontend

Sistema interno de Moldhea para el control de tenants, licencias y catálogo de productos/planes/módulos, integrado contra el backend `modhub`. Ver `/Users/danielnava/Documents/Moldhea/Backend/modhub/instrucciones_frontend.md` para el contrato de la API.

## Stack

- **Angular 22** (standalone, zoneless, signals, `httpResource`) + **Angular CLI**
- **Tailwind CSS v4**
- **Spartan/ui** (`@spartan-ng/brain` + `helm`) — componentes accesibles estilo shadcn para Angular
- **pnpm** como gestor de paquetes

## Configuración del backend (requerido antes de correr la app)

`modhub` exige el header `X-Internal-Api-Key` en cada request. Esa key **no vive en el bundle**: se carga en runtime desde `public/app-config.json` (gitignored).

```bash
cp public/app-config.example.json public/app-config.json
# edita apiBaseUrl e internalApiKey con los valores reales de modhub
```

Si `app-config.json` no existe o el backend no responde, la app carga igual (es una SPA), pero cada pantalla que consume datos mostrará su estado de error.

> Nota de seguridad (ver instrucciones_frontend.md §9): esto es una solución interina para desarrollo. Para producción, la API key no debería llegar al navegador — lo correcto es un backend/proxy propio que la inyecte del lado servidor.

## Arquitectura

```
src/app/
├── core/
│   ├── config/             # AppConfigService (carga app-config.json antes del bootstrap)
│   ├── http/                # interceptor de API key + parseo de errores del backend
│   ├── models/               # Page<T>, enums del dominio, mapeo estatus→badge
│   └── nav/                  # definición del menú lateral
├── layout/shell/             # shell del dashboard: sidebar + topbar + router-outlet
├── shared/components/        # page-header, stat-card, pagination
└── features/
    ├── auth/login/           # login (solo visual, sin auth real todavía)
    ├── dashboard/             # métricas reales (/api/admin/metrics)
    ├── tenants/               # /api/admin/tenants (solo lectura) — listado + detalle
    ├── licenses/              # /api/licencias — listado, detalle, generar/renovar, revocar, extender
    ├── catalog/               # /api/admin/catalogo — productos, planes (+módulos), módulos (+dependencias)
    ├── notifications/         # /api/admin/notificaciones — log + envío de prueba
    └── audit/                 # /api/admin/auditoria — log con filtros excluyentes

libs/ui/                       # componentes de Spartan/ui (button, card, table, input, badge, tabs, etc.)
```

Cada feature sigue el patrón `features/<nombre>/{models,data,<páginas>}` con rutas `loadComponent` en `app.routes.ts`. Los servicios de datos (`*.service.ts`) usan `httpResource` para GET reactivos (listas/detalle, con `.isLoading()`/`.error()`/`.reload()` gratis) y `HttpClient` directo para mutaciones (POST/PUT/PATCH/DELETE).

## Marca

Los colores primarios (`moldhea-400` a `moldhea-700` en Tailwind, ver `src/styles.css`) están tomados de la identidad de Moldhea:

| Tono | Uso | Hex |
| --- | --- | --- |
| Celeste | superior izquierdo | `#1DA3EC` |
| Azul medio | superior derecho | `#0086F0` |
| Azul brillante | inferior izquierdo | `#0078D4` |
| Azul oscuro | inferior derecho | `#005DB3` |

## Desarrollo

```bash
pnpm install
cp public/app-config.example.json public/app-config.json   # completar con la key real
pnpm start        # ng serve, http://localhost:4200
pnpm run build    # build de producción
```

## Estado actual / pendiente de validar

- Login visual (sin autenticación real todavía — la API key de modhub es de servicio, no de usuario final).
- Todas las pantallas quedaron cableadas contra los endpoints reales de `instrucciones_frontend.md`, pero **no se han probado contra un backend corriendo** — falta esa validación conjunta.
- `TenantListItemResponse` / `TenantDetailResponse` / `UsuarioResumenResponse` no tienen shape exacto documentado; los campos en `features/tenants/models/tenant.model.ts` son el mejor esfuerzo a partir del dominio descrito y deben verificarse contra payloads reales.
- La validación client-side de dependencias "hard" al asignar módulos a un plan no está implementada (el backend la re-valida en `PUT /planes/{id}/modulos`); por ahora solo se muestra el error 400 que regrese.
- No hay pantalla dedicada para `/api/admin/metrics/revenue` ni `/api/admin/metrics/churn` — el dashboard solo usa `/metrics/dashboard` y `/metrics/licencias/proximas-a-vencer`.
