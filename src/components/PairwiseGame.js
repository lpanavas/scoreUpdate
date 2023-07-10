import React, { useState, useEffect } from "react";

import TechnologyCard from "./TechnologyCard";
import Rankings from "./Rankings";
import ScoreBar from "./ScoreBar";
import Comparisons from "../data/comparisons.json";

import MoralDescriptors from "./MoralDescriptors";
import Button from "./Button";
import DemographicCollection from "./DemographicCollection";
import "./styles/PairwiseGame.css";

const moralDescriptors = ["Authority", "Fair"];

const PairwiseGame = ({
  technologies,
  pairwiseData,
  finishGame,
  skipDemographics,
  demographics,
  setDemographics,
  setOutputData,
  userID,
}) => {
  const [shuffledTechnologies, setShuffledTechnologies] = useState([]);

  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [rankings, setRankings] = useState({});
  const [selectedDescriptors, setSelectedDescriptors] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [unselectedCard, setUnselectedCard] = useState(null);
  const [descriptorStage, setDescriptorStage] = useState("firstDescriptors");
  const [progress, setProgress] = useState(0);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState(0);
  const [unselectedPercent, setUnselectedPercent] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState(null);
  const [descriptorClickTimes, setDescriptorClickTimes] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scoreIndex, setScoreIndex] = useState(0);
  const [agreementAnswer, setAgreementAnswer] = useState(null);
  const [showDescriptorImages, setShowDescriptorImages] = useState(false);
  const [agreementResult, setAgreementResult] = useState(null);
  const [showAgreementResult, setShowAgreementResult] = useState(false);
  // Add these to your current list of useState calls
  const [cardMatchups, setCardMatchups] = useState([]);
  const [moralChoices, setMoralChoices] = useState({});
  const [sendToDemographicData, setSendToDemographicData] = useState();
  const [riskAnswer, setRiskAnswer] = useState(null);
  const [riskAnswerOuput, setRiskAnswerOutput] = useState({});

  useEffect(() => {
    if (technologies.length > 0) {
      // Shuffle technologies array
      let shuffledTechnologies = [...technologies];

      for (let i = shuffledTechnologies.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledTechnologies[i], shuffledTechnologies[j]] = [
          shuffledTechnologies[j],
          shuffledTechnologies[i],
        ];
      }

      let tempShuffledTechnologies = [];
      for (let i = 0; i < shuffledTechnologies.length; i++) {
        let pair1 = [
          shuffledTechnologies[i],
          shuffledTechnologies[
            (i - 1 + shuffledTechnologies.length) % shuffledTechnologies.length
          ],
        ];
        tempShuffledTechnologies.push(pair1);
      }

      // Shuffle tempShuffledTechnologies
      for (let i = tempShuffledTechnologies.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tempShuffledTechnologies[i], tempShuffledTechnologies[j]] = [
          tempShuffledTechnologies[j],
          tempShuffledTechnologies[i],
        ];
      }

      setShuffledTechnologies(tempShuffledTechnologies);

      // Use the original technologies array for the initial rankings
      let initialRankings = {};
      technologies.forEach((tech) => {
        initialRankings[tech.title] = {
          descriptors: [],
          wins: 0,
          losses: 0,
          ties: 0,
          opponents: {}, // Keep track of wins, losses, and ties against each opponent
        };
      });
      setRankings(initialRankings);
    }
  }, [technologies]);

  useEffect(() => {
    if (currentPairIndex >= technologies.length) {
      setSendToDemographicData({
        UserID: userID, // this should be fetched dynamically
        demographics: demographics,
        risk: riskAnswerOuput,

        CardMatchups: cardMatchups,
        Moral: moralChoices,
      });

      // Output the final JSON
      console.log(skipDemographics);
      if (skipDemographics && currentPairIndex >= shuffledTechnologies.length) {
        const finalData = {
          UserID: userID, // this should be fetched dynamically
          demographics: demographics,
          risk: riskAnswerOuput,
          CardMatchups: cardMatchups,
          Moral: moralChoices,
        };

        setOutputData(finalData);
        finishGame(); // Call the finishGame function
      }
      setGameOver(true);
    }
  }, [
    currentPairIndex,
    technologies.length,
    shuffledTechnologies.length,
    skipDemographics,
    finishGame,
  ]);
  useEffect(() => {
    calculateProgress();
  }, [currentPairIndex]);

  const calculateProgress = () => {
    const totalPairs = Math.floor(technologies.length);
    const currentProgress = (currentPairIndex / totalPairs) * 100;
    setProgress(currentProgress);
  };

  const handleChoice = (chosenIndex) => {
    // Adjustments to handle new shuffledTechnologies format
    setDescriptorClickTimes([]);
    setFirstClickTime(Date.now());

    if (selectedCard !== null) {
      return; // If a card is already selected, do nothing
    }

    const chosenCard = chosenIndex % 2 === 0 ? 0 : 1;

    setSelectedCard(shuffledTechnologies[currentPairIndex][chosenCard]);

    setSelectedIndex(chosenIndex);

    setUnselectedCard(
      shuffledTechnologies[currentPairIndex][(chosenCard + 1) % 2]
    );

    setSelectionMade(true);
    setAgreementAnswer(null);
  };

  const renderTechnologyCard = (index) => {
    const tech = shuffledTechnologies[currentPairIndex][index];
    const percent = {
      selectedCard: selectedPercent,
      unselectedCard: unselectedPercent,
    };
    return (
      <TechnologyCard
        key={tech.title}
        tech={tech}
        handleChoice={handleChoice}
        index={index}
        percent={percent}
        selectionMade={selectionMade}
        agreementAnswer={agreementAnswer}
        isClicked={index === selectedIndex}
      />
    );
  };

  const handleRiskAnswer = (answer) => {
    setRiskAnswerOutput((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers, [selectedCard.ID]: answer };
      return updatedAnswers;
    });
    setRiskAnswer(null);
  };

  const handleAgreementAnswer = (answer) => {
    const percentCard = selectedCard;
    const unpercentCard = unselectedCard;
    setAgreementResult("Correct");
    setScore((prevScore) => prevScore + 10);
    setSelectedPercent(49);
    setUnselectedPercent(51);
    setRiskAnswer("show");

    setCardMatchups([
      ...cardMatchups,
      {
        Card1: shuffledTechnologies[currentPairIndex][0].ID,
        Card2: shuffledTechnologies[currentPairIndex][1].ID,
        Answer: selectedCard.ID,
        Majority: answer,
      },
    ]);

    // const foundComparison = Comparisons.comparisons.find(
    //   (comp) =>
    //     comp.title1 === percentCard.title && comp.title2 === unpercentCard.title
    // );

    // setScoreIndex((scoreIndex) => scoreIndex + 1);

    // // Update the score based on the selectedPercent
    // if (foundComparison && answer === "yes") {
    //   setAgreementResult("Correct");
    //   setScore((prevScore) => prevScore + 10);
    //   setSelectedPercent(foundComparison.percent1);
    //   setUnselectedPercent(foundComparison.percent2);
    // }
    // if (foundComparison && answer === "no") {
    //   setAgreementResult("Incorrect");
    //   setScore((prevScore) => prevScore);
    //   setSelectedPercent(foundComparison.percent1);
    //   setUnselectedPercent(foundComparison.percent2);
    // }
    // if (foundComparison && answer === "unsure") {
    //   setAgreementResult(null);

    //   setScore((prevScore) => prevScore);
    //   setSelectedPercent(foundComparison.percent1);
    //   setUnselectedPercent(foundComparison.percent2);
    // }

    // if (!foundComparison && answer === "yes") {
    //   setAgreementResult("Incorrect");

    //   setScore((prevScore) => prevScore);
    //   const wrongOrder = Comparisons.comparisons.find(
    //     (comp) =>
    //       comp.title1 === unpercentCard.title &&
    //       comp.title2 === percentCard.title
    //   );
    //   setSelectedPercent(wrongOrder.percent2);
    //   setUnselectedPercent(wrongOrder.percent1);
    //   console.log(wrongOrder);
    // }

    // if (!foundComparison && answer === "no") {
    //   setAgreementResult("Correct");

    //   setScore((prevScore) => prevScore + 10);
    //   const wrongOrder = Comparisons.comparisons.find(
    //     (comp) =>
    //       comp.title1 === unpercentCard.title &&
    //       comp.title2 === percentCard.title
    //   );
    //   setSelectedPercent(wrongOrder.percent2);
    //   setUnselectedPercent(wrongOrder.percent1);
    // }

    // if (!foundComparison && answer === "unsure") {
    //   setAgreementResult(null);
    //   setScore((prevScore) => prevScore);
    //   const wrongOrder = Comparisons.comparisons.find(
    //     (comp) =>
    //       comp.title1 === unpercentCard.title &&
    //       comp.title2 === percentCard.title
    //   );
    //   setSelectedPercent(wrongOrder.percent2);
    //   setUnselectedPercent(wrongOrder.percent1);
    // }

    setShowAgreementResult(true); // Initially set showAgreementResult to true
    setTimeout(() => {
      setShowAgreementResult(false); // After a second, set showAgreementResult back to false
    }, 2000);

    setShowDescriptorImages(true);
    setAgreementAnswer(answer);
  };
  const handleNextCards = () => {
    let updatedRankings = { ...rankings };
    // Check if we should move onto the next stage or finish this round

    const selectedTech = selectedCard.title;
    const unselectedTech = unselectedCard.title;

    // Update wins, losses, and opponents
    updatedRankings[selectedTech].wins += 1;
    updatedRankings[unselectedTech].losses += 1;
    updatedRankings[selectedTech].opponents[unselectedTech] =
      (updatedRankings[selectedTech].opponents[unselectedTech] || 0) + 1;
    updatedRankings[unselectedTech].opponents[selectedTech] =
      (updatedRankings[unselectedTech].opponents[selectedTech] || 0) - 1;

    // Update the descriptors
    setRankings(updatedRankings);
    setSelectedDescriptors([]);
    setSelectedCard(null);
    setUnselectedCard(null);
    setCurrentPairIndex(currentPairIndex + 1);
    setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
    setSelectionMade(false);
    setSelectedIndex(null);
    setAgreementAnswer(null);
    setShowDescriptorImages(false);
    setRiskAnswer(null);

    // Now the effect that triggers game over will run if necessary
  };

  const handleSkip = () => {
    let updatedRankings = { ...rankings };
    const firstTech = shuffledTechnologies[currentPairIndex][0].title;
    const secondTech = shuffledTechnologies[currentPairIndex][1].title;

    setCardMatchups([
      ...cardMatchups,
      {
        Card1: shuffledTechnologies[currentPairIndex][0].ID,
        Card2: shuffledTechnologies[currentPairIndex][1].ID,
        Answer: "Skip",
        Majority: "Skip",
      },
    ]);

    // Update ties and opponents
    updatedRankings[firstTech].ties += 1;
    updatedRankings[secondTech].ties += 1;
    updatedRankings[firstTech].opponents[secondTech] =
      updatedRankings[firstTech].opponents[secondTech] || 0;
    updatedRankings[secondTech].opponents[firstTech] =
      updatedRankings[secondTech].opponents[firstTech] || 0;

    setScoreIndex((scoreIndex) => scoreIndex + 1);
    setRankings(updatedRankings);
    setSelectedDescriptors([]);
    setSelectedCard(null);
    setUnselectedCard(null);
    setCurrentPairIndex(currentPairIndex + 1);
    setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
    setSelectionMade(false);
    setAgreementAnswer(null);
  };

  return (
    <div className="pairwise-game">
      {!gameOver && (
        <div className="progress-bar">
          <div
            className="progress-bar-inner"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {!gameOver && (
        <>
          <h2>Which technology worries you more?</h2>
          <div className="bottomHalf">
            <div className="technology-pair">
              {currentPairIndex < shuffledTechnologies.length && (
                <>
                  {renderTechnologyCard(0)}

                  {renderTechnologyCard(1)}
                </>
              )}
              {selectedCard ? null : (
                <div className="descriptors">
                  <Button text="Skip" onClick={handleSkip} />
                </div>
              )}
            </div>
            {selectedCard &&
              showDescriptorImages &&
              !showAgreementResult &&
              riskAnswer && (
                <div className="agreement-question">
                  <h3>How would you classify this technology?</h3>

                  <div className="button-container">
                    <button onClick={() => handleRiskAnswer("Low")}>
                      Low Risk
                    </button>
                    <button onClick={() => handleRiskAnswer("High")}>
                      High Risk
                    </button>
                    <button onClick={() => handleRiskAnswer("Unacceptable")}>
                      Unacceptable Risk
                    </button>
                    <button onClick={() => handleRiskAnswer("Unsure")}>
                      Unsure
                    </button>
                  </div>
                </div>
              )}

            {selectedCard && !riskAnswer && !agreementAnswer && (
              <div className="agreement-question">
                <h3>Do most people agree with you?</h3>

                <div className="button-container">
                  <button onClick={() => handleAgreementAnswer("yes")}>
                    Yes
                  </button>
                  <button onClick={() => handleAgreementAnswer("no")}>
                    No
                  </button>
                  <button onClick={() => handleAgreementAnswer("unsure")}>
                    Unsure
                  </button>
                </div>
              </div>
            )}
            {selectedCard && agreementAnswer && showAgreementResult && (
              <div className="agreement-question">
                <h3>Do most people agree with you?</h3>

                <div className="button-container">
                  <p
                    className={
                      agreementResult === "Correct" ? "correct" : "incorrect"
                    }
                  >
                    {agreementResult}
                  </p>
                </div>
              </div>
            )}
            {selectedCard &&
              showDescriptorImages &&
              !showAgreementResult &&
              !riskAnswer && (
                <MoralDescriptors
                  moralDescriptors={moralDescriptors}
                  handleNextCards={handleNextCards}
                  setMoralChoices={setMoralChoices}
                  selectedCard={selectedCard}
                />
              )}
            <ScoreBar score={score} currentPairIndex={currentPairIndex} />
          </div>
        </>
      )}
      {gameOver && !skipDemographics && (
        <DemographicCollection
          finishGame={finishGame}
          setDemographics={setDemographics}
          sendToDemographicData={sendToDemographicData}
          setOutputData={setOutputData}
        />
      )}
    </div>
  );
};
export default PairwiseGame;