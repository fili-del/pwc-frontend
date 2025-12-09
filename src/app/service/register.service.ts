import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definisci l'interfaccia che corrisponde al tuo RegisterRequest Java
export interface RegisterRequest {
    email: string;
    password: string;
    // Aggiungi qui gli altri campi se presenti nel RegisterRequest Java
}

// L'API RegisterResource restituisce un Response.ok().build() (stato 200/204) senza body.
// Quindi possiamo usare 'void' o un oggetto vuoto per il tipo di risposta.
type RegisterResponse = void;

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    // Adatta l'URL base del tuo server Quarkus se è diverso
    private apiUrl = 'http://localhost:8080/register';

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): Observable<RegisterResponse> {
        // L'endpoint Quarkus è una POST che consuma JSON, esattamente come qui.
        return this.http.post<RegisterResponse>(this.apiUrl, request);
    }
}