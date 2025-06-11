import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Game } from '../interface/game';



@Injectable({providedIn: 'root'})
export class ApiFetchService {
    
    constructor(private http: HttpClient) { }

    getGameByGameId (gameId: String) {
        return this.http.get<Game>(`http://localhost:3000/game/${gameId}`)
            .pipe(
                catchError(err => {
                    const message = "Could not get game";
                    console.log(message, err);
                    return throwError(err);
                }),
            );
        
    }

    saveMove(gameId: string, game: Game) {
        return this.http.post<Game>(`http://localhost:3000/game/${gameId}`, game);
    }


}
