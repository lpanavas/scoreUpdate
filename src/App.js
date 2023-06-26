import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import StoryGamePage from "./pages/StoryGamePage";
// import structure from "./data/structure.json";
import newStructure from "./data/newStructure.json";
import "./components/styles/App.css";

function App() {
  const [showGame, setShowGame] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentKey, setCurrentKey] = useState(newStructure.order[0]);

  useEffect(() => {
    setCurrentKey(newStructure.order[currentPosition]);
  }, [currentPosition]);

  const isCurrentPositionGame = Object.keys(newStructure.games).includes(
    currentKey
  );
  const isCurrentPositionStory = Object.keys(newStructure.stories).includes(
    currentKey
  );

  const finishGameOrStory = (chosenOptionIndex, chosenDescriptors) => {
    if (isCurrentPositionGame || isCurrentPositionStory) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  const currentPath = isCurrentPositionStory
    ? newStructure.stories[currentKey]
    : newStructure.games[currentKey];

  console.log(currentPath);
  const handleStartGame = () => {
    setShowGame(true);
  };

  return (
    <div className="app">
      {showGame ? (
        <StoryGamePage
          storyPath={currentPath}
          finish={finishGameOrStory}
          prompt={
            isCurrentPositionGame ? newStructure.games[currentKey].prompt : null
          }
          isStory={isCurrentPositionStory}
        />
      ) : (
        <LandingPage onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;
