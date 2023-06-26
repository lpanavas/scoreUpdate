import React from "react";
import Button from "./Button";
import "./styles/Rankings.css";

const Rankings = ({ rankings, finishGame }) => {
  let qScores = {};

  for (let tech in rankings) {
    let w = rankings[tech].wins;
    let l = rankings[tech].losses;
    let t = rankings[tech].ties;
    let total = w + l + t;

    // If the technology hasn't been compared with any other, assign Q-score as 0
    if (total === 0) {
      qScores[tech] = 0;
      continue;
    }

    let W = w / total;
    let L = l / total;

    // Calculate opponent Q-scores
    let opponentW = 0;
    let opponentL = 0;
    let opponentCount = 0;

    for (let opponent in rankings[tech].opponents) {
      let oppStats = rankings[opponent];
      let oppTotal = oppStats.wins + oppStats.losses + oppStats.ties;

      if (oppTotal !== 0) {
        let relationship = rankings[tech].opponents[opponent];

        if (relationship > 0) {
          // current tech has won against opponent
          opponentW += oppStats.wins / oppTotal;
        } else if (relationship < 0) {
          // current tech has lost against opponent
          opponentL += oppStats.losses / oppTotal;
        }

        opponentCount++;
      }
    }

    // If the technology has opponents, average the Q-scores
    if (opponentCount !== 0) {
      opponentW /= opponentCount;
      opponentL /= opponentCount;
    }

    // Calculate Q-score
    let qScore = (10 / 3) * (W + opponentW - L - opponentL + 1);

    qScores[tech] = qScore;
  }

  const sortedRankings = Object.keys(qScores).sort(
    (a, b) => qScores[b] - qScores[a]
  );

  return (
    <div className="rankings">
      <h1>Ranking</h1>
      <h4>Most Acceptable</h4>
      <ol>
        {sortedRankings.map((tech, idx) => (
          <li key={idx}>{tech}</li>
        ))}
      </ol>
      <h4>Least Acceptable</h4>
      <Button text="Finish Game" onClick={finishGame} />
    </div>
  );
};

export default Rankings;
