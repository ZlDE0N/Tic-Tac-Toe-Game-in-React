import { useState } from "react";
import confetti from "canvas-confetti";

// Componentes
import { Square } from "./components/square";
import { WinnerModal } from "./components/WinnerModal";

//constantes js
import { TURNS } from "./constans";
//logica del board js

import { checkWinnerFrom, checkEndGame } from "./logic/board";

function App() {
  /*Aqui creamos el estado para llenar cada elemento */
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  // const [board, setBoard] = useState(Array(9).fill(null))
  // --NOTA: ESTUDIAR EL LOCAL STORAGE PARA REACT, ENTENDER BIEN COMO FUNCIONA

  //Aqui creamos el estado para saber el turno si es x o 0
  const [turn, setTurn] = useState(TURNS.X);

  //Estado para saber si hemos ganado
  const [winner, setWinner] = useState(null); //No hay ganador, y el false que hay un empate

  /* Para poder reiniciar el estado del board*/
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };

  const updateBoard = (index) => {
    /*No actualizamos la posicion si ya tiene algo 
    en el board, el return sin nada es que no tiene accion*/
    if (board[index] || winner) return;

    /*Se crea un nuevo array por que asi evitamos mutar 
    las props del actual y evitarmos tocar el array original */
    const newBoard = [...board];

    newBoard[index] = turn; //Aqui ha guardado las posiciones de los turnos

    setBoard(newBoard); //-> Actualizamos el estado del board

    //Cambiamos el turno (con el ternario, si es X, entonces el siguiente turno sera 0)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;

    /*el que asigna el turno es la funcion setTurn y le asignamos 
    el valor del newTurn para que pueda cambiar cuando se le de click */
    setTurn(newTurn);

    //Guardar partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("TURN", turn);
    //Revisar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      confetti();
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className="game">
        {
          /*Estamos renderizando cada uno de los squares dentro del tablero
        para que puedan aparecer en la pantalla */
          board.map((_, index) => {
            return (
              // <div className="cell" key={index}> /unas key es el indentificador unico
              //   <span className="cell__cotent">
              //     {index}
              //   </span>
              // </div>
              <Square
                key={index}
                index={index}
                /*El updateBoard se lo pasamos como prop al componente
                    square, para cuando alguien de click en el div, pueda 
                    ejecutar handleClick, que le estamos pasando desde arriba  */
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            );
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <span className="created">By Salvador Pereira</span>

      <WinnerModal resetGame={resetGame} winner={winner}></WinnerModal>
    </main>
  );
}

export default App;
