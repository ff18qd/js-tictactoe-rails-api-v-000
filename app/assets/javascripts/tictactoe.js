// Code your JavaScript / jQuery solution here
// https://github.com/Booligan/ttt-with-ai-project-v-000/blob/master/lib/game.rb
var turn = 0;
var  winCombinations = [
                          [0,1,2],
                          [3,4,5],
                          [6,7,8],
                          [0,3,6],
                          [1,4,7],
                          [2,5,8],
                          [0,4,8],
                          [2,4,6]
                        ]

var currentGame;
var lastId = 0;
function player() {
    return turn%2 === 0 ? 'X':'O';
}

function taken(tdElement) {
    if ($(tdElement).innerHTML === "") {
        return false;
    } else {
        return true;
    }
}

function updateState(tdElement) {
    let token = player();
    if (tdElement.innerHTML === "") {
        $(tdElement).html(token);
    }
    else {alert ("Invalid play");
        turn = turn -1;
    }
}

function setMessage(message) {
    $('div#message').html(message) ;
}

function checkWinner() {
    let currentBoard = [];
    const squares = window.document.querySelectorAll('td');
    squares.forEach(x => currentBoard.push(x.innerHTML));

    for (let i=0; i < winCombinations.length; i++) {
        let win_index_1 = winCombinations[i][0]
        let win_index_2 = winCombinations[i][1]
        let win_index_3 = winCombinations[i][2]

        let position_1 = currentBoard[win_index_1]
        let position_2 = currentBoard[win_index_2]
        let position_3 = currentBoard[win_index_3]

        if (position_1 === "X" && position_2 === "X" && position_3 === "X" || position_1 === "O" && position_2 === "O" && position_3 === "O") {
            setMessage('Player ' + position_1 +  ' Won!');
            // $("tbody td").off("click");
            return true;
        }
    }
    
    return false;
    
}

function getCurrentBoard() {
    let currentBoard = [];
    const squares = window.document.querySelectorAll('td');
    squares.forEach(x => currentBoard.push(x.innerHTML));
    return currentBoard;
}

function resetBoard() {
    const squares = window.document.querySelectorAll('td');
    squares.forEach(x => x.innerHTML='');
    turn = 0;
}

function saveGame() {
    // ajax patch
    var method;
    var url;
    if (currentGame) {
        method = "PATCH";
        url = `/games/${currentGame}`;
    } else {
        method = "POST";
        url = '/games';
    }
    
    $.ajax({
        url: url,
        method: method,
        dataType: "json",
        data: {
            state: getCurrentBoard()
        },
        success: function(result){
            // console.log(result)
            currentGame = result.data.id
        }
    })
}

function doTurn(element) {

    updateState(element);
    
    turn = turn + 1;
        
    if (checkWinner()) {
        // $("tbody td").off("click");
        saveGame();
        resetBoard();
        // debugger;
    } else if (turn === 9 ) {
        setMessage("Tie game.");
        saveGame();
        resetBoard()
    }
    
}

function attachListeners() {
    $("tbody td").click(function() {
        doTurn(this)});
        
    $("button#save").click(function() {
        saveGame();
    });
    
    $("button#previous").click(function() {
        $.get('/games', function(response) {
            console.log(response.data);
            if (response.data) {
                // add each previous game as a button child of div#games
                // lastId = $("div#games button").last().val()
                response.data.forEach(function(element) {
                    // debugger
                    if (element.id > lastId) {
                        $("div#games").append(`<button id="gameid-${element.id}" value="${element.id}">${element.id}</button><br>`)
                        lastId = element.id
                    }
                })
            }
        });
        // $.get('/games').each($("div#game").add('button'))
    });
}


$(document).ready(function() {attachListeners()})

