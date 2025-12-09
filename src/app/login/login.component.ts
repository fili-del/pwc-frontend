import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { RouterLink } from '@angular/router';
// Ho spostato TokenResponse e LoginRequest nell'AuthService per comodità, 
// ma se le hai definite altrove, adatta l'import qui.
// Esempio: import { TokenResponse, LoginRequest } from '../service/auth.service'; 

// Definiamo le interfacce qui per sicurezza se non le importi dall'AuthService

interface LoginRequest {
    email: string;
    password: string;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    // Risolve NG2008: Template Inline
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    error: string | null = null;
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    submitLogin(): void {
        this.error = null;

        if (!this.email || !this.password) {
            this.error = 'Per favore, inserisci tutti i campi.';
            return;
        }

        this.isLoading = true;

        const credentials: LoginRequest = {
            email: this.email,
            password: this.password
        };

        this.authService.login(credentials).subscribe({
            next: (response: TokenResponse) => {
                console.log('Login riuscito. Reindirizzamento.');
                this.router.navigate(['/main-content']);
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                console.error('Errore di Login:', err);

                if (err.status === 401) {
                    this.error = 'Credenziali non valide.';
                } else if (err.status === 0) {
                    this.error = 'Impossibile connettersi al server (Controlla Quarkus e CORS).';
                } else {
                    this.error = 'Si è verificato un errore inatteso.';
                }
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}