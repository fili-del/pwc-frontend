// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Manteniamo HttpClientModule (anche se deprecato, finché non passi a Standalone)
import { FormsModule } from '@angular/forms'; // ⬅️ Soluzione definitiva per NG8002

// 🛑 HO COMMENTATO L'IMPORTAZIONE DI AppComponent PER RISOLVERE TS2307
// import { AppComponent } from './app.component';

import { AuthInterceptor } from './service/auth.interceptor'; 
import { LoginComponent } from './login/login.component'; // Ho aggiunto l'importazione di LoginComponent
// ... import degli altri tuoi moduli e componenti (se li hai)

@NgModule({
  declarations: [
    // 🛑 HO RIMOSSO AppComponent QUI
    // AppComponent,
    LoginComponent, // ⬅️ Usiamo LoginComponent come componente dichiarato
    // ... tutti i tuoi componenti (HeaderComponent, ecc.)
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Modulo per le chiamate HTTP
    FormsModule,      // ⬅️ RISOLVE DEFINITIVAMENTE NG8002
    // ...
  ],
  providers: [
    // 🛡️ REGISTRAZIONE DELL'INTERCEPTOR
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  // 🛑 Ho commentato AppComponent nel bootstrap; potresti doverlo sostituire con il componente che avvia la tua app
  // bootstrap: [AppComponent] 
})
export class AppModule { }