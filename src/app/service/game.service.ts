import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { evalFunctions } from '../evalFunctions';
import { Game, Players } from '../interface/game';
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
        console.log('ws subscribe occuring');
        this.game = data.game;
        this.gameName = data.game.moves[0]?.game || this.gameName;
        const lastMove = data.game.moves[data.game.moves.length - 1];
        this.moves$.next(data.game.moves);
        this.board$.next(lastMove ? lastMove.board : ['', '', '', '', '', '', '', '', '']);
        this.gameFinished$.next(this.evalFunctions.gameOver(this.board$.getValue(), this.currPlayer));
      }
    });
  }

newGameCreated(gameId: string, userId: string) {
//should set either x or o to userId
//should post to backend with gameobj
//should set board to empty board
//if user is x then get move from user
//else just send to back end



}


setGameById(gameId: string, userId: string){
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

  saveMoveInBackEnd(i: number, userId: string) {
    if(this.gameFinished$.value)
          return;
    if(!this.board$) {
      alert("Board not set");
      return;
    }
 
    let players: Players = this.game?.players ?? { x: "", o: "" };

    if (!players.x && !players.o) {
      players = this.currPlayer === 'x'
        ? { x: userId, o: "" }
        : { x: "", o: userId };
    } else if (!players.x && players.o !== userId) {
      players.x = userId;
    } else if (!players.o && players.x !== userId) {
      players.o = userId;
    }
    
    //need to get what player is and check if last move was them
    let temp =  Object.keys(players).find(
      k => players[k as keyof typeof players] === userId  
    ) || '';
    console.log(temp);
    if(temp == this.game?.lastPlayerToMove) {
      alert("Not currently your move!");
      return;
    }
    
    
    //early return if player tries to place a move in filled spot
    if(this.board$.getValue()[i] === 'x' || this.board$.getValue()[i] === 'o') {
      alert("space is already taken");
      return;
    }

    //creation of new board and fill with new move
    const newBoard = [...this.board$.getValue()];
    newBoard[i] = temp;
    
    //value for move number
    let currMove = this.moves$.getValue().length;

    //creates new move to add 
    const newMove: Moves = {
      game: this.gameName,
      move: currMove,
      board: newBoard
    };

    //creates updated moves array
    const updatedMoves = [...this.moves$.getValue(), newMove];

      const game: Game = {
            players: players,
            moves: updatedMoves,
            lastPlayerToMove: temp
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
