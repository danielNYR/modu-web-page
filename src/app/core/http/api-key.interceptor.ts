import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { AppConfigService } from '@app/core/config/app-config.service';

/**
 * Antepone la baseUrl del backend modhub y agrega el header X-Internal-Api-Key a toda
 * request cuyo path relativo empiece con /api (ver instrucciones_frontend.md §1.1).
 */
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api')) {
    return next(req);
  }

  const { apiBaseUrl, internalApiKey } = inject(AppConfigService).config;

  return next(
    req.clone({
      url: `${apiBaseUrl}${req.url}`,
      setHeaders: { 'X-Internal-Api-Key': internalApiKey },
    }),
  );
};
