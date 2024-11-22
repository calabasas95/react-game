import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState([]); // Points will be generated after Play button is clicked
  const [cleared, setCleared] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [numPoints, setNumPoints] = useState(5); // Number of points to be generated
  const timerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Timer to track time during gameplay
    if (points.length > 0 && !cleared && !gameOver) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [points, cleared, gameOver]);

  useEffect(() => {
    // Check if all points are cleared
    if (points.length > 0 && currentIndex === points.length) {
      setCleared(true);
    }
  }, [currentIndex, points]);

  const handlePlayClick = () => {
    setPoints(generatePoints(numPoints)); // Generate points based on user input
    setCleared(false);
    setGameOver(false);
    setTime(0);
    setCurrentIndex(0);
  };

  const handlePointClick = (point, index) => {
    if (index === currentIndex) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleAutoPlayClick = () => {
    setAutoPlay((prevAutoPlay) => !prevAutoPlay);
  };

  useEffect(() => {
    if (autoPlay && !cleared && !gameOver) {
      if (currentIndex < points.length) {
        const autoClickTimer = setTimeout(() => {
          handlePointClick(points[currentIndex], currentIndex);
        }, 1500); // Increased delay for auto play to give users time to stop
        return () => clearTimeout(autoClickTimer);
      }
    }
  }, [autoPlay, currentIndex, points, cleared, gameOver]);

  const generatePoints = (num) => {
    // Generate an array of points with random positions
    return Array.from({ length: num }, (_, i) => ({
      id: i + 1,
      x: Math.random() * 80 + 10, // Random x position between 10% and 90%
      y: Math.random() * 80 + 10, // Random y position between 10% and 90%
    }));
  };

  return (
    <div className="game-container">
      <h1>{cleared ? "ALL CLEARED" : gameOver ? "GAME OVER" : "LET'S PLAY"}</h1>
      <div className="controls">
        <input
          type="number"
          min="1"
          value={numPoints}
          onChange={(e) => setNumPoints(Number(e.target.value))}
        />
        <button onClick={handlePlayClick}>{points.length > 0 ? "Restart" : "Play"}</button>
        {points.length > 0 && (
          <button onClick={handleAutoPlayClick}>
            {autoPlay ? "Auto Play OFF" : "Auto Play ON"}
          </button>
        )}
      </div>
      <div className="info">
        <div>Points: {points.length}</div>
        <div>Time: {time.toFixed(1)}s</div>
      </div>
      <div className="game-area">
        {points.map((point, index) => (
          <div
            key={point.id}
            className={`point ${index < currentIndex ? 'cleared' : ''}`}
            style={{ top: `${point.y}%`, left: `${point.x}%` }}
            onClick={() => handlePointClick(point, index)}
          >
            {point.id}
            {index < currentIndex && <span className="time-display">{time.toFixed(1)}s</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

// App.css
// .game-container {
//   text-align: center;
//   margin-top: 20px;
// }
// .controls {
//   margin-bottom: 10px;
// }
// .info {
//   margin-bottom: 20px;
// }
// .game-area {
//   position: relative;
//   width: 400px;
//   height: 400px;
//   margin: 0 auto;
//   border: 2px solid black;
// }
// .point {
//   position: absolute;
//   width: 40px;
//   height: 40px;
//   background-color: lightblue;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 50%;
//   cursor: pointer;
//   transition: background-color 0.3s, opacity 0.3s;
// }
// .point.cleared {
//   background-color: lightcoral;
//   opacity: 0.5;
// }
// .time-display {
//   position: absolute;
//   top: -20px;
//   font-size: 12px;
//   color: black;
// }
// h1 {
//   font-size: 24px;
//   color: black;
// }
