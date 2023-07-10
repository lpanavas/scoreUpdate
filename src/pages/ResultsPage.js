import React, { useEffect, useState } from "react";
import axios from "axios";

const ResultsPage = ({ onRestartGame, outputData, selectedCards }) => {
  const [rankings, setRankings] = useState(null);
  const [userRankings, setUserRankings] = useState(null);
  const [publicRankings, setPublicRankings] = useState(null);

  useEffect(() => {
    console.log("outputData changed:", outputData);
  }, [outputData]);

  useEffect(() => {
    let rankings = {};
    let ratings = {};
    const K = 40;
    const cards = selectedCards.map((card) => card.ID);
    // Initialize rankings object and ratings with player's cards
    cards.forEach((card) => {
      rankings[card] = { wins: 0, losses: 0, ties: 0, opponents: {} };
      ratings[card] = 1800; // default rating
    });

    const matchups = outputData.CardMatchups;

    // Iterate through all the matchups
    matchups.forEach((matchup) => {
      // Initialize the opponents
      if (rankings[matchup.Card1] && rankings[matchup.Card2]) {
        if (!rankings[matchup.Card1].opponents[matchup.Card2]) {
          rankings[matchup.Card1].opponents[matchup.Card2] = {
            wins: 0,
            losses: 0,
            ties: 0,
          };
        }

        if (!rankings[matchup.Card2].opponents[matchup.Card1]) {
          rankings[matchup.Card2].opponents[matchup.Card1] = {
            wins: 0,
            losses: 0,
            ties: 0,
          };
        }

        if (matchup.Answer === "Skip") {
          // It's a tie
          rankings[matchup.Card1].ties += 1;
          rankings[matchup.Card2].ties += 1;
          rankings[matchup.Card1].opponents[matchup.Card2].ties += 1;
          rankings[matchup.Card2].opponents[matchup.Card1].ties += 1;
        } else {
          // There is a winner
          const winner = matchup.Answer;
          const loser =
            winner === matchup.Card1 ? matchup.Card2 : matchup.Card1;

          rankings[winner].wins += 1;
          rankings[loser].losses += 1;

          rankings[winner].opponents[loser].losses += 1;
          rankings[loser].opponents[winner].wins += 1;
        }
      }
    });

    // Calculate ratings using the relative logistic method
    const numPlayers = cards.length;

    for (let i = 0; i < numPlayers; i++) {
      const playerA = cards[i];

      for (let j = 0; j < numPlayers; j++) {
        if (i !== j) {
          const playerB = cards[j];

          if (rankings[playerA].opponents[playerB]) {
            const totalGamesAgainstOpponent =
              rankings[playerA].opponents[playerB].wins +
              rankings[playerA].opponents[playerB].losses +
              rankings[playerA].opponents[playerB].ties;

            const winRatio =
              rankings[playerA].opponents[playerB].wins /
              totalGamesAgainstOpponent;
            const lossRatio =
              rankings[playerA].opponents[playerB].losses /
              totalGamesAgainstOpponent;

            const ratingDifference = ratings[playerB] - ratings[playerA];
            const expectedScore = pnorm(ratingDifference, 0, 2000 / 7, 1);
            const actualScore =
              winRatio +
              (0.5 * rankings[playerA].opponents[playerB].ties) /
                totalGamesAgainstOpponent;

            const delta = K * (actualScore - expectedScore);
            ratings[playerA] += delta;
          }
        }
      }
    }
    console.log(ratings);
    const sortedUserRankings = Object.entries(ratings).sort(
      (a, b) => b[1] - a[1]
    );

    setUserRankings(sortedUserRankings);
  }, [outputData]);

  function pnorm(x, mean, sd, upperTail) {
    const q = (x - mean) / sd;
    return upperTail
      ? (1 - Math.atan(q) / Math.PI) * 0.5
      : Math.atan(q) / Math.PI + 0.5;
  }

  useEffect(() => {
    // Convert selected cards to an array of card IDs
    const cardIds = selectedCards.map((card) => card.ID);

    // Define the demographics
    const demographics = { Race: "White" };

    // Send request to server
    axios
      .post("/data/rankings", { cards: cardIds, demographics: demographics })
      .then((response) => {
        const sortedPublicRankings = Object.entries(response.data.ratings).sort(
          (a, b) => b[1] - a[1]
        );
        setRankings(sortedPublicRankings);
        setPublicRankings(sortedPublicRankings);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectedCards]);

  return (
    <div>
      <h1>Results</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>User Rankings:</h2>
          {userRankings ? (
            <pre>
              {JSON.stringify(Object.fromEntries(userRankings), null, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div>
          <h2>Public Rankings:</h2>
          {publicRankings ? (
            <pre>
              {JSON.stringify(Object.fromEntries(publicRankings), null, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <button onClick={onRestartGame}>Restart Game</button>
    </div>
  );
};

export default ResultsPage;
