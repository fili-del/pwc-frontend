import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaccia che corrisponde a UserRequest del tuo Java
interface UserRequest {
  email?: string;
  username?: string;
  // Aggiungi tutti i campi necessari per l'aggiornamento
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly BASE_URL = 'http://localhost:8080';
  private readonly USER_URL = `${this.BASE_URL}/user`; 

  constructor(private http: HttpClient) {}


  updateUser(userId: string, userData: UserRequest): Observable<any> {
    const url = `${this.USER_URL}/update/${userId}`;
    
    return this.http.put(url, userData);
  }


  getMessages(receiverMail: string): Observable<any> {
    const url = `${this.USER_URL}/get_messages`;

    const messageRequest = { receiverMail: receiverMail };
    

    return this.http.post(url, messageRequest); 
  }
}