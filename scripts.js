const gameBoard = (() => {
    let gameBoard = ["", "", "", "", "", "", "", "", ""]
    const status = (i) => gameBoard[i];
    const changeStatus = (i, status) => {
        gameBoard[i] = status
    };

    return {
        status,
        changeStatus,
    };
})();

const player = (marker) => {

    const getMarker = () => marker;

    return { getMarker };
};

const playerOne = player('X');
const playerTwo = player('O');

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

    const Turn = (index) => {
        if (gameBoard.status(index) == "") {
            gameBoard.changeStatus(index, getCurrentTurn());
            nextTurn();
            displayController.updateScreen();
        }
    }

    const getCurrentTurn = () => currentTurn;

    return {
        getCurrentTurn,
        Turn,
        nextTurn
    }

})();

displayController.updateScreen();