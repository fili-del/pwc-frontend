import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Assicurati che questo puntamento sia corretto
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // ⬅️ Importa i providers

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Router principale

    // ⬇️ Abilita il client HTTP e abilita la ricerca degli Interceptor dal DI
    provideHttpClient(
      withInterceptorsFromDi()
    )

    // Nota: L'Interceptor HTTP_INTERCEPTORS viene fornito tramite app.module.ts
    // Se il tuo progetto fosse completamente Standalone, lo registreresti qui.

  ]
};
