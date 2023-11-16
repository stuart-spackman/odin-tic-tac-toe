const gameboard = (() => {
    const b = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    const addX = (x, y) => {
        if (b[x][y] === '') {
            b[x][y] = 'X';
            return true
        } else {
            return false
        }
    };
    const addO = (x, y) => {
        if (b[x][y] === '') {
            b[x][y] = 'O';
            return true
        } else {
            return false
        }
    };
    const isFilled = () => {
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (b[i][j] === '') {
                    return false
                }
            }
        }
        return true
    };
    const getStatus = () => {
        // first rows
        if (b[0][0] === b[0][1] && b[0][1] === b[0][2] && b[0][2] != '') {
            return ['00', '01', '02', b[0][2]]
        } else if (b[1][0] === b[1][1] && b[1][1] === b[1][2] && b[1][2] != '') {
            return ['10', '11', '12', b[1][2]]
        } else if (b[2][0] === b[2][1] && b[2][1] === b[2][2] && b[2][2] != '') {
            return ['20', '21', '22', b[2][2]]
        }
        // then columns
        else if (b[0][0] === b[1][0] && b[1][0] === b[2][0] && b[2][0] != '') {
            return ['00', '10', '20', b[2][0]]
        } else if (b[0][1] === b[1][1] && b[1][1] === b[2][1] && b[2][1] != '') {
            return ['01', '11', '21', b[2][1]]
        } else if (b[0][2] === b[1][2] && b[1][2] === b[2][2] && b[2][2] != '') {
            return ['02', '12', '22', b[2][2]]
        }
        // then diagonals
        else if (b[0][0] === b[1][1] && b[1][1] === b[2][2] && b[2][2] != '') {
            return ['00', '11', '22', b[2][2]]
        } else if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && b[2][0] != '') {
            return ['02', '11', '20', b[2][0]]
        }
        // then return false for having an incomplete game
        else {
            if (gameboard.isFilled() === true) {
                return true
            } else {
                return false
            }
        }
    };
    const addEventListeners = () => {
        const squares = document.querySelectorAll('.square');
        for (const square of squares) {
            square.addEventListener('click', () => {

                square.innerText = gameFlow.currentPlayer;
                const xCoord = square.classList[0].substring(1, 2)
                const yCoord = square.classList[0].substring(2, 3)
                if (gameFlow.currentPlayer === 'X') {
                    gameboard.addX(xCoord, yCoord)
                } else if (gameFlow.currentPlayer === 'O') {
                    gameboard.addO(xCoord, yCoord)
                }
                if (gameboard.getStatus() === false) {
                    gameFlow.advanceTurn();
                } else {
                    gameFlow.checkCompletion();
                }
            }, { once: true })
        }
    };
    return {
        b,
        addX,
        addO,
        getStatus,
        isFilled,
        addEventListeners
    };
})();

const gameFlow = (() => {
    const first = Math.floor(Math.random() * 2) + 1;
    let currentPlayer = 'O';
    if (first === 1) {
    } else if (first === 2) {
        currentPlayer = 'X';
    }
    const display = document.querySelector('h2');
    gameboard.addEventListeners();
    display.innerText = `player-${currentPlayer}, it is your turn. Click a box.`;


    function advanceTurn() {
        if (gameFlow.currentPlayer === 'X') {
            gameFlow.currentPlayer = 'O'
        } else {
            gameFlow.currentPlayer = 'X'
        }
        gameFlow.display.innerText = `player-${gameFlow.currentPlayer}, it is your turn. Click a box.`;
    }

    function checkCompletion() {
        if (gameboard.getStatus) {
            if (gameboard.getStatus() === true) {
                gameFlow.changeAllToRed();
                gameFlow.removeEventListeners();
                gameFlow.display.innerText = `There isn't a winner this time. Refresh the page to start a new game.`;
            } else {
                gameFlow.informWinner(gameboard.getStatus());

            }
        }
    }

    function changeAllToRed() {
        const squares = document.querySelectorAll('.square');
        for (const square of squares) {
            square.id = 'loser';
        }

    }
    function informWinner(array) {
        const winner = array[3];
        const squares = document.querySelectorAll('.square');
        for (const square of squares) {
            const coord = square.classList[0].substring(1, 4);
            if (array.includes(coord)) {
                square.id = 'winner';
            } else {
                square.id = 'loser';
            }
        }
        gameFlow.display.innerText = `player-${gameFlow.currentPlayer} wins! Refresh the page to start a new game.`;
        gameFlow.removeEventListeners();

    }

    function removeEventListeners() {
        const squares = document.querySelectorAll('.square');
        for (const oldSquare of squares) {
            const newSquare = oldSquare.cloneNode(true);
            oldSquare.parentElement.replaceChild(newSquare, oldSquare);
        }
    }

    return {
        currentPlayer,
        advanceTurn,
        display,
        checkCompletion,
        changeAllToRed,
        informWinner,
        removeEventListeners
    }
})();