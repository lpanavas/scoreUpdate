import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import newStructure from "./data/newStructure.json";
import "./components/styles/App.css";

function App() {
  const [showGame, setShowGame] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentKey, setCurrentKey] = useState(newStructure.order[0]);

  useEffect(() => {
    if (currentPosition < newStructure.order.length) {
      setCurrentKey(newStructure.order[currentPosition]);
    } else {
      setCurrentKey(null);
    }
  }, [currentPosition]);

  const isCurrentPositionGame = Object.keys(newStructure.games).includes(
    currentKey
  );

  const finishGame = (chosenOptionIndex, chosenDescriptors) => {
    if (isCurrentPositionGame) {
      setCurrentPosition((prevPosition) => prevPosition + 1);
    }
  };
  console.log(currentKey);
  const currentPath = currentKey ? newStructure.games[currentKey] : null;
  const currentPrompt = currentPath ? currentPath.prompt : null;
  const handleStartGame = () => {
    console.log("current Path: ", currentPath);
    setCurrentPosition(0);
    setShowGame(true);
  };

  return (
    <div className="app">
      {showGame && currentPath ? (
        <GamePage
          gamePath={currentPath}
          finishGame={finishGame}
          prompt={currentPrompt}
        />
      ) : (
        <LandingPage onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;
