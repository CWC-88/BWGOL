
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";







const CELL = 20;
const WIDTH = 500
const HEIGHT = 500

class Cell extends React.Component {

  constructor() {
    super();
    this.state = { color: "Cell" };
    this.changeColor = this.changeColor.bind(this);
  }
  changeColor() {
    let newColor = this.state.color === "Cell" ? "red" : "red";
    this.setState({
      color: newColor
    });
  }

  render() {

    const { x, y } = this.props;
    return (
      <div>
        
      <div
        className="Cell"
        style={{
          left: `${CELL * x + 1}px`,
          top: `${CELL * y + 1}px`,
          width: `${CELL - 1}px`,
          height: `${CELL - 1}px`,

        }}
      ></div>
      
      </div>

      
    );
  }
}

class Cycle extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL;
    this.cols = WIDTH / CELL;

    this.board = this.EmptyBoard();
  }


  state = {
    cells: [],
    isRunning: false,
    interval: 100,
    generation: 0
  };


  
  EmptyBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }

    return board;
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    };
  }

  makeCells() {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL);
    const y = Math.floor(offsetY / CELL);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells(), generation: 0 });
  };

  run= () => {
    this.setState({ isRunning: true });
    this.runIteration();
  };

  stop = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  runIteration() {
    let newBoard = this.EmptyBoard();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculate(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!this.board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
      this.setState({
        generation: this.state.generation + 1
      });
    }

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);
  }


  calculate(board, x, y) {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1]
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (
        x1 >= 0 &&
        x1 < this.cols &&
        y1 >= 0 &&
        y1 < this.rows &&
        board[y1][x1]
      ) {
        neighbors++;
      }
    }

    return neighbors;
  }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  };



  clear = () => {
    this.board = this.EmptyBoard();
    this.setState({ cells: this.makeCells() });
    this.setState({
      generation: 0
    });
  };

  randomize = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = Math.random() >= 0.5;
      }
    }

    this.setState({ cells: this.makeCells() });
  };


  OceanWaves = () => {

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
 

        this.board[y][x] = (([x]*[y])/[x])

        
      
      }
    }

    this.setState({ cells: this.makeCells() });
  };
  


  render() {
    const { cells, interval, isRunning, generation } = this.state;

    return (
      <div>
        <div>{`Generation: ${generation}`}</div>
        <div
          className="Board"
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundSize: `${CELL}px ${CELL}px`
          }}
          onClick={this.handleClick}
          ref={(n) => {
            this.boardRef = n;
          }}
        >
          {cells.map((cell) => (
            <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
          ))}
        </div>

        <div className="controls">
          Update every{" "}
          <input
            value={this.state.interval}
            onChange={this.handleIntervalChange}
          />{" "}
          msec
          {isRunning ? (
            <button className="button" onClick={this.stop}>
              Stop
            </button>
          ) : (
            <button className="button" onClick={this.run}>
              Run
            </button>
          )}
          <button className="button" onClick={this.randomize}>
            Random
          </button>
          <button className="button" onClick={this.clear}>
            Clear
          </button>
          <button type='button' onClick={this.OceanWaves}>OceanWaves</button>
      
          <div className={this.state.color}>
        
        <button onClick={this.changeColor}>change color</button>
      </div>

          <div>

            Rules of the game
             <li>Living cells with fewer than two living neighbours will dies of lonliness</li>

             <li>Living cells with two or three living neighbours advances advances a generation</li>

             <li>Living cells with more than three live neighbours dies of crowding</li>

             <li>A dead cell with exactly three live neighbours becomes a living cell</li>
          </div>
         


    
          

       
       

        </div>
      </div>
    );
  }
}

export default Cycle;
ReactDOM.render(<Cycle />, document.getElementById("root"));
