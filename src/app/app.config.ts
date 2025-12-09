import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ⬅️ CAMBIATO

import { authInterceptor } from './auth.interceptor'; // ⬅️ Functional interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // ⬅️ USA withInterceptors invece di withInterceptorsFromDi
    provideHttpClient(
      withInterceptors([authInterceptor]) // Passa direttamente il functional interceptor
    )
  ]
};