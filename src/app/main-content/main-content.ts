import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiEventsService } from '../ui-events.service';
import { PopupComponent } from '../popup/popup';

type Task = {
  id: number;
  title: string;
  description: string;
  phase: string;
  labels: string[];
  assignee: string | null;
  dueDate: string | null;
};

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],
  templateUrl: './main-content.html',
  styleUrl: './main-content.css',
})
export class MainContent implements OnDestroy {
  title = 'PROGETTI';
  projects: { title: string; color: string }[] = [
    { title: 'Progetto 1', color: '#2c2c2c' },
  ];

  showCreateModal = false;
  newProjectTitle = '';
  selectedColor = '#2c2c2c';
  availableColors: string[] = [
    '#3a3a3a', '#ffffff', '#2f6de1', '#d4322d', '#ece51b',
    '#34d058', '#8f3fff', '#d628d6', '#20c5dd', '#005b3a'
  ];

  activeProject: { title: string; color: string } | null = null;
  boardColumns: { title: string; description: string; actions: string[]; highlight: boolean; tasks: Task[] }[] = [
    {
      title: 'Primo',
      description: 'Prova',
      actions: ['Aggiungi una nuova scheda', 'Aggiungi task'],
      highlight: false,
      tasks: [],
    },
    {
      title: 'Secondo',
      description: '',
      actions: ['Aggiungi una nuova scheda', 'Aggiungi task'],
      highlight: false,
      tasks: [],
    },
    {
      title: 'Terzo',
      description: 'Inserisci il testo',
      actions: ['Aggiungi task'],
      highlight: true,
      tasks: [],
    },
    {
      title: '',
      description: '',
      actions: ['Aggiungi una nuova fase', 'Aggiungi task'],
      highlight: false,
      tasks: [],
    },
  ];

  showShareModal = false;
  shareUsername = '';
  shareRoles = ['Amministratore', 'Membro', 'Osservatore'];
  selectedShareRole = this.shareRoles[1];
  shareLinkEnabled = true;
  collaborators = [
    { name: 'Anna Rossi', role: 'Amministratore' },
    { name: 'Luca Bianchi', role: 'Membro' },
    { name: 'Marco Verdi', role: 'Membro' },
    { name: 'Sara Neri', role: 'Osservatore' },
  ];

  // Stato popup Task
  showTaskModal = false;
  // Stato popup conferma uscita
  showExitConfirmModal = false;
  // Stato popup filtri
  showFilterModal = false;
  
  selectedTask: Task | null = null;
  showTaskDetailsPopup = false;

  private subscriptions = new Subscription();

  // Nuova task (popup Task)
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPhase = '';
  newTaskLabels: string[] = [];
  newTaskAssignee = '';
  newTaskDueDate = '';
  taskAvailableLabels: string[] = ['#e53935', '#1e88e5', '#fdd835', '#1b5e20'];
  private nextTaskId = 1;
  tasks: Task[] = [];

  constructor(private uiEvents: UiEventsService) {
    this.subscriptions.add(
      this.uiEvents.openShare$.subscribe(() => {
        // Apri popup condivisione solo se c'è un progetto aperto
        if (this.activeProject) {
          this.openShareModal();
        }
      }),
    );

    this.subscriptions.add(
      this.uiEvents.exitBoard$.subscribe(() => {
        // Mostra conferma uscita se c'è un progetto aperto
        if (this.activeProject) {
          this.openExitConfirm();
        }
      }),
    );
  }

  openCreateModal(): void {
    this.newProjectTitle = '';
    this.selectedColor = this.availableColors[0];
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createProject(): void {
    const trimmed = this.newProjectTitle.trim();
    if (!trimmed) {
      return;
    }
    this.projects = [
      ...this.projects,
      { title: trimmed, color: this.selectedColor }
    ];
    this.closeCreateModal();
  }

  openProject(project: { title: string; color: string }): void {
    this.activeProject = project;
  }

  closeProject(): void {
    this.activeProject = null;
  }

  openShareModal(event?: MouseEvent): void {
    event?.stopPropagation();
    this.shareUsername = '';
    this.selectedShareRole = this.shareRoles[1];
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  inviteCollaborator(): void {
    const trimmed = this.shareUsername.trim();
    if (!trimmed) {
      return;
    }

    this.collaborators = [
      ...this.collaborators,
      { name: trimmed, role: this.selectedShareRole },
    ];

    this.shareUsername = '';
  }

  // ===== Gestione popup Task =====
  openTaskModal(columnTitle?: string): void {
    this.showTaskModal = true;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPhase = columnTitle ?? this.boardColumns[0]?.title ?? '';
    this.newTaskLabels = [];
    this.newTaskAssignee = '';
    this.newTaskDueDate = '';
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
  }

  handleColumnAction(column: { title: string }, action: string): void {
    if (action === 'Aggiungi task') {
      this.openTaskModal(column.title);
    }
    // In futuro qui potrai gestire altre azioni delle colonne
  }

  toggleTaskLabel(color: string): void {
    if (this.newTaskLabels.includes(color)) {
      this.newTaskLabels = this.newTaskLabels.filter((c) => c !== color);
    } else {
      this.newTaskLabels = [...this.newTaskLabels, color];
    }
  }

  createTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return;
    }

    const task: Task = {
      id: this.nextTaskId++,
      title,
      description: this.newTaskDescription.trim(),
      phase: this.newTaskPhase,
      labels: [...this.newTaskLabels],
      assignee: this.newTaskAssignee.trim() || null,
      dueDate: this.newTaskDueDate || null,
    };
    
    const columnIndex = this.boardColumns.findIndex(c => c.title === task.phase);
    if (columnIndex > -1) {
      this.boardColumns[columnIndex].tasks.push(task);
    }

    console.log('Nuova task creata', task);
    this.closeTaskModal();
  }

  // Popup conferma uscita
  openExitConfirm(): void {
    this.showExitConfirmModal = true;
  }

  cancelExit(): void {
    this.showExitConfirmModal = false;
  }

  confirmExit(): void {
    this.showExitConfirmModal = false;
    this.closeProject();
  }

  // Popup filtri
  openFilterModal(): void {
    this.showFilterModal = true;
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskDetailsPopup = true;
  }

  closeTaskDetails(): void {
    this.showTaskDetailsPopup = false;
    this.selectedTask = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
