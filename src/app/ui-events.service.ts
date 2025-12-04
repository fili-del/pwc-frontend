import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiEventsService {
  private openShareSubject = new Subject<void>();
  readonly openShare$ = this.openShareSubject.asObservable();

  private exitBoardSubject = new Subject<void>();
  readonly exitBoard$ = this.exitBoardSubject.asObservable();

  emitOpenShare(): void {
    this.openShareSubject.next();
  }

  emitExitBoard(): void {
    this.exitBoardSubject.next();
  }
}




