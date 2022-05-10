import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Home(props) {
  return <div className="circle-red"></div>;
}

function Away(props) {
  return <div className="circle-black"></div>;
}

const checkers1 = [Home(), "", Home(), "", Home(), "", Home(), ""];
const checkers2 = ["", Home(), "", Home(), "", Home(), "", Home()];
const checkers3 = [Away(), "", Away(), "", Away(), "", Away(), ""];
const checkers4 = ["", Away(), "", Away(), "", Away(), "", Away()];
const arr = new Array(64);

for (let i = 0; i < 16; i++) {
  if (i < 8) {
    arr[i] = checkers1[i];
  } else if (7 < i < 16) {
    arr[i] = checkers2[i - 8];
  }
}
for (let i = 48; i < 56; i++) {
  if (47 < i < 56) {
    arr[i] = checkers3[i - 48];
  }
}
for (let i = 56; i < 64; i++) {
  arr[i] = checkers4[i - 56];
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: arr,
      homeisNext: true,
      chosen: true,
      jumping: false,
      xvalues: [],
      gameWon: [false],
    };
  }

  handleClick(i) {
    // Initializations and global variable creation
    // Must be set up to handle two separate clicks, one to choose piece, and one to move it to open spot and must work in correct order
    // HomeisNext must only change after second click
    // Using squares/home variable as a shorthand
    const squares = this.state.squares.slice();
    const home = this.state.homeisNext;
    let jumping = this.state.jumping;
    let xvalues = this.state.xvalues; 
    
    // Creating new piece in new square and deleting piece in old square (to move it)
    // Checking who's turn it is and imposing restrictions on movement
    // Checking for edge cases
    function leftedgepiece(value) {
      if (value % 8 === 0) {
        return true;
      }
    }

    function rightedgepiece(value) {
      if ((value - 7) % 8 === 0) {
        return true;
      }
    }

    // Completed variable lets us know when a full turn has been completed (if it is true)
    // Jumping turns true if strict conditions are met on jumping criterion
    let completed = false;
    let color;
    color = home ? Home().props.className : Away().props.className;
    // First Click only allowed on object
    if (
      typeof squares[i] === "object" &&
      squares[i].props.className === color
    ) {
      // Now completed/this.jumping are false once more and xvalues has to be emptied
      completed = false;
      // Have to save clicked square in state variable of chosen
      this.chosen = i;

      // Need to determine if there is a piece to the diagonal of the position (works for anything that is not a right or left edgepiece)
      // For loop checks entire board each time first click is made to determine pieces on the corners belonging to opposite color
      // X represents the board location of the pieces that are of opposite color and diagonal and will be stored in an array as there may be 0, 1, or 2
      for (let x = 0; x < 64; x++) {
        // Restricts to inhabited spaces and opposite colors
        if (
          typeof squares[x] === "object" &&
          squares[x].props.className !== squares[this.chosen].props.className &&
          !rightedgepiece(x) &&
          !leftedgepiece(x)
        ) {
          // Restricts to anything that is directly nearby. Must code separately for right and left edge pieces
          if (rightedgepiece(this.chosen)) {
            if (Math.abs(this.chosen - 1 - x) === 8) {
              jumping = true;
              xvalues.push(x);
            }
          }
          if (leftedgepiece(this.chosen)) {
            if (Math.abs(this.chosen + 1 - x) === 8) {
              jumping = true;
              xvalues.push(x);
            }
          } else {
            if (
              Math.abs(this.chosen + 1 - x) === 8 ||
              Math.abs(this.chosen - 1 - x) === 8
            ) {
              jumping = true;
              xvalues.push(x);
            }
          }
        }
      }
    }

    // Move function for refactoring use
    function move(value1, value2) {
      squares[value1] = home ? Home() : Away();
      squares[value2] = "";
      
      // From conditions for jumping, we need to remove the squares entry that is being captured
      if (
        (jumping && Math.abs(value1 - value2) !== 7) ||
        (jumping && Math.abs(value1 - value2) !== 9)
      ) {
        for (let x = 0; x < xvalues.length; x++) {
          if (home) {
            if (value1 - (value1 - value2) / 2 === xvalues[x]) {
              squares[xvalues[x]] = "";
            }
          } else {
            if (value2 - (value2 - value1) / 2 === xvalues[x]) {
              squares[xvalues[x]] = "";
            }
          }
        }
      }
      // Reset the i and completed variables after a full turn has been completed
      completed = true;
      xvalues = [];
      jumping = false;
    }

    // Second Click: checking if square is uninhabited and is in an allowed location
    if (typeof squares[i] != "object") {
      // Restricts to only allowing after chosen has been set, ie only after the first click has been made
      // Chosen is also needed to save state value to then check if it can be moved to new location
      if (typeof this.chosen === "number") {
        let condition1 = this.chosen + 7;
        let condition2 = this.chosen + 9;
        let condition3 = this.chosen - 7;
        let condition4 = this.chosen - 9;
        let condition5 = this.chosen + 14;
        let condition6 = this.chosen + 18;
        let condition7 = this.chosen - 14;
        let condition8 = this.chosen - 18;
        if (!jumping) {
          condition5 = condition1;
          condition6 = condition2;
          condition7 = condition3;
          condition8 = condition4;
        }
        
        // Separating each case into rightedge, leftedge, or other based on home and away and imposing move restrictions 
        if (home) {
            if (rightedgepiece(this.chosen)) {
              if (i === condition1 || i === condition5) {
                move(i, this.chosen);
              }
            } else if (leftedgepiece(this.chosen)) {
              if (i === condition2 || i === condition6) {
                move(i, this.chosen);
              }
            } else {
              if (
                i === condition1 ||
                i === condition2 ||
                i === condition5 ||
                i === condition6
              ) {
                move(i, this.chosen);
              }
            }
          } else {
            if (rightedgepiece(this.chosen)) {
              if (i === condition4 || i === condition8) {
                move(i, this.chosen);
              }
            } else if (leftedgepiece(this.chosen)) {
              if (i === condition3 || i === condition7) {
                move(i, this.chosen);
              }
            } else {
              if (
                i === condition3 ||
                i === condition4 ||
                i === condition7 ||
                i === condition8
              ) {
                move(i, this.chosen);
              }
            }
          }  

        // Helper function to check if the game has been won
        function calculateWinner (chosen, homeTeam) {
          let gameOver = false;
          console.log(chosen, homeTeam);
          if (0 < chosen < 9 && homeTeam === false) {
            gameOver = true;
          }
          else if (55 < chosen < 64 && homeTeam === true) {
            gameOver = true;
          } 
          return gameOver;
        }   
        
        // Check if the game has been won after the second click and by whom and prevent clicks if it has been won
        console.log(calculateWinner(i, home));
        
        if (calculateWinner(i, home)) {
          this.state.gameWon[0] = true;
          if (home) {
            this.state.gameWon.push("Red");
          }
          else {
            this.state.gameWon.push("Black")
          }
          window.removeEventListener('.square', this.handleClick)
          return;
        }

        // Chosen needs to be reset to true from some integer value as new turn is beginning
        this.state.homeisNext = completed
          ? !this.state.homeisNext
          : this.state.homeisNext;
      }
    }

    // Describes modifications to state that are run after EVERY CLICK (important for homeisNext variable specifically)
    this.setState({
      squares: squares,
      jumping: jumping,
      xvalues: xvalues,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    // Displays status of variable after round of play (switch or no-switch depending) or if the game has been won
    let status = "Next player: " + (this.state.homeisNext ? "Red" : "Black");
    status = this.state.gameWon[0] ? ("Winner: " + this.state.gameWon[1]) : status; 
    const position = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 8))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 16))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 24))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 32))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 40))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 48))}
        </div>
        <div className="board-row">
          {position.map((x) => this.renderSquare(x + 56))}
        </div>
      </div>
    );
  }
}

class Instructions extends React.Component {
  render() {
    return (
      <div className="instructions">
        This is a variant of the game of checkers.<br/> In this version, there are still two sides,<br/> but the aim of one side is to cross to the other side.<br/> The team that is first to send one of their pieces to the other end wins. <br/> Red goes first.<br/>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: arr,
        },
      ],
    };
  }
  render() {
    return (
      <div className="game">
        <div className="instructions">
          <Instructions />
        </div>
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

