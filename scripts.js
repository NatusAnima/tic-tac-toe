const gameBoard = (() => {
    let gameBoard = [
        "", "", "",
        "", "", "",
        "", "", ""]
    const status = (i) => gameBoard[i];
    const gameBoardFull = () => gameBoard;
    const changeStatus = (i, status) => {
        gameBoard[i] = status
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

        for (let index = 0; index < 9; index++) {
            changeStatus(index, "");
        }
        displayController.updateScreen();
    };

    return {
        status,
        changeStatus,
        resetBoard,
        gameBoardFull
    };
})();

const player = (marker, wins, hasWonLast, isAI) => {


    const isPlayerAI = () => isAI;
    const togglePlayerAI = () => isAI = true;
    const disablePlayerAI = () => isAI = false;

    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = -1;

        // Traverse all cells, evaluate
        // minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for (let i = 0; i < board.length; i++) {

            // Check if cell is empty
            if (board[i] == "") {

                // Make the move
                board[i] = getMarker();

                // compute evaluation function
                // for this move.
                let moveVal = minimax(board, 0, false);

                // Undo the move
                board[i] = "";

                // If the value of the current move
                // is more than the best value, then
                // update best
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }

        return bestMove;
    }

    const minimax = (board, depth, isMax) => {
        // If this maximizer's move
        if (isMax) {
            let best = -1000;

            // Traverse all cells
            for (let i = 0; i < 9; i++) {
                // Check if cell is empty
                if (board[i] == "") {

                    // Make the move
                    board[i] = getMarker();

                    // Call minimax recursively
                    // and choose the maximum value
                    best = Math.max(best, minimax(board,
                        depth + 1, !isMax));

                    // Undo the move
                    board[i] = "";

                }
            }
            return best;
        }
        // If this minimizer's move
        else {
            let best = 1000;

            // Traverse all cells
            for (let i = 0; i < 9; i++) {
                // Check if cell is empty
                if (board[i] == "") {

                    // Make the move
                    board[i] = getMarker();

                    // Call minimax recursively
                    // and choose the minimum value
                    best = Math.min(best, minimax(board,
                        depth + 1, !isMax));

                    // Undo the move
                    board[i] = "";

                }
            }
        }
        return best;
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
            winner = "Player Two Has Won"
            wins++;
        }
        info.innerText = ("Score: " + playerOne.getWins() + "-" + playerTwo.getWins() + "\n" + winner);


    }
    const AITurn = () => {

        let bestMove = 0;

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
        for (let index = 0; index < 9; index++) {
            square = document.querySelector('[data-index="' + index + '"]');
            status = gameBoard.status(index)
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

    const TurnAI = () => {

    }

    const Turn = (index) => {

        if (playerOne.getHasWonLast() == false && playerTwo.getHasWonLast() == false) {

            if (gameBoard.status(index) == "") {
                gameBoard.changeStatus(index, getCurrentTurn());
                nextTurn();
                displayController.updateScreen();
            }
            

            //Check if rows are the same and not empty
            if (gameBoard.status(0) == gameBoard.status(1)
                && gameBoard.status(1) == gameBoard.status(2)
                && gameBoard.status(0) != ""
                && gameBoard.status(1) != ""
                && gameBoard.status(2) != "") {

                if (gameBoard.status(0) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(0) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }

            if (gameBoard.status(3) == gameBoard.status(4)
                && gameBoard.status(4) == gameBoard.status(5)
                && gameBoard.status(3) != ""
                && gameBoard.status(4) != ""
                && gameBoard.status(5) != "") {

                if (gameBoard.status(3) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(3) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }
            if (gameBoard.status(6) == gameBoard.status(7)
                && gameBoard.status(7) == gameBoard.status(8)
                && gameBoard.status(6) != ""
                && gameBoard.status(7) != ""
                && gameBoard.status(8) != "") {

                if (gameBoard.status(6) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(6) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }
            //Check if columns are the same and not empty
            if (gameBoard.status(0) == gameBoard.status(3)
                && gameBoard.status(3) == gameBoard.status(6)
                && gameBoard.status(0) != ""
                && gameBoard.status(3) != ""
                && gameBoard.status(6) != "") {

                if (gameBoard.status(0) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(0) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }

            if (gameBoard.status(1) == gameBoard.status(4)
                && gameBoard.status(4) == gameBoard.status(7)
                && gameBoard.status(1) != ""
                && gameBoard.status(4) != ""
                && gameBoard.status(7) != "") {

                if (gameBoard.status(1) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(1) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }

            if (gameBoard.status(2) == gameBoard.status(5)
                && gameBoard.status(5) == gameBoard.status(8)
                && gameBoard.status(2) != ""
                && gameBoard.status(5) != ""
                && gameBoard.status(8) != "") {

                if (gameBoard.status(2) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(2) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }
            //check diagonals

            if (gameBoard.status(0) == gameBoard.status(4)
                && gameBoard.status(4) == gameBoard.status(8)
                && gameBoard.status(0) != ""
                && gameBoard.status(4) != ""
                && gameBoard.status(8) != "") {

                if (gameBoard.status(0) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(0) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }

            if (gameBoard.status(2) == gameBoard.status(4)
                && gameBoard.status(4) == gameBoard.status(6)
                && gameBoard.status(2) != ""
                && gameBoard.status(4) != ""
                && gameBoard.status(6) != "") {

                if (gameBoard.status(2) == "X") {
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }

                if (gameBoard.status(2) == "O") {
                    playerTwo.HasWon();
                    playerTwo.IncrementWins();
                }

                displayController.updateScreen();
                return;
            }

            //check if tie
            let counter = 0;
            for (let index = 0; index < 9; index++) {

                if (gameBoard.status(index) != "") {
                    counter++;
                }

                if (counter == 9) {
                    playerTwo.HasWon();
                    playerOne.HasWon();
                    playerOne.IncrementWins();
                }
            }
            counter = 0;

            //checking if the second player set to AI
            if (playerTwo.isPlayerAI() == true && getCurrentTurn() == playerTwo.getMarker()) {
                turnController.Turn(playerTwo.AITurn());
            }
        }
    }
    const getCurrentTurn = () => currentTurn;

    return {
        getCurrentTurn,
        Turn,
        nextTurn,
        TurnAI,
    }

})();

displayController.updateScreen();