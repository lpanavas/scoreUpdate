import React, { useState } from "react";
import { useSpring, useTransition, animated as a } from "react-spring";
import "./styles/MoralDescriptors.css";
import authorityPositive from "../images/AuthorityPositive.jpg";
import authorityNegative from "../images/AuthorityNegative.jpg";
import fairPositive from "../images/FairPositive.jpg";
import fairNegative from "../images/FairNegative.jpg";
import loyaltyPositive from "../images/LoyaltyPositive.jpg";
import loyaltyNegative from "../images/LoyaltyNegative.jpg";
import harmNegative from "../images/HarmNegative.jpg";
import harmPositive from "../images/HarmPositive.jpg";
import purityPositive from "../images/PurityPositive.jpg";
import purityNegative from "../images/PurityNegative.jpg";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // destructuring assignment to swap values
  }
  return array;
};

const MoralDescriptors = ({
  moralDescriptors,
  handleNextCards,
  setMoralChoices,
  selectedCard,
}) => {
  const [currentDescriptorIndex, setCurrentDescriptorIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState({
    positive: null,
    negative: null,
  });

  const handleImageSelection = (selectedImage) => {
    if (selectedImage === "positive") {
      setSelectedImages({
        ...selectedImages,
        positive: moralDescriptors[currentDescriptorIndex],
      });
    } else if (selectedImage === "negative") {
      setSelectedImages({
        ...selectedImages,
        negative: moralDescriptors[currentDescriptorIndex],
      });
    }

    if (currentDescriptorIndex === moralDescriptors.length - 1) {
      handleNextCards();
    } else {
      setCurrentDescriptorIndex(currentDescriptorIndex + 1);
    }
  };
  const getImageSource = (descriptor) => {
    switch (descriptor) {
      case "Authority":
        return {
          positive: {
            source: authorityPositive,
            description: "Respectful",
          },
          negative: {
            source: authorityNegative,
            description: "Disobedient",
          },
        };
      case "Fair":
        return {
          positive: {
            source: fairPositive,
            description: "Fair",
          },
          negative: {
            source: fairNegative,
            description: "Unjust",
          },
        };
      case "Loyalty":
        return {
          positive: {
            source: loyaltyPositive,
            description: "Loyal",
          },
          negative: {
            source: loyaltyNegative,
            description: "Traitor",
          },
        };
      case "Harm":
        return {
          positive: {
            source: harmPositive,
            description: "Protective",
          },
          negative: {
            source: harmNegative,
            description: "Harmful",
          },
        };
      case "Purity":
        return {
          positive: {
            source: purityPositive,
            description: "Decent",
          },
          negative: {
            source: purityNegative,
            description: "Indecent",
          },
        };
      default:
        return {
          positive: { source: "", description: "" },
          negative: { source: "", description: "" },
        };
    }
  };

  const currentDescriptor = moralDescriptors[currentDescriptorIndex];
  const imageSources = getImageSource(currentDescriptor);

  // setup transition for images
  const transitions = useTransition(currentDescriptorIndex, {
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    config: { tension: 210, friction: 20 },
  });

  // setup spring for button
  const [buttonProps, setButtonProps] = useSpring(() => ({
    scale: 1,
    config: { tension: 210, friction: 20 },
  }));

  const handleButtonClick = (selectedImage) => {
    setButtonProps({ scale: 1.1 });
    handleImageSelection(selectedImage);
    setMoralChoices((prevChoices) => ({
      ...prevChoices,
      [selectedCard.ID]: {
        ...(prevChoices[selectedCard.ID] || {}),
        [currentDescriptor]: selectedImage,
      },
    }));

    // Reset the button scale after a short period of time
    setTimeout(() => setButtonProps({ scale: 1 }), 150);
  };

  return (
    <div className="moral-descriptors">
      <h3>How would you describe this technology?</h3>
      <div className="image-container">
        {transitions((style, item) => (
          <>
            <div className="image-wrapper">
              <a.button
                style={buttonProps}
                onClick={() => handleButtonClick("positive")}
              >
                <img
                  src={imageSources.positive.source}
                  alt="Positive"
                  className={
                    selectedImages.positive === moralDescriptors[item]
                      ? "image-pop-up"
                      : ""
                  }
                />
                <p>{imageSources.positive.description}</p>
              </a.button>
            </div>
            <div className="image-wrapper">
              <a.button
                style={buttonProps}
                onClick={() => handleButtonClick("negative")}
              >
                <img
                  src={imageSources.negative.source}
                  alt="Negative"
                  className={
                    selectedImages.negative === moralDescriptors[item]
                      ? "image-pop-up"
                      : ""
                  }
                />
                <p>{imageSources.negative.description}</p>
              </a.button>
            </div>
          </>
        ))}
      </div>
      <button
        className="unsure-button"
        onClick={() => handleImageSelection("unsure")}
      >
        Unsure
      </button>
    </div>
  );
};

export default MoralDescriptors;
