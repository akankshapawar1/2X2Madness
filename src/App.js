import './App.css';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import redrawCanvas from './boundary/Boundary';
import Model from './model/Model.js';
import { processClick }  from './controller/SelectController.js';
import { resetHandler } from './controller/ResetController';
import counterClockController from './controller/CounterClockController';
import clockController from './controller/ClockController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

function App() {

  const [model, setModel] = useState(new Model(2));
  const [redraw, forceRedraw] = useState(0);
  const appRef = useRef(null);
  const canvasRef = useRef(null);
  let grpArr
  let flag = false;

  useEffect(() => {
    redrawCanvas(model, canvasRef.current, appRef.current)
  },[model, redraw]);

  const handleClick = (e) =>{
    const canvasRect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;
    grpArr = processClick(model, canvasRef.current, x, y, forceRedraw, flag);
  };

  const resetClick = () => {
    resetHandler(model, setModel);
  };

  const callCounter = () =>{
      if(grpArr){
      counterClockController(grpArr);
      forceRedraw(redraw+1);
      model.updateMoveCount(+1);
    }
  };

  const callClock = () =>{
    if(grpArr){
      clockController(grpArr);
      forceRedraw(redraw+1);
      model.updateMoveCount(+1);
    }
  };

  function isBoardCleared(squares) {
    flag = squares.every(square => square.color === 'white'); 
    return flag;
  };

  return (
    <main className="Appmain" ref={appRef}>
      <div className="box1">
        <div className="canvas">
          <canvas tabIndex="1"
            className="App-canvas"
            data-testid="canvas"
            ref={canvasRef}
            width={700}
            height={700}
            onClick={handleClick}
          />
        </div>
      </div>
      <div className="box2">
          <button className="rotate" data-testid="button_clock" onClick={callClock}><FontAwesomeIcon icon={faArrowRotateRight} /></button>
          <button className="rotate" data-testid="button_counter" onClick={callCounter}><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
      </div>
      <div className="box1">
        <label className="textfield">{"Moves: " + model.numMoves}</label>
        <button className="button" data-testid="button_reset" onClick={resetClick}>Reset</button>
        <button className="button" data-testid="button_4" onClick={() => setModel(new Model(0))}>4X4</button>
        <button className="button" data-testid="button_5" onClick={() => setModel(new Model(1))}>5X5</button>
        <button className="button" data-testid="button_6" onClick={() => setModel(new Model(2))}>6X6</button>
        {isBoardCleared(model.board.squares) && <div style={{ color: 'red', fontSize: '24px' }}>Congratulations! You've cleared the board!</div>}
      </div>
    </main>
  );
}

export default App;