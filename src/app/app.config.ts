import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. Aggiungi HTTP_INTERCEPTORS agli import
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor'; 
import { AuthInterceptor } from './service/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi() // Dice ad Angular di cercare gli interceptor registrati sotto
    ),

    // 3. REGISTRA L'INTERCEPTOR QUI (Non in app.module.ts)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // <--- Metti qui il nome della tua classe
      multi: true
    }

  ]
};  