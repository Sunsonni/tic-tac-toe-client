import { Moves } from "./moves";

export interface Players {
    x: string;
    o: string;
}
export interface Game {
    players: Players,
    moves: Array<Moves>
    lastPlayerToMove?: string
}
