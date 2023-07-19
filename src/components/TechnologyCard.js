import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/TechnologyCard.css";

const TechnologyCard = ({
  tech1,
  tech2,
  handleChoice,
  percent1,
  percent2,
  selectionMade,
  agreementAnswer,
  isClicked1,
  isClicked2,
}) => {
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);

  useEffect(() => {
    setClicked1(isClicked1);
    setClicked2(isClicked2);
  }, [isClicked1, isClicked2]);

  const scaleAndShadowProps1 = useSpring({
    to: clicked1
      ? { scale: 1.04, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }
      : {},
    config: { tension: 210, friction: 20 },
  });

  const opacityProps1 = useSpring({
    to: clicked2 ? { opacity: 0.5 } : {},
    config: { tension: 210, friction: 20 },
  });

  const scaleAndShadowProps2 = useSpring({
    to: clicked2
      ? { scale: 1.04, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }
      : {},
    config: { tension: 210, friction: 20 },
  });

  const opacityProps2 = useSpring({
    to: clicked1 ? { opacity: 0.5 } : {},
    config: { tension: 210, friction: 20 },
  });

  const handleClick1 = () => {
    if (selectionMade) {
      return;
    }
    handleChoice(0);
    setClicked1(true);
  };

  const handleClick2 = () => {
    if (selectionMade) {
      return;
    }
    handleChoice(1);
    setClicked2(true);
  };

  return (
    <>
      <a.div
        style={{ ...scaleAndShadowProps1, ...opacityProps1 }}
        className={
          clicked1 ? "technology-card clicked" : "technology-card unselected"
        }
        onClick={handleClick1}
      >
        <div className="main-column">
          <h5>AI system designed for ...</h5>
          <h3>{tech1.title.replace("AI system designed for ", "")}</h3>
          {agreementAnswer && (
            <div className="percentage-display">{percent1.selectedCard}%</div>
          )}
          <div className="percentage-div">
            {agreementAnswer && (
              <div
                className="bar selected"
                style={{ height: `${percent1.selectedCard}%` }}
              ></div>
            )}
          </div>
        </div>
      </a.div>

      <a.div
        style={{ ...scaleAndShadowProps2, ...opacityProps2 }}
        className={
          clicked2 ? "technology-card clicked" : "technology-card unselected"
        }
        onClick={handleClick2}
      >
        <div className="main-column">
          <h5>AI system designed for ...</h5>
          <h3>{tech2.title.replace("AI system designed for ", "")}</h3>
          {agreementAnswer && (
            <div className="percentage-display">{percent2.selectedCard}%</div>
          )}
          <div className="percentage-div">
            {agreementAnswer && (
              <div
                className="bar selected"
                style={{ height: `${percent2.selectedCard}%` }}
              ></div>
            )}
          </div>
        </div>
      </a.div>
    </>
  );
};

export default TechnologyCard;
