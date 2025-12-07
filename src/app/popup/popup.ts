import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class PopupComponent {
  @Input() task: any;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<any>();

  closePopup() {
    this.close.emit();
  }

  deleteTask() {
    this.delete.emit(this.task);
  }
}
