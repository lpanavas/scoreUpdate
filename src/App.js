import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import cards from "./data/cards.json";
import "./components/styles/App.css";
import axios from "axios";

function generateID(length = 16) {
  return Math.random().toString(36).substr(2, length);
}
function App() {
  const [userID, setUserID] = useState(generateID());

  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedCards, setSelectedCards] = useState([]);
  const [outputData, setOutputData] = useState([]);
  const [skipDemographics, setSkipDemographics] = useState(null);
  const [demographics, setDemographics] = useState(null);

  const handleStartGame = () => {
    const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
    setSelectedCards(shuffledCards.slice(0, 5));
    setCurrentPage("game");
  };

  const handleRestartGame = () => {
    const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
    setSelectedCards(shuffledCards.slice(0, 5));
    setCurrentPage("game");
  };

  const saveGameData = (userID, outputData) => {
    axios
      .post("http://localhost:5000/data/add", { userID, outputData })
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Error: " + err));
  };
  useEffect(() => {
    if (currentPage === "results") {
      saveGameData(userID, outputData);
    }
  }, [outputData, currentPage, userID]);
  const finishGame = () => {
    setSkipDemographics(true);
    setCurrentPage("results");
  };
  return (
    <div className="app">
      {currentPage === "landing" && (
        <LandingPage onStartGame={handleStartGame} />
      )}
      {currentPage === "game" && (
        <GamePage
          gameCards={selectedCards}
          finishGame={finishGame}
          setOutputData={setOutputData}
          skipDemographics={skipDemographics}
          demographics={demographics}
          setDemographics={setDemographics}
          userID={userID}
        />
      )}
      {currentPage === "results" && (
        <ResultsPage
          onRestartGame={handleRestartGame}
          outputData={outputData}
          selectedCards={selectedCards}
        />
      )}
    </div>
  );
}

export default App;
