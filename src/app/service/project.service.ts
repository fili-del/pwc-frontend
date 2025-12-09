import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfacce che riflettono i modelli Java ProjectRequest e Project/ProjectResponse
interface ProjectRequest {
  id?: string;        // ID necessario per l'eliminazione
  title: string;
  description: string;
  // Aggiungi altri campi se presenti nel tuo ProjectRequest Java
}

// Interfaccia per la risposta del progetto creato/ottenuto
interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  collaborators: string[];
  // ... altri campi della risposta
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly BASE_URL = 'http://localhost:8080'; 
  private readonly PROJECT_URL = `${this.BASE_URL}/project`; 

  constructor(private http: HttpClient) {}

  getMyProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(`${this.PROJECT_URL}/view`);
  }

  /**
   * Chiama l'endpoint POST /project/create per creare un nuovo progetto.
   * @param projectData Dati del progetto da creare (title, description, ecc.)
   * @returns Observable<ProjectResponse> con i dettagli del progetto creato.
   */
  createProject(projectData: ProjectRequest): Observable<ProjectResponse> {
    const url = `${this.PROJECT_URL}/create`;
    // L'AuthInterceptor aggiunge il JWT all'header
    return this.http.post<ProjectResponse>(url, projectData);
  }

  /**
   * Chiama l'endpoint DELETE /project/delete per eliminare un progetto.
   * @param projectId L'ID del progetto da eliminare.
   * @returns Observable<any> La risposta 202 (Accepted) o 404 (Not Found).
   */
  deleteProject(projectId: string): Observable<any> {
    const url = `${this.PROJECT_URL}/delete`;
    
    // NOTA: Il tuo endpoint DELETE Java accetta un Body (ProjectRequest con l'ID).
    // Questo è un approccio comune nelle API JAX-RS (Quarkus/Jersey) ma non standard HTTP.
    // Dobbiamo inviare l'ID nel body della richiesta DELETE.
    const deleteRequest: ProjectRequest = {
        id: projectId,
        title: '', // Campi placeholder, solo l'ID è richiesto dal delete
        description: ''
    };

    // Usiamo il metodo http.request di Angular per inviare un body con DELETE
    return this.http.request('DELETE', url, { body: deleteRequest });
  }
}