import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ApiFetchService {
    private board = [];
    
    constructor(
        private readonly client: HttpClient
    ) { }

    async getData (gameId: String) {
    const url = `http://localhost:3000/game/${gameId}`;
    try {
        const response = await fetch(url);
        if (response.status == 200){
            let json = await response.json();
            this.board = json.moves[0].board;
            return this.board;
        }
    } catch { 
        throw new Error('Failed to fetch data from api');
    }
    
    return this.board;
    }

}
