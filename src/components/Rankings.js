import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

import "./styles/Rankings.css";
import chroma from "chroma-js";
Modal.setAppElement("#root");

const Rankings = ({ outputData, selectedCards }) => {
  const [rankings, setRankings] = useState(null);
  const [userRankings, setUserRankings] = useState(null);
  const [publicRankings, setPublicRankings] = useState(null);
  const [demographic, setDemographic] = useState({ type: "", value: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [flippedCardIds, setFlippedCardIds] = useState([]);

  useEffect(() => {
    console.log("outputData changed:", outputData);
  }, [outputData]);

  useEffect(() => {
    const cardIds = selectedCards.map((card) => card.ID);

    axios
      .post("/data/rankings", { cards: cardIds, demographics: demographic })
      .then((response) => {
        const sortedPublicRankings = Object.entries(response.data.ratings).sort(
          (a, b) => b[1] - a[1]
        );
        setRankings(sortedPublicRankings);
        setPublicRankings(sortedPublicRankings);
        console.log(sortedPublicRankings);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

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
    const demographics = {
      [demographic.type]: demographic.value,
    };

    // Check if both type and value are set
    if (demographic.type && demographic.value) {
      // Send request to server
      axios
        .post("/data/rankings", { cards: cardIds, demographics: demographics })
        .then((response) => {
          const sortedPublicRankings = Object.entries(
            response.data.ratings
          ).sort((a, b) => a[1] - b[1]);
          setRankings(sortedPublicRankings);
          setPublicRankings(sortedPublicRankings);
          console.log(sortedPublicRankings);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [selectedCards, demographic.type, demographic.value]);

  const cardIdToTitle = {};
  selectedCards.forEach((card) => {
    cardIdToTitle[card.ID] = card.title;
  });
  // Create a color scale
  const colorScale = chroma
    .scale(["#9780FF", "#ff5c97"])
    .mode("lch")
    .colors(userRankings ? userRankings.length : 0);

  const cardIdToColor = {};
  if (userRankings) {
    userRankings.forEach(([id], index) => {
      cardIdToColor[id] = colorScale[index];
    });
  }

  const openModal = (cardData) => {
    const matchingCard = selectedCards.find((card) => card.ID === cardData.id);
    console.log(outputData);
    setSelectedCardData(matchingCard);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const flipCard = (id) => {
    setFlippedCardIds((prevFlippedCardIds) => {
      if (prevFlippedCardIds.includes(id)) {
        return prevFlippedCardIds.filter((cardId) => cardId !== id);
      } else {
        return [...prevFlippedCardIds, id];
      }
    });
  };

  const findCard = (id) => {
    const matchingCard = selectedCards.find((card) => card.ID === id);
    return matchingCard;
  };

  return (
    <div className="rankings">
      <div className="rankings-header">
        <h1>Results</h1>
        <h3>
          Explore your game results and see how you compare with others. See how
          you ranked the technologies and how it matches up to others. Click any
          card in Your Rankings to find out the risk level!
        </h3>
      </div>

      <div className="middle-rankings">
        <div className="middle-rankings-single-column">
          <div className="middle-rankings-columns">
            <div className="demographic-selection">
              <label htmlFor="demographicType"></label>
              <select
                className="rankings-selection"
                id="demographicType"
                value={demographic.type}
                onChange={(e) =>
                  setDemographic({
                    ...demographic,
                    type: e.target.value,
                    value: "",
                  })
                }
              >
                <option value="">Select Demographic Type</option>

                <option value="Gender">Gender</option>
                <option value="Age">Age</option>
                <option value="Race">Race</option>
                <option value="Education">Education Level</option>
              </select>
            </div>
          </div>
          <div className="middle-rankings-columns">
            {demographic.type && (
              <div className="demographic-selection">
                <label htmlFor="demographicValue"></label>
                {demographic.type === "Gender" && (
                  <select
                    className="rankings-selection"
                    id="demographicValue"
                    value={demographic.value}
                    onChange={(e) =>
                      setDemographic({ ...demographic, value: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary/ third gender</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                )}
                {demographic.type === "Race" && (
                  <select
                    className="rankings-selection"
                    id="demographicValue"
                    value={demographic.value}
                    onChange={(e) =>
                      setDemographic({ ...demographic, value: e.target.value })
                    }
                  >
                    <option value="">Select Race</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Asian">Asian</option>
                    <option value="Hispanic">Hispanic</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Other">Other</option>
                  </select>
                )}
                {demographic.type === "Age" && (
                  <select
                    className="rankings-selection"
                    id="demographicValue"
                    value={demographic.value}
                    onChange={(e) =>
                      setDemographic({ ...demographic, value: e.target.value })
                    }
                  >
                    <option value="">Select Age</option>
                    <option value="<18">Under 18</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55-64">55-64</option>
                    <option value="65+">65+</option>
                  </select>
                )}

                {demographic.type === "Education" && (
                  <select
                    className="rankings-selection"
                    id="demographicValue"
                    value={demographic.value}
                    onChange={(e) =>
                      setDemographic({ ...demographic, value: e.target.value })
                    }
                  >
                    <option value="">Select Education Level</option>
                    <option value="High School">High School</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="top-rankings">
          <div className="top-rankings-columns">
            <h3>Your Rankings</h3>
          </div>
          <div className="top-rankings-columns">
            <h3>Public Rankings</h3>
          </div>
        </div>
      </div>
      <div className="bottom-rankings">
        <div className="rankings-columns">
          <p className="card-text">Most Acceptable</p>
          {userRankings ? (
            userRankings.map(([id, rank]) => (
              <div
                className={`card-ranking ${
                  flippedCardIds.includes(id) ? "flipped" : ""
                }`}
                key={id}
                onClick={() => flipCard(id)}
                style={{
                  borderColor: cardIdToColor[id],
                  borderWidth: ".5vw",
                  borderStyle: "solid",
                }}
              >
                {flippedCardIds.includes(id) ? (
                  <div className="card-text">
                    <p>Legislation Risk: {findCard(id).classification}</p>
                    <p>
                      Your Risk:{" "}
                      {outputData.risk[cardIdToTitle[id]] || "No choice made"}
                    </p>
                  </div>
                ) : (
                  <p className="card-text">
                    {cardIdToTitle[id].replace("AI system designed for ", "")}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}{" "}
          <p className="card-text">Least Acceptable</p>
        </div>
        <FlipMove className="rankings-columns">
          <p className="card-text">Most Acceptable</p>

          {publicRankings ? (
            publicRankings.map(([id, rank]) => (
              <div
                className="card-ranking"
                key={id}
                onClick={() => openModal({ id })}
                style={{
                  borderColor: cardIdToColor[id],
                  borderWidth: ".5vw",
                  borderStyle: "solid",
                }}
              >
                <p className="card-text">
                  {cardIdToTitle[id].replace("AI system designed for ", "")}
                </p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}

          <p className="card-text">Least Acceptable</p>
        </FlipMove>
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Card Information"
        // className="my-modal"
        // overlayClassName="my-modal-overlay"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "70vh",
            borderRadius: "1em",
          },
        }}
      >
        <h2 className="modal-title">Title: {selectedCardData.title}</h2>
        <p className="modal-text">
          <b>Legislation text:</b> {selectedCardData.reference}
        </p>
        <p className="modal-text">
          {" "}
          <b>Risk Assigned:</b> {selectedCardData.classification}
        </p>
        <p className="modal-text">
          <b>Your Risk Score: </b>
          {outputData.risk[selectedCardData.title] || "No choice made"}
        </p>
        <button className="modal-close-btn" onClick={closeModal}>
          X
        </button>
      </Modal> */}
    </div>
  );
};

export default Rankings;
