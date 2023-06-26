import React, { useEffect, useState } from "react";
import PairwiseGame from "../components/PairwiseGame";
import "../components/styles/GamePage.css";

function GamePage({ gamePath, prompt, finishGame }) {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTechnologies(gamePath.technologies);
    setLoading(false);
  }, [gamePath]);

  if (loading) {
    return <div className="game-page">Loading...</div>;
  }

  return (
    <div className="game-page">
      <div className="game-content">
        <PairwiseGame technologies={technologies} finishGame={finishGame} />
      </div>
      {/* <button className="finish-button" onClick={finishGame}>
        Finish Game
      </button> */}
    </div>
  );
}

export default GamePage;
