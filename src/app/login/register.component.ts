import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService, RegisterRequest } from '../service/register.service';
// Assumiamo che RegisterRequest sia definita e importata da RegisterService

// ...
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    // CORREGGI QUI: da .hmtl a .html
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    // ...

    // Corrispondono ai campi che ti aspetti nel tuo RegisterRequest Java
    email: string = '';
    password: string = '';
    // Aggiungi qui eventuali altri campi, come 'username' o 'confirmPassword'
    // confirmPassword: string = ''; 

    error: string | null = null;
    message: string | null = null; // Messaggio di successo
    isLoading: boolean = false;

    constructor(
        private registerService: RegisterService,
        private router: Router
    ) { }

    submitRegistration(): void {
        this.error = null;
        this.message = null;

        if (!this.email || !this.password) {
            this.error = 'Per favore, inserisci tutti i campi richiesti.';
            return;
        }
        // Se usi la conferma password, aggiungi la verifica qui
        /*
        if (this.password !== this.confirmPassword) {
            this.error = 'Le password non corrispondono.';
            return;
        }
        */

        this.isLoading = true;

        const registrationData: RegisterRequest = {
            email: this.email,
            password: this.password
            // Aggiungi qui eventuali altri campi
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

                if (err.status === 409) { // 409 Conflict è comune per "utente già esistente"
                    this.error = 'Questo utente (email) è già registrato.';
                } else if (err.status === 0) {
                    this.error = 'Impossibile connettersi al server (Controlla Quarkus e CORS).';
                } else {
                    this.error = `Errore: ${err.error.message || err.statusText}`;
                }
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}