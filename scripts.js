const gameBoard = (() => {

    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']];

    const status = (r, c) => gameBoard[r][c];
    const gameBoardFull = () => gameBoard;
    const changeStatus = (r, c, status) => {
        gameBoard[r][c] = status;
    };

    const resetBoard = (isAIGame) => {
        if (isAIGame == false) {
            playerTwo.disablePlayerAI();
        }
        else if (isAIGame == true) {
            playerTwo.togglePlayerAI();
        }

        playerOne.resetHasWon();
        playerTwo.resetHasWon();
        const info = document.getElementById("info")
        info.innerText = ("Score: " + playerOne.getWins() + "-" + playerTwo.getWins() + "\nThe Game is On!");

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                changeStatus(i, j, "");
            }
        }
        displayController.updateScreen();
    };

    const evaluate = (b) => {
        // Checking for Rows for X or O victory.
        for (let row = 0; row < 3; row++) {
            if (b[row][0] == b[row][1] &&
                b[row][1] == b[row][2]) {
                if (b[row][0] == playerOne.getMarker())
                    return +10;

                else if (b[row][0] == playerTwo.getMarker())
                    return -10;
            }
        }

        // Checking for Columns for X or O victory.
        for (let col = 0; col < 3; col++) {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col]) {
                if (b[0][col] == playerOne.getMarker())
                    return +10;

                else if (b[0][col] == playerTwo.getMarker())
                    return -10;
            }
        }

        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == playerOne.getMarker())
                return +10;

            else if (b[0][0] == playerTwo.getMarker())
                return -10;
        }

        if (b[0][2] == b[1][1] &&
            b[1][1] == b[2][0]) {
            if (b[0][2] == playerOne.getMarker())
                return +10;

            else if (b[0][2] == playerTwo.getMarker())
                return -10;
        }

        // Else if none of them have
        // won then return 0
        return 0;
    }

    const isMovesLeft = (b) => {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (b[i][j] == '')
                    return true;

        return false;
    }

    return {
        status,
        changeStatus,
        resetBoard,
        evaluate,
        isMovesLeft,
        gameBoardFull
    };
})();

const player = (marker, wins, hasWonLast, isAI) => {


    const isPlayerAI = () => isAI;
    const togglePlayerAI = () => isAI = true;
    const disablePlayerAI = () => isAI = false;

    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = [0, 0];

        // Traverse all cells, evaluate
        // minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                // Check if cell is empty
                if (board[i][j] == "") {

                    // Make the move
                    board[i][j] = getMarker();

                    // compute evaluation function
                    // for this move.
                    let moveVal = minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = "";

                    // If the value of the current move
                    // is more than the best value, then
                    // update best
                    if (moveVal > bestVal) {
                        bestMove = [i, j];
                        bestVal = moveVal;
                    }
                }
            }
        }

        return bestMove;
    }

    const minimax = (board, depth, isMax) => {

        let score = gameBoard.evaluate(board);

        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10)
            return score;

        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10)
            return score;

        // If there are no more moves and
        // no winner then it is a tie
        if (gameBoard.isMovesLeft(board) == false)
            return 0;

        // If this maximizer's move
        if (isMax) {
            let best = -1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == "") {

                        // Make the move
                        board[i][j] = playerTwo.getMarker();

                        // Call minimax recursively
                        // and choose the maximum value
                        best = Math.max(best, minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = "";

                    }
                }
                return best;
            }
            
        }
        // If this minimizer's move
        else {
            let best = 1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == "") {

                        // Make the move
                        board[i][j] = playerOne.getMarker();

                        // Call minimax recursively
                        // and choose the minimum value
                        best = Math.min(best, minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = "";

                    }
                }
            }
            
            return best;
        }
        
    }

    const HasWon = () => hasWonLast = true;
    const resetHasWon = () => hasWonLast = false;
    const IncrementWins = () => {
        const info = document.getElementById("info")
        let winner;
        if (playerOne.getHasWonLast() && playerTwo.getHasWonLast()) {
            winner = "It's a tie!"
        }
        else if (playerOne.getHasWonLast()) {
            winner = "Player One Has Won!"
            wins++;
        }
        else if (playerTwo.getHasWonLast()) {
            winner = "Player Two Has Won";
            wins++;
        }
        info.innerText = ("Score: " + playerOne.getWins() + "-" + playerTwo.getWins() + "\n" + winner);


    }
    const AITurn = () => {

        let bestMove;
        //returns the index of the best move on the board
        bestMove = findBestMove(gameBoard.gameBoardFull());
        return bestMove;

    }

    const getWins = () => wins;
    const getHasWonLast = () => hasWonLast;
    const getMarker = () => marker;

    return {
        isPlayerAI,
        togglePlayerAI,
        disablePlayerAI,
        AITurn,
        findBestMove,
        getMarker,
        getHasWonLast,
        getWins,
        HasWon,
        resetHasWon,
        IncrementWins,
    };
};

const playerOne = player('X', 0, false, false);
const playerTwo = player('O', 0, false, true);

const displayController = (() => {

    const updateScreen = () => {
        let square;
        let status;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                square = document.querySelector('[data-index="' + i + "," + j +'"]');
                status = gameBoard.status(i, j)
                if (status == "X") {
                    square.firstElementChild.style.visibility = 'visible';
                }
                else if (status == "O") {
                    square.lastElementChild.style.visibility = 'visible';
                }
                else if (status == "") {
                    square.firstElementChild.style.visibility = 'hidden';
                    square.lastElementChild.style.visibility = 'hidden';
                }
            }
        }
    }

    return {
        updateScreen,
    }
})();

const turnController = (() => {
    let currentTurn = "X";

    const nextTurn = () => {
        if (currentTurn == "X") {
            currentTurn = "O";
        }

        else if (currentTurn == "O") {
            currentTurn = "X";
        }

        return (currentTurn);
    }

    const Turn = (r, c) => {

        if (playerOne.getHasWonLast() == false && playerTwo.getHasWonLast() == false) {

            if (gameBoard.status(r, c) == "") {
                gameBoard.changeStatus(r, c, getCurrentTurn());
                nextTurn();
                displayController.updateScreen();
            }

            let boardEvaluation = gameBoard.evaluate(gameBoard.gameBoardFull());

            if (boardEvaluation == 10){
                playerOne.HasWon();
                playerOne.IncrementWins();
            }

            else if (boardEvaluation == -10){
                playerTwo.HasWon();
                playerTwo.IncrementWins();
            }

            else if (boardEvaluation == 0) {
                gameBoard.isMovesLeft(gameBoard.gameBoardFull());
            }

            displayController.updateScreen();


            //checking if the second player set to AI
            if (playerTwo.isPlayerAI() == true && getCurrentTurn() == playerTwo.getMarker()) {
                //Asks the AITurn function which index is the best turn on the board
                let moveAI = playerTwo.AITurn();
                let r = moveAI[0];
                let c = moveAI[1];
                turnController.Turn(r, c);
            }
        }
    }

    const getCurrentTurn = () => currentTurn;

    return {
        getCurrentTurn,
        Turn,
        nextTurn,
    }

})();

displayController.updateScreen();