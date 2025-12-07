import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interfacce che mappano i dati di Input e Output con il backend Java
interface LoginRequest {
  email: string;
  password: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ⚠️ BASE URL: Assicurati che la porta e l'host siano corretti per il tuo Quarkus!
  private readonly BASE_URL = 'http://localhost:8080'; 
  private readonly AUTH_URL = `${this.BASE_URL}/auth`; 

  constructor(private http: HttpClient) {}

  /**
   * Chiama l'endpoint POST /auth/login di Quarkus per ottenere i token.
   */
  login(credentials: LoginRequest): Observable<TokenResponse> {
    const url = `${this.AUTH_URL}/login`;
    
    return this.http.post<TokenResponse>(url, credentials).pipe(
      tap(response => {
        // Al successo, salviamo i token nel Local Storage
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        console.log("Login riuscito! Token salvati nel Local Storage.");
      })
    );
  }
}