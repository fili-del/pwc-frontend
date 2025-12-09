import { HttpInterceptorFn, HttpContext, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // ⬅️ Se ha il flag BYPASS_AUTH, ignora tutto
  if (req.context.get(BYPASS_AUTH)) {
    console.log('🟢 Bypass auth per:', req.url);
    return next(req);
  }

const publicUrls = ['/login', '/register', '/auth/login'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  console.log('🔍 URL:', req.url, '| Public:', isPublicUrl);

  // Aggiungi token solo per URL protetti
  if (!isPublicUrl) {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 Aggiunto token');
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401 && !isPublicUrl) {
          console.warn('❌ 401 - Reindirizzamento al login');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }
    })
  );
};