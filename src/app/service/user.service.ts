import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfacce (come definite sopra)
interface UserRequest {
  username?: string;
}

interface MessageRequest {
  senderMail?: string; 
  receiverMail: string;
  text: string;
}

interface ResponseToProjectRequest {
  projectId: string;
  response: boolean;
}

interface MessageResponse {
  sender: string;
  text: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly BASE_URL = 'http://localhost:8080';
  private readonly USER_URL = `${this.BASE_URL}/user`; 

  constructor(private http: HttpClient) {}

  // 1. Invia Messaggio (POST /user/send_message)
  /**
   * Invia un messaggio a un altro utente.
   * @param messageRequest Dati del messaggio (receiverMail, text, ecc.).
   * @returns Observable<any> Conferma dell'invio.
   */
  sendMessage(messageRequest: MessageRequest): Observable<any> {
    const url = `${this.USER_URL}/send_message`;
    return this.http.post(url, messageRequest);
  }

  // 2. Ottieni Messaggi (GET /user/get_messages)
  /**
   * Ottiene i messaggi per l'utente loggato.
   * NOTA: Il tuo endpoint Java è GET ma si aspetta un BODY (MessageRequest).
   * L'approccio standard HTTP per GET non usa un body. Per compatibilità con la tua risorsa Java, 
   * useremo un metodo POST che simula la GET, o useremo http.request, che è più pulito.
   * Qui usiamo POST per inviare il body, ma è tecnicamente meno RESTful.
   * @param receiverMail La mail dell'utente che riceve (e che sta chiedendo i messaggi).
   * @returns Observable<MessageResponse[]> Lista dei messaggi.
   */
  getMessages(receiverMail: string): Observable<MessageResponse[]> {
    const url = `${this.USER_URL}/get_messages`;
    const messageRequest: MessageRequest = { receiverMail: receiverMail, text: '' }; // Body richiesto
    
    // Si usa POST per inviare il body a un endpoint GET
    return this.http.post<MessageResponse[]>(url, messageRequest); 
    
    // Alternativa RESTful (richiede modifica backend a GET con Query Param):
    // return this.http.get<MessageResponse[]>(url, { params: { receiverMail: receiverMail } });
  }

  // 3. Risposta a Progetto (GET /user/response)
  /**
   * Invia una risposta (accetta/rifiuta) ad un progetto.
   * NOTA: Anche questo endpoint è GET ma si aspetta un BODY (ResponseToProjectRequest). Usiamo POST.
   * @param responseRequest Dati della risposta.
   * @returns Observable<any> Conferma della risposta.
   */
  getResponseToProject(responseRequest: ResponseToProjectRequest): Observable<any> {
    const url = `${this.USER_URL}/response`;
    return this.http.post(url, responseRequest); // Simula GET con Body tramite POST
  }

  // 4. Aggiorna Utente (PUT /user/update/{userId})
  /**
   * Aggiorna i dati del profilo utente.
   * @param userId L'ID dell'utente da aggiornare.
   * @param userData I dati da aggiornare (username, ecc.).
   * @returns Observable<any> Il profilo utente aggiornato.
   */
  updateUser(userId: string, userData: UserRequest): Observable<any> {
    const url = `${this.USER_URL}/update/${userId}`;
    // L'AuthInterceptor aggiunge il token
    return this.http.put(url, userData);
  }
}