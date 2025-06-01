import { Moves } from "./moves"

export interface Game {
    players: Array<String>,
    moves: Array<Moves>
}
