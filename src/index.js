import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classList = props.value === null ? "square free":"square"
  return (
    <button 
      className={ classList } 
      onClick={props.onClick}
    >
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />;
  }

  render() {
    let rows = []
    for(var row=0; row<3; row++) {
      let cols = []
      for(var col=0; col<3; col++) {
        cols.push(this.renderSquare(row*3+col))
      }
      rows.push(
        <div key={row} className="board-row">
          {cols}
        </div>
      )
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        changedSquare: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingHistory: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        changedSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  toggleSort() {
    this.setState({
      ascendingHistory: !this.state.ascendingHistory
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + Math.floor((step.changedSquare)/3 + 1) + ', ' + (step.changedSquare % 3 + 1) + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            style={{fontWeight: move === this.state.stepNumber ? "bold" : "normal"}} 
            onClick={() => this.jumpTo(move)}
          >{desc}</button>
        </li>
      );
    });
    if (!this.state.ascendingHistory) {
        moves.reverse()
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.toggleSort()}>Sort {this.state.ascendingHistory ? "descending" : "ascending"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
