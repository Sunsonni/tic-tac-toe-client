import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of, throwError } from 'rxjs';
import { evalFunctions } from './evalFunctions';
import { Game } from './interface/game';
import { Moves } from './interface/moves';
import { MessageService } from './message/message.service';
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

  //TODO: clean up subscriptiosn and amount of variables
  gameFinished: boolean = false;
  message$?: Observable<string>;
  moves: Moves[] = [];
  currPlayer: string = "x";
  gameName: string = 'foo';
  game: Game | undefined;
  board: string[] | undefined;
  board$: Observable<string[]> | undefined;

  showComponent = false;

  constructor(
    private apiservice: ApiFetchService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private evalFunctions: evalFunctions) {
    this.form = this.formBuilder.group({
      gameId: new FormControl('', Validators.pattern('^[a-zA-Z0-9]*$'))
    });
    this.player = this.formBuilder.group({
      playerSelect: new FormControl('', Validators.required),
      gameName: new FormControl('', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9]*$')])
    })
  }

  ngOnInit() {
    this.player.get('gameName')?.valueChanges
      .subscribe(newValue => {
        this.gameName = newValue;
      })
  }
  
  public newGameSubmit() {
    this.board = ['', '', '', '', '', '', '', '', '']
    this.board$ = of(this.board);
    this.currPlayer = this.player.get('playerSelect')?.value || 'x';
    this.moves = [];
    this.showComponent = false;
    this.gameFinished = false;
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
      this.gameName = this.game.moves[0].game;
      const lastMove = game.moves[game.moves.length - 1];
      this.moves = [];
      this.moves = this.game.moves;
      this.board = lastMove ? lastMove.board: ['', '', '', '', '', '', '', '', ''];
      this.gameFinished = this.evalFunctions.determineResult(this.board);
      this.board$ = of(this.board);
    });
    
  }
  
  public onClick() {
    this.showComponent = true;
  }

  move(i: number) {
    if(this.gameFinished)
      return;
    if(!this.board) {
      alert("Board not set");
      return;
    }

    let firstPlayerArray: string[] = [];
    if(this.moves.length == 0) {
      firstPlayerArray.push(this.currPlayer); 
      firstPlayerArray.push(this.currPlayer === 'x' ? 'o' : 'x');
    } else {
      firstPlayerArray = this.game?.players ?? ['x', 'o'];
    }

    if(this.moves.length > 0) {
      this.currPlayer = this.evalFunctions.determineCurrPlayer(this.board, firstPlayerArray);
    }

    if(this.board[i] === 'x' || this.board[i] === 'o') {
      alert("space is already taken");
      return;
    }

    const newBoard = [...this.board];
    newBoard[i] = this.currPlayer;
    
    let currMove = this.moves.length;

    const newMove: Moves = {
      game: this.gameName,
      move: currMove,
      board: newBoard
    };
    
    this.moves.push(newMove);
    this.board = newBoard;
    this.board$ = of(newBoard);

     const game: Game = {
            players: firstPlayerArray,
            moves: this.moves
        };
    
    this.apiservice.saveMove(newMove.game, game).subscribe();
    this.game = game;

    if(this.evalFunctions.determineResult(this.board)) {
      this.gameFinished = true;
      this.messageService.showMessage(this.currPlayer + " wins");
    }

  }


}
