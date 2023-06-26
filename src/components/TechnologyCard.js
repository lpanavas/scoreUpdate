import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/TechnologyCard.css";

const TechnologyCard = ({
  tech,
  handleChoice,
  index,
  percent,
  selectionMade,
  agreementAnswer,
  isClicked,
}) => {
  const [clicked, setClicked] = useState(false);

  const selectedCardProps = useSpring({
    to: clicked
      ? { scale: 1.02, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }
      : {},
    config: { tension: 210, friction: 20 },
  });

  const props = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: {
      opacity: selectionMade && !clicked ? 0.5 : 1,
      transform: "scale(1)",
    },
    config: { tension: 210, friction: 20 },
  });

  const handleClick = () => {
    if (clicked || selectionMade) {
      return;
    }
    handleChoice(index);
    setClicked(true);
  };

  const cardClass = clicked
    ? "technology-card clicked"
    : "technology-card unselected";

  return (
    <a.div
      style={clicked && selectionMade ? selectedCardProps : props}
      className={cardClass}
      onClick={handleClick}
    >
      <div className="main-column">
        <div className="percentage-div">
          <h3>{tech.title}</h3>
        </div>
      </div>
      {agreementAnswer && index === 0 && (
        <div className="left-column">
          <div className="bar-chart">
            <div
              className="bar selected"
              style={{ height: `${percent.selectedCard}%` }}
            ></div>
          </div>
        </div>
      )}
      {agreementAnswer && index === 1 && (
        <div className="right-column">
          <div className="bar-chart">
            <div
              className="bar unselected"
              style={{ height: `${percent.unselectedCard}%` }}
            ></div>
          </div>
        </div>
      )}
    </a.div>
  );
};

export default TechnologyCard;
