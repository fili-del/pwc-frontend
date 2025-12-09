import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// =======================================================
// 1. INTERFACCE PER LA COMUNICAZIONE CON IL BACKEND JAVA
// =======================================================

// Interfaccia per i dati di Login inviati (corrisponde a LoginRequest Java)
interface LoginRequest {
  email: string;
  password: string;
}

// Interfaccia per i dati di Registrazione inviati (corrisponde a RegisterRequest Java)
interface RegisterRequest {
  email: string;
  password: string;
  username: string; // Assicurati che questo campo corrisponda esattamente a quello del tuo backend
}

// Interfaccia per la risposta del Login (contiene i token)
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// =======================================================
// 2. SERVIZIO ANGULAR
// =======================================================

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ⚠️ BASE URL: Se stai usando l'ambiente Azure, dovrai usare quell'URL
  // Altrimenti, per i test locali con Quarkus, usa 'http://localhost:8080'
  private readonly BASE_URL = 'http://localhost:8080'; 
  private readonly AUTH_URL = `${this.BASE_URL}/auth`; 
  private readonly REGISTER_URL = `${this.BASE_URL}/register`;

  constructor(private http: HttpClient) {}

  /**
   * Chiama l'endpoint POST /auth/login di Quarkus.
   */
  login(credentials: LoginRequest): Observable<TokenResponse> {
    const url = `${this.AUTH_URL}/login`;
    
    return this.http.post<TokenResponse>(url, credentials).pipe(
      tap(response => {
        // Al successo, salviamo i token nel Local Storage
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        console.log("Login riuscito! Token salvati.");
      })
    );
  }

  /**
   * Chiama l'endpoint POST /register del backend Quarkus.
   * @param credentials Dati dell'utente da registrare (email, password, username).
   */
  register(credentials: RegisterRequest): Observable<any> {
    // La tua risorsa RegisterResource è mappata direttamente a /register
    return this.http.post(this.REGISTER_URL, credentials);
  }
}