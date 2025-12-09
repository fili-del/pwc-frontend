import { HttpInterceptorFn, HttpContext, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const publicUrls = ['/login', '/register', '/auth/login'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  console.log('═══════════════════════════════════');
  console.log('🌐 URL richiesta:', req.url);
  console.log('🔓 È pubblico?:', isPublicUrl);

  if (!isPublicUrl) {
    const token = localStorage.getItem('token');
    console.log('🔑 Token presente?:', token ? 'SÌ' : 'NO');
    
    if (token) {
      console.log('🔑 Token (primi 20 caratteri):', token.substring(0, 20) + '...');
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Header Authorization aggiunto');
    } else {
      console.warn('⚠️ NESSUN TOKEN TROVATO! Redirect al login');
      router.navigate(['/login']);
    }
  }
  console.log('═══════════════════════════════════');

  return next(req).pipe(
    tap({
      error: (err) => {
        console.error('❌ Errore nella richiesta:', err.status, err.message);
        if (err.status === 401 && !isPublicUrl) {
          console.warn('🚫 401 Unauthorized - Token non valido o scaduto');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};