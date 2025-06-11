import { Moves } from "./moves"

export interface Game {
    players: Array<string>,
    moves: Array<Moves>
}
