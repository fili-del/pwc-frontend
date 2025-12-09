import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiEventsService } from '../ui-events.service';
import { PopupComponent } from '../popup/popup';
import { ProjectService } from '../service/project.service';

type Task = {
  id: number;
  title: string;
  description: string;
  phase: string;
  labels: string[];
  assignee: string | null;
  dueDate: string | null;
};

type Project = {
  id: string;
  title: string;
  color?: string;
  collaborators: string[];
};

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],
  templateUrl: './main-content.html',
  styleUrls: ['./main-content.css'],
})
export class MainContent implements OnInit, OnDestroy {
  title = 'PROGETTI';
  projects: { title: string; color: string }[] = [];
  isLoadingProjects = false;
  projectsError: string | null = null;

  showCreateModal = false;
  newProjectTitle = '';
  selectedColor = '#2c2c2c';
  availableColors: string[] = [
    '#3a3a3a', '#ffffff', '#2f6de1', '#d4322d', '#ece51b',
    '#34d058', '#8f3fff', '#d628d6', '#20c5dd', '#005b3a'
  ];

  // Properties for sharing
  showShareModal = false;
  shareUsername = '';
  shareRoles: string[] = ['Full access', 'Can edit', 'Can view'];
  selectedShareRole = this.shareRoles[1];
  collaborators: { name: string, role: string }[] = [
      { name: 'John Doe', role: 'Full access' },
      { name: 'Jane Smith', role: 'Can edit' }
  ];

  // Properties for task management
  showTaskModal = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPhase = '';
  newTaskLabels: string[] = [];
  newTaskAssignee = '';
  newTaskDueDate = '';
  nextTaskId = 1;
  taskAvailableLabels: string[] = [
    '#d4322d', '#ece51b', '#34d058', '#2f6de1', '#8f3fff',
  ];
  showTaskDetailsPopup = false;
  selectedTask: Task | null = null;

  // Properties for modals
  showExitConfirmModal = false;
  showFilterModal = false;

  private subscriptions = new Subscription();

  activeProject: { title: string; color: string } | null = null;
  boardColumns: { title:string; description: string; actions: string[]; highlight: boolean; tasks: Task[] }[] = [];

  private phaseNames: string[] = [
    'Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto',
    'Sesto', 'Settimo', 'Ottavo', 'Nono', 'Decimo'
  ];

  constructor(
    private uiEvents: UiEventsService,
    private projectService: ProjectService
  ) {
    this.initializeBoard();

    this.subscriptions.add(
      this.uiEvents.openShare$.subscribe(() => {
        if (this.activeProject) {
          this.openShareModal();
        }
      }),
    );

    this.subscriptions.add(
      this.uiEvents.exitBoard$.subscribe(() => {
        if (this.activeProject) {
          this.openExitConfirm();
        }
      }),
    );
  }

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {
    this.isLoadingProjects = true;
    this.projectsError = null;

    this.subscriptions.add(
      this.projectService.getMyProjects().subscribe({
        next: (projects: Project[]) => {
          console.log('Progetti caricati:', projects);
          
          // Mappa i progetti dal backend al formato locale
          this.projects = projects.map(p => ({
            title: p.title,
            color: p.color || '#2c2c2c' // Colore di default se non presente
          }));
          
          this.isLoadingProjects = false;
        },
        error: (error) => {
          console.error('Errore nel caricamento dei progetti:', error);
          this.projectsError = 'Impossibile caricare i progetti. Riprova.';
          this.isLoadingProjects = false;
        }
      })
    );
  }

  private initializeBoard(): void {
    this.boardColumns = [
      {
        title: this.phaseNames[0],
        description: 'Prova',
        actions: ['Aggiungi una nuova scheda', 'Aggiungi task'],
        highlight: false,
        tasks: [],
      },
      {
        title: this.phaseNames[1],
        description: '',
        actions: ['Aggiungi una nuova scheda', 'Aggiungi task'],
        highlight: false,
        tasks: [],
      },
      {
        title: this.phaseNames[2],
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

  get phaseColumns(): { title: string }[] {
    return this.boardColumns.filter(col => col.title);
  }

  openTaskModal(columnTitle?: string): void {
    this.showTaskModal = true;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPhase = columnTitle ?? this.phaseColumns[0]?.title ?? '';
    this.newTaskLabels = [];
    this.newTaskAssignee = '';
    this.newTaskDueDate = '';
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
  }

  handleColumnAction(
    column: { title: string },
    action: string,
  ): void {
    if (action === 'Aggiungi task') {
      this.openTaskModal(column.title);
    } else if (action === 'Aggiungi una nuova fase') {
      this.addPhase();
    }
  }

  addPhase(): void {
    const phaseIndex = this.boardColumns.length - 1;
    const newTitle = this.phaseNames[phaseIndex] || `Fase ${phaseIndex + 1}`;

    const newPhase = {
      title: newTitle,
      description: '',
      actions: ['Aggiungi una nuova scheda', 'Aggiungi task'],
      highlight: false,
      tasks: [],
    };

    this.boardColumns.splice(phaseIndex, 0, newPhase);
  }

  toggleTaskLabel(color: string): void {
    if (this.newTaskLabels.includes(color)) {
      this.newTaskLabels = this.newTaskLabels.filter((c: string) => c !== color);
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

  deleteTask(taskToDelete: Task): void {
    if (!taskToDelete) {
      return;
    }

    const columnIndex = this.boardColumns.findIndex(c => c.title === taskToDelete.phase);
    if (columnIndex > -1) {
      const taskIndex = this.boardColumns[columnIndex].tasks.findIndex(t => t.id === taskToDelete.id);
      if (taskIndex > -1) {
        this.boardColumns[columnIndex].tasks.splice(taskIndex, 1);
      }
    }

    this.closeTaskDetails();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}