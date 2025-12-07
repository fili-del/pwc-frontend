import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfacce (come definite sopra o importate da models)
interface TaskRequest {
  title: string;
  description: string;
  dueDate?: string; 
  priority?: string;
}

interface TaskResponse {
  id: string;
  title: string;
  projectId: string;
  taskListId: string;
  // Aggiungi tutti i campi rilevanti per la risposta
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly BASE_URL = 'http://localhost:8080';
  private readonly TASK_URL = `${this.BASE_URL}/task`; 

  constructor(private http: HttpClient) {}

  // 1. CREA Attività (POST /task/create/{projectId}/{taskListId})
  /**
   * Crea una nuova attività in una specifica lista di un progetto.
   * @param projectId ID del progetto.
   * @param taskListId ID della lista a cui aggiungere il task.
   * @param taskRequest I dati del task (titolo, descrizione, ecc.).
   * @returns Observable<TaskResponse> Il task creato.
   */
  createTask(
    projectId: string,
    taskListId: string,
    taskRequest: TaskRequest
  ): Observable<TaskResponse> {
    const url = `${this.TASK_URL}/create/${projectId}/${taskListId}`;
    // L'AuthInterceptor aggiunge il token per securityContext.getUserPrincipal().getName()
    return this.http.post<TaskResponse>(url, taskRequest);
  }

  // 2. AGGIORNA Attività (PUT /task/{projectId}/{taskId})
  /**
   * Aggiorna un task esistente.
   * @param projectId ID del progetto contenitore.
   * @param taskId ID del task da aggiornare.
   * @param taskRequest I nuovi dati del task.
   * @returns Observable<TaskResponse> Il task aggiornato.
   */
  updateTask(
    projectId: string,
    taskId: string,
    taskRequest: TaskRequest
  ): Observable<TaskResponse> {
    const url = `${this.TASK_URL}/${projectId}/${taskId}`;
    return this.http.put<TaskResponse>(url, taskRequest);
  }

  // 3. MUOVI Attività (PATCH /task/{projectId}/{taskId}/move?newTaskListId=...)
  /**
   * Sposta un task in una nuova lista all'interno dello stesso progetto.
   * @param projectId ID del progetto contenitore.
   * @param taskId ID del task da muovere.
   * @param newTaskListId ID della lista di destinazione (Query Param).
   * @returns Observable<TaskResponse> Il task spostato.
   */
  moveTask(
    projectId: string,
    taskId: string,
    newTaskListId: string
  ): Observable<TaskResponse> {
    const url = `${this.TASK_URL}/${projectId}/${taskId}/move`;
    
    // Aggiungiamo newTaskListId come Query Parameter
    let params = new HttpParams().set('newTaskListId', newTaskListId);

    // Usiamo PATCH senza body (il body è opzionale)
    return this.http.patch<TaskResponse>(url, null, { params });
  }

  // 4. ELIMINA Attività (DELETE /task/delete/{taskId})
  /**
   * Elimina un task per ID.
   * @param taskId ID del task da eliminare.
   * @returns Observable<void> Risposta vuota se l'eliminazione ha successo.
   */
  deleteTask(taskId: string): Observable<void> {
    const url = `${this.TASK_URL}/delete/${taskId}`;
    // La risorsa Java è di tipo void, quindi ci aspettiamo una risposta vuota
    return this.http.delete<void>(url); 
  }
}