import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, shareReplay, throwError } from 'rxjs';
import { Game } from '../interface/game';
import { Moves } from '../interface/moves';



@Injectable({providedIn: 'root'})
export class ApiFetchService {
    
    constructor(private http: HttpClient) { }

    getGameByGameId (gameId: String) {
        return this.http.get<Game>(`http://localhost:3000/game/${gameId}`)
            .pipe(
                shareReplay(),
                catchError(err => {
                    const message = "Could not get game";
                    console.log(message, err);
                    return throwError(err);
                }),
            );
        
    }

    newGame (gameId: String, player: string, move: Moves) {
        const game: Game = {
            players: [player],
            moves: [move]
        }
        console.log(game);
        return this.http.post<Game>(`http://localhost:3000/game/${gameId}`, game)

    }

    saveMove(gameId: string, allPlayers: string[], allMoves: Moves[]) {
        const game: Game = {
            players: allPlayers,
            moves: allMoves
        };

        return this.http.post<Game>(`http://localhost:3000/game/${gameId}`, game);
    }


}
