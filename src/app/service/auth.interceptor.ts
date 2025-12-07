import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    
    // Controlla se il token esiste e se la richiesta non è per un file locale
    if (accessToken) {
      // Clona la richiesta originale e aggiungi l'header di autorizzazione JWT
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      
      // Inoltra la richiesta modificata
      return next.handle(cloned);
    } 
    
    // Se il token non esiste, inoltra la richiesta originale (utile per la chiamata di Login stessa)
    return next.handle(request);
  }
}