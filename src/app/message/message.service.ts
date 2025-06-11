import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new BehaviorSubject<string[]>([]);
    message$: Observable<string[]> = this.subject.asObservable()
        .pipe(
            filter(messages => messages && messages.length > 0)
        ); 

    showMessage(...message: string[]) {
        this.subject.next(message);
    }
}
