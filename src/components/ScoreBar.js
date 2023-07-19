import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/ScoreBar.css";

const ScoreBar = ({ score, currentPairIndex }) => {
  const [previousScore, setPreviousScore] = useState(score);
  const [maxScore, setMaxScore] = useState(currentPairIndex * 10);
  const [scoreChange, setScoreChange] = useState(0);
  const [displayChange, setDisplayChange] = useState(false);

  useEffect(() => {
    const difference = score - previousScore;
    if (difference === 0) {
      return; // Don't do anything if score hasn't changed
    }

    setScoreChange(difference);
    setPreviousScore(score);
    setDisplayChange(true);
    const timeout = setTimeout(() => setDisplayChange(false), 2000);
    const maxScore = (currentPairIndex + 1) * 10;
    setMaxScore(maxScore);
    return () => clearTimeout(timeout);
  }, [score, currentPairIndex]);

  const barProps = useSpring({
    backgroundColor: displayChange ? "#26925F" : "#7758FF",
    config: { tension: 210, friction: 20 },
  });

  const scoreChangeProps = useSpring({
    opacity: displayChange ? 1 : 0,
    transform: displayChange ? "translateY(0)" : "translateY(-20px)",
    config: { tension: 210, friction: 20 },
  });

  return (
    <a.div style={barProps} className="score-bar">
      <span>Score: {score} / 50</span>
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
