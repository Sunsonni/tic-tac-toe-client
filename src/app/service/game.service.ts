import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { evalFunctions } from '../evalFunctions';
import { Game } from '../interface/game';
import { Moves } from '../interface/moves';
import { MessageService } from '../message/message.service';
import { ApiFetchService } from './api-fetch.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //TODO: Make variables into Obserables and send to component
  gameFinished$ = new BehaviorSubject<boolean>(false);
  moves$ = new BehaviorSubject<Moves[]>([]);
  game?: Game;
  gameName: string = 'foo';
  board$ = new BehaviorSubject<string[]>([]);
  currPlayer: string = 'x';
  gameId: any;

constructor(
  private apiservice: ApiFetchService,
  private evalFunctions: evalFunctions,
  private messageService: MessageService,
  private ws: WsService) { 
     this.ws.data$.subscribe(data => {
    if (data.game) {
      this.game = data.game;
      this.gameName = data.game.moves[0]?.game || this.gameName;
      const lastMove = data.game.moves[data.game.moves.length - 1];
      this.moves$.next(data.game.moves);
      this.board$.next(lastMove ? lastMove.board : ['', '', '', '', '', '', '', '', '']);
      this.gameFinished$.next(this.evalFunctions.gameOver(this.board$.getValue(), this.currPlayer));
    }
  });
  }



setGameById(gameId: string){
    this.apiservice.getGameByGameId(gameId)
    .pipe(
      catchError(err => {
        alert("error fetching game");
        return throwError(err);
      })
    )
    .subscribe((game) => {
      //TODO: clean up and simplify
      this.game = game;
      this.gameName = this.game.moves[0].game;
      const lastMove = game.moves[game.moves.length - 1];
      this.moves$.next(this.game.moves);
      this.board$.next(lastMove ? lastMove.board: ['', '', '', '', '', '', '', '', '']);
      this.gameFinished$.next(this.evalFunctions.gameOver(this.board$.getValue(), this.currPlayer));

    });
}

  saveMoveInBackEnd(i: number) {
    if(this.gameFinished$.value)
          return;
    if(!this.board$) {
      alert("Board not set");
      return;
    }
      
    //players array: initial value is first player
    let firstPlayerArray: string[] = [];
    if(this.moves$.getValue().length == 0) {
      firstPlayerArray.push(this.currPlayer); 
      firstPlayerArray.push(this.currPlayer === 'x' ? 'o' : 'x');
    } else {
      //set to prev array or if null set to default value
      firstPlayerArray = this.game?.players ?? ['x', 'o'];
    }

    //determines currently player
    if(this.moves$.getValue().length > 0) {
      this.currPlayer = this.evalFunctions.determineCurrPlayer(this.board$.getValue(), firstPlayerArray);
    }

    //early return if player tries to place a move in filled spot
    if(this.board$.getValue()[i] === 'x' || this.board$.getValue()[i] === 'o') {
      alert("space is already taken");
      return;
    }

    //creation of new board and fill with new move
    const newBoard = [...this.board$.getValue()];
    newBoard[i] = this.currPlayer;
    
    //value for move number
    let currMove = this.moves$.getValue().length;

    const newMove: Moves = {
      game: this.gameName,
      move: currMove,
      board: newBoard
    };

    const updatedMoves = [...this.moves$.getValue(), newMove];

      const game: Game = {
            players: firstPlayerArray,
            moves: updatedMoves
        };
    
    this.moves$.next(updatedMoves);
    this.board$.next(newBoard);

    this.apiservice.saveMove(newMove.game, game).subscribe();

    if(this.evalFunctions.checkWinner(this.board$.getValue(), this.currPlayer)) {
      this.gameFinished$.next(true);
      this.messageService.showMessage(this.currPlayer + " wins");
    }
    console.log(this.evalFunctions.availableMoves(this.board$.getValue()));
    this.gameFinished$.next(this.evalFunctions.gameOver(this.board$.getValue(), this.currPlayer));
    }




}
