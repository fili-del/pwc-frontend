import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 🛑 CORREZIONE: RouterLink va nell'array imports dello standalone component
import { Router, RouterLink } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';
// Assumiamo che RegisterRequest includa { email, password, username }
import { RegisterService, RegisterRequest } from '../service/register.service'; 

// ...
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink // ⬅️ Aggiunto qui per l'uso nel template
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    // Proprietà del form
    email: string = '';
    password: string = '';
    confirmPassword: string = ''; 
    username: string = ''; // ⬅️ NUOVO: Aggiunta la proprietà username

    // Proprietà di stato
    error: string | null = null;
    message: string | null = null;
    isLoading: boolean = false;

    constructor(
        private registerService: RegisterService,
        private router: Router
    ) { }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    submitRegistration(): void {
        this.error = null;
        this.message = null;
        
        console.log('Dati di registrazione inviati:', { email: this.email, username: this.username, password: this.password });

        // 📝 Validazione
        if (!this.email || !this.password || !this.username) {
            this.error = 'Per favore, inserisci tutti i campi richiesti (Email, Username, Password).';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.error = 'Le password non corrispondono.';
            return;
        }

        this.isLoading = true;

        // 🚀 Creazione del body della richiesta
        const registrationData: RegisterRequest = {
            email: this.email,
            password: this.password,
            username: this.username 
        };

        this.registerService.register(registrationData).subscribe({
            next: (response) => {
                console.log('Registrazione Riuscita:', response);
                this.message = 'Registrazione avvenuta con successo! Reindirizzamento al login...';
                
                // Reindirizza alla pagina di login dopo un breve ritardo
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                console.error('Errore di Registrazione:', err);

                let customErrorMessage = 'Si è verificato un errore inaspettato.';

                if (err.status === 409) {
                    customErrorMessage = 'Questa email o username è già registrato nel sistema.';
                } else if (err.status === 401) {
                    // ⚠️ Questo errore è critico (problema @PermitAll), come discusso in precedenza.
                    customErrorMessage = 'Accesso non autorizzato. Verifica la configurazione di sicurezza del backend (@PermitAll).';
                } else if (err.status === 0) {
                    customErrorMessage = 'Impossibile connettersi al server. (Server Quarkus spento o errore CORS).';
                } else if (err.error && typeof err.error === 'object') {
                    customErrorMessage = err.error.message || err.error.detail || err.statusText;
                } else {
                    customErrorMessage = err.statusText || customErrorMessage;
                }

                this.error = customErrorMessage;
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}