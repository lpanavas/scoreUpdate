import React from "react";
import "./styles/ScoreBar.css";

const ScoreBar = ({ score }) => {
  return (
    <div className="score-bar">
      <span>Score: {score}</span>
    </div>
  );
};

export default ScoreBar;
