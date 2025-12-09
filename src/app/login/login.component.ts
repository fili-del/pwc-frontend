import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

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
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
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
                console.log('═══════════════════════════════════');
                console.log('✅ Login riuscito!');
                console.log('🔑 Token ricevuto (primi 30 caratteri):', response.accessToken.substring(0, 30) + '...');
                
                // Salva entrambi i token
                localStorage.setItem('token', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                
                console.log('💾 Token salvato in localStorage');
                
                // Verifica immediata
                const savedToken = localStorage.getItem('token');
                if (savedToken) {
                    console.log('✅ VERIFICA: Token presente in localStorage');
                    console.log('🔑 Token salvato (primi 30 caratteri):', savedToken.substring(0, 30) + '...');
                } else {
                    console.error('❌ ERRORE: Token NON trovato in localStorage!');
                }
                
                console.log('═══════════════════════════════════');
                
                // Usa setTimeout per assicurarsi che il token sia salvato prima del redirect
                setTimeout(() => {
                    console.log('🔍 Verifica finale prima del redirect:', localStorage.getItem('token') ? 'TOKEN PRESENTE ✅' : 'TOKEN ASSENTE ❌');
                    console.log('🚀 Reindirizzamento a /main-content...');
                    this.router.navigate(['/main-content']);
                }, 50);
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                console.error('❌ Errore di Login:', err);

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