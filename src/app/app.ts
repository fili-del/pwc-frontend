import { Component } from '@angular/core';
// Rimuovi: import { LoginComponent } from './login/login.component';
import { RouterOutlet } from '@angular/router'; // <-- NUOVO IMPORT

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
        // Rimuovi LoginComponent da qui!
        RouterOutlet // <-- AGGIUNGI RouterOutlet
    ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App { }