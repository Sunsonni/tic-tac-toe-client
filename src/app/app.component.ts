import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Game } from './interface/game';
import { Moves } from './interface/moves';
import { ApiFetchService } from './service/api-fetch.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  player: FormGroup;

  moves: Moves[] = [];
  currPlayer: string = 'x';
  game: Game | undefined;
  board: string[] | undefined;
  board$: Observable<string[]> | undefined;

  showComponent = false;

  constructor(
    private apiservice: ApiFetchService,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      gameId: new FormControl('')
    });
    this.player = this.formBuilder.group({
      playerSelect: new FormControl('')
    })
  }

  ngOnInit() {
    this.player.get('playerSelect')?.valueChanges
      .subscribe(newValue => {
        console.log("just testing", newValue);
      })
  }
  

  public onSubmit() {
    this.apiservice.getGameByGameId(this.form.value.gameId)
    .pipe(
      catchError(err => {
        alert("error fetching game");
        return throwError(err);
      })
    )
    .subscribe((game) => {
      this.game = game;

      const lastMove = game.moves[game.moves.length - 1];
      this.board = lastMove ? lastMove.board: ['', '', '', '', '', '', '', '', ''];
      this.board$ = of(this.board);
    });
    
  }
  
  
  public onClick() {
    this.board = ['', '', '', '', '', '', '', '', '']
    this.board$ = of(this.board);
  
    this.showComponent = true;


  }

  move(i: number) {
    if(!this.board) {
      alert("board not set");
      return;
    }

    if(this.board[i] === 'x' || this.board[i] === 'o') {
      alert("space is already taken");
    }
    const newBoard = [...this.board];
    newBoard[i] = this.currPlayer;
    

    const newMove: Moves = {
      game: this.game?.moves[0].game ?? '',
      move: i,
      board: newBoard
    };
    
    console.log(newMove);
    this.board$ = of(newBoard);
    //   this.apiservice.saveMove(this.game?.moves[0].game ?? '', this.game?.players ?? [], []);

  }

}
