import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. Recupera il token (qui uso localStorage per semplicità, ma potresti usare un AuthService)
    const myToken = localStorage.getItem('access_token');

    // 2. Se il token esiste, clona la richiesta e aggiungi l'header
    // IMPORTANTE: Le richieste sono immutabili, devi clonarle per modificarle
    if (myToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${myToken}`
        }
      });
    }

    // 3. Passa la richiesta al prossimo handler e gestisci eventuali errori
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 401) {
          // Esempio: Se ricevi un 401 Unauthorized, potresti fare il logout o redirect al login
          console.error('Non autorizzato! Reindirizzamento al login...');
        }
        
        return throwError(() => error);
      })
    );
  }
}