import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class SidenavService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  public toggle() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
