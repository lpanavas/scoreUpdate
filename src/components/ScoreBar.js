import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/ScoreBar.css";

const ScoreBar = ({ score }) => {
  const [previousScore, setPreviousScore] = useState(score);
  const [scoreChange, setScoreChange] = useState(0);
  const [displayChange, setDisplayChange] = useState(false);

  useEffect(() => {
    setScoreChange(score - previousScore);
    setPreviousScore(score);
    setDisplayChange(true);
    const timeout = setTimeout(() => setDisplayChange(false), 1000); // hide score change after 1 second
    return () => clearTimeout(timeout);
  }, [score]);

  const barProps = useSpring({
    backgroundColor: displayChange ? "#88E4E4" : "#ccc",
    config: { tension: 210, friction: 20 },
  });

  const scoreChangeProps = useSpring({
    opacity: displayChange ? 1 : 0,
    transform: displayChange ? "translateY(0)" : "translateY(-20px)",
    config: { tension: 210, friction: 20 },
  });

  return (
    <a.div style={barProps} className="score-bar">
      <span>Score: {score}</span>
      {displayChange && (
        <a.div style={scoreChangeProps} className="score-change">
          {scoreChange > 0 ? "+" : ""}
          {scoreChange}
        </a.div>
      )}
    </a.div>
  );
};

export default ScoreBar;
