import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const publicUrls = ['/auth/login', '/register']; // URL DA IGNORARE

  // Controlla se l'URL della richiesta corrisponde a un URL pubblico
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  return next(req).pipe(
    tap({
      error: (err) => {
        // Se non è un URL pubblico e l'errore è 401, reindirizza
        if (err.status === 401 && !isPublicUrl) {
          console.warn('Non autorizzato! Reindirizzamento al login...');
          router.navigate(['/login']);
        }
      }
    })
  );
};