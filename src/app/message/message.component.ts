import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  showMessages = false;

  message$: Observable<string[]> | undefined;

  constructor(public messageService: MessageService) {

  }
 
  ngOnInit() {
    this.message$ = this.messageService.message$
      .pipe(
        tap(() => this.showMessages = true)
      );
  }

  onClose() {
    this.showMessages = false;
  }

}
