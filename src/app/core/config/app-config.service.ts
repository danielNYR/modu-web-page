import { Injectable } from '@angular/core';

export interface AppConfig {
  apiBaseUrl: string;
  internalApiKey: string;
}

/**
 * Config cargada en runtime desde /app-config.json (fuera del bundle) para no hornear la
 * X-Internal-Api-Key en el JS servido al navegador. Ver public/app-config.example.json.
 *
 * Esto es una solución interina: lo correcto a mediano plazo es que esta key nunca llegue
 * al navegador y viva en un backend/proxy propio que la inyecte (ver instrucciones_frontend.md §9).
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private loaded: AppConfig | null = null;

  get config(): AppConfig {
    if (!this.loaded) {
      throw new Error(
        'AppConfigService no se ha inicializado. ¿Falta esperar a APP_INITIALIZER?',
      );
    }
    return this.loaded;
  }

  async load(): Promise<void> {
    const res = await fetch('/app-config.json');
    if (!res.ok) {
      throw new Error(
        'No se pudo cargar /app-config.json. Copia public/app-config.example.json a public/app-config.json y complétalo con la API key de modhub.',
      );
    }
    this.loaded = (await res.json()) as AppConfig;
  }
}
