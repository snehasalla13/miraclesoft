import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class ToastService {

  private toastMessage = new Subject<any>();

  sendToastMessage(message: string, type: string) {
    this.toastMessage.next({ 'message': message, 'type': type });
  }

  getToastMessage(): Observable<any> {
    return this.toastMessage.asObservable();
  }
}
