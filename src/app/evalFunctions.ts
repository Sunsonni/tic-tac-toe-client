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
    
    determineResult(board: string[]) {
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
        return results;
    }
    
    movesLeft(board: string[]) {
    for(let i = 0; i < board.length; i++) {
      if(board[i] == '') {
        return true;
      }
    }
    return false;
  }
}