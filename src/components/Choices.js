import React, { useState, useEffect } from "react";
import "./styles/Choices.css";

function Choices({ choices, onClick }) {
  const [isChoiceClickable, setIsChoiceClickable] = useState(true);

  const handleChoiceClick = (index) => {
    if (isChoiceClickable) {
      setIsChoiceClickable(false);
      onClick(index);

      // Delay the appearance of the next choice by 1 second (1000 milliseconds)
      setTimeout(() => {
        setIsChoiceClickable(true);
        const nextIndex = index + 1;
        if (nextIndex < choices.length) {
          onClick(nextIndex);
        }
      }, 1000);
    }
  };

  return (
    <div className="choices">
      {choices.map((choice, index) => (
        <button
          className="button"
          key={index}
          onClick={() => handleChoiceClick(index)}
          disabled={!isChoiceClickable}
        >
          {choice.option}
        </button>
      ))}
    </div>
  );
}

export default Choices;
