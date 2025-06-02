import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Moves } from '../interface/moves';


@Injectable({providedIn: 'root'})
export class ApiFetchService {
    private board: string[] = ["", "", "", "", "", "", "", "", ""];
    private games = [];
    
    constructor(
        private readonly client: HttpClient
    ) { }

    async getGames () {
    const url = `http://localhost:3000/`;
    try {
        const response = await fetch(url);
        if (response.status == 200){
            let json = await response.json();
            console.log(json);
        }
    } catch { 
        throw new Error('Failed to fetch data from api');
    }
    
    return this.games;
    }

    async newGame (gameId: string, player: string, position: number) {
        const url = `http://localhost:3000/game/${gameId}`;

        for(let i = 0; i < this.board.length; i++ ){
            this.board[i] = i === position ? player: '';
        }
        console.log("updated board", this.board);

        const temp = {
            game: 'foobar',
            move: 1,
            board: this.board
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                players: ['x'],
                moves: [temp]
            })
        });
        
        console.log(response);

        if (response.status == 201){
            console.log(this.board);
            let json = await response.json();
            this.board = json.moves[0].board;
            return this.board;
        }
        alert("error sending back new Game");
        return this.board;

    }

    async getGameByGameId (gameId: String) {
    const url = `http://localhost:3000/game/${gameId}`;
    try {
        const response = await fetch(url);
        if (response.status == 200){
            let json = await response.json();
            console.log(json);
            this.board = json.moves[0].board;
            console.log(this.board);
        }
    } catch { 
        throw new Error('Failed to fetch data from api');
    }
    
    return this.board;
    }

}
