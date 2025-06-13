import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Game } from './interface/game';
import { GameService } from './service/game.service';
import { WsService } from './service/ws.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  player: FormGroup;

  gameId: string = 'apple';
  board$: Observable<string[]> | undefined;
  game$: Observable<Game> | undefined;
  showComponent = false;
  options = ['x', 'o'];
  selectedOption: string | null = null;
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private ws: WsService) {
    //creation of forms
    this.form = this.formBuilder.group({
      gameId: new FormControl('', Validators.pattern('^[a-zA-Z0-9]*$'))
    });
    this.player = this.formBuilder.group({
      playerSelect: new FormControl('', Validators.required),
      gameName: new FormControl('', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9]*$')])
    })
    this.ws.connectWebSocket();
    this.board$ = this.gameService.board$;
  }

  ngOnInit() {
    this.player.get('gameName')?.valueChanges
      .subscribe(newValue => {
        this.gameService.gameName = newValue;
      })

    this.form.get('gameId')?.valueChanges
      .subscribe(newValue => {
        this.gameId = newValue;
        this.gameService.gameId = newValue;
      })

    this.ws.data$.subscribe(data => {
      console.log('from websocket', data);
      this.data = data;
      console.log(this.data);
    }
    );
    
  }
  
  public newGameSubmit() {
    this.gameService.board$.next(['', '', '', '', '', '', '', '', '']);
    this.gameService.currPlayer = this.player.get('playerSelect')?.value || 'x';
    this.gameService.gameFinished$.next(false);
    this.gameService.moves$.next([]);
    this.showComponent = false;
  }
  
  public onClick() {
    this.showComponent = true;
  }

  public onSubmit() {
    
    this.gameService.setGameById(this.gameId);
    
  }

  move(i: number) {
    this.gameService.saveMoveInBackEnd(i);
    
  }


}
