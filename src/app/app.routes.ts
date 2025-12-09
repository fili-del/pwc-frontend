import { Routes } from '@angular/router';

// 1. IMPORT REGISTRAZIONE e LOGIN (sono entrambi nella cartella 'login')
// Nota: 'register.component.ts' si trova accanto a 'login.component.ts' dentro la cartella 'login'.
import { LoginComponent } from './login/login.component'; 
import { RegisterComponent } from './login/register.component'; // PERCORSO CORRETTO

// 2. IMPORT MAIN CONTENT (è nella cartella 'main-content')
// La classe del componente si chiama MainContent, come hai confermato.
import { MainContent } from './main-content/main-content';

export const routes: Routes = [
    // Rotta Login
    { path: 'login', component: LoginComponent },

    // Rotta Registrazione
    { path: 'register', component: RegisterComponent },

    // Rotta Contenuto Principale
    { path: 'main-content', component: MainContent },
    
    // Rotta di default
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
];