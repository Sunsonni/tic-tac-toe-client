export class evalFunctions {
    constructor () {}

    determineCurrPlayer(board: string[], players: string[]) : string {
        const xCount = board.filter(cell => cell === 'x');
        const oCount = board.filter(cell => cell === 'o');
        if(xCount.length == oCount.length) {
            return players[0];
        }
        return xCount.length > oCount.length ? 'o' : 'x';
    }
    
    checkWinner(board: string[], currPlayer: string) {
        const WinConditions = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6]
        ];
        let results = WinConditions.some(condition =>
            condition.every(index => board[index] && board[index] === board[condition[0]])
        );
        if(results === true) {
          return currPlayer;
        }
        return null;
    }
    
    //TODO: create AI for player to play against
    movesLeft(board: string[]) {
    for(let i = 0; i < board.length; i++) {
      if(board[i] == '') {
        return true;
      }
    }
    return false;
    }

    availableMoves(board: string[]) {
      const indices: number[] = [];
      let index = board.indexOf('');
      while (index !== -1) {
        indices.push(index);
        index = board.indexOf('', index + 1);
      }
      return indices;
    }

    gameOver(board: string[], currPlayer: string) {
      return this.checkWinner(board, currPlayer) != null || !this.movesLeft(board);
    }
    
    minimax(board: string[], isMax: boolean) {
      // let winner = this.checkWinner(board);
      // if()
    }

}