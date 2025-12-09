import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';

// Crea un token per bypassare l'interceptor
export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  register(data: RegisterRequest): Observable<any> {
    // ⬅️ Bypassa l'interceptor per questa richiesta
    return this.http.post(`${this.apiUrl}/register`, data, {
      context: new HttpContext().set(BYPASS_AUTH, true)
    });
  }
}