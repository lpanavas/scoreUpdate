import React, { useEffect, useState } from "react";
import PairwiseGame from "../components/PairwiseGame";
import axios from "axios"; // Don't forget to import axios
import "../components/styles/GamePage.css";

function GamePage({
  gameCards,
  finishGame,
  skipDemographics,
  demographics,
  setDemographics,
  setOutputData,
  userID,
}) {
  const [technologies, setTechnologies] = useState([]);
  const [pairwiseData, setPairwiseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTechnologies(gameCards);

    // Convert gameCards to an array of card IDs
    const cardIds = gameCards.map((card) => card.ID);

    // Send request to server
    axios
      .post("/data/pairwise", { cards: cardIds })
      .then((response) => {
        setPairwiseData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [gameCards]);

  if (loading) {
    return <div className="game-page">Loading...</div>;
  }
  console.log("pairise data", pairwiseData);
  return (
    <div className="game-page">
      <div className="game-content">
        <PairwiseGame
          technologies={technologies}
          pairwiseData={pairwiseData}
          finishGame={finishGame}
          skipDemographics={skipDemographics}
          demographics={demographics}
          setDemographics={setDemographics}
          setOutputData={setOutputData}
          userID={userID}
        />
      </div>
    </div>
  );
}

export default GamePage;
