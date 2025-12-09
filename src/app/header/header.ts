import { Component } from '@angular/core';
import { UiEventsService } from '../ui-events.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [], // Puoi aggiungere qui altri componenti/moduli se necessario
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private uiEvents: UiEventsService) {}

  onHeaderShareClick(): void {
    this.uiEvents.emitOpenShare();
  }

  onHeaderExitClick(): void {
    this.uiEvents.emitExitBoard();
  }
}
