import type { HttpErrorResponse } from '@angular/common/http';

/**
 * Normaliza los cuerpos de error de GlobalExceptionHandler:
 * - 404/400: { "error": "<mensaje>" }
 * - 401:      { "status": "UNAUTHORIZED", "error": "INVALID_API_KEY", "timestamp": "..." }
 */
export function extractErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (err && typeof err === 'object' && 'error' in (err as HttpErrorResponse)) {
    const body = (err as HttpErrorResponse).error;
    if (body && typeof body === 'object' && 'error' in body) {
      const message = (body as { error: string }).error;
      if (typeof message === 'string' && message.length > 0) {
        return message === 'INVALID_API_KEY'
          ? 'API key inválida o ausente. Revisa la configuración en app-config.json.'
          : message;
      }
    }
  }
  return fallback;
}
