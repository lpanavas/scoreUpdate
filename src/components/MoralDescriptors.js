import React, { useState } from "react";
import { useSpring, useTransition, animated as a } from "react-spring";
import "./styles/MoralDescriptors.css";
import authorityLow from "../images/AuthorityLow/b15_p345_14.jpg";
import authorityHigh from "../images/AuthorityHigh/b15_p460_8.jpg";
import fairLow from "../images/FairLow/b10_p133_8.jpg";
import fairHigh from "../images/FairHigh/b11_p172_9.jpg";

const MoralDescriptors = ({ moralDescriptors, handleNextCards }) => {
  const [currentDescriptorIndex, setCurrentDescriptorIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState({
    high: null,
    low: null,
  });

  const handleImageSelection = (selectedImage) => {
    if (selectedImage === "high") {
      setSelectedImages({
        ...selectedImages,
        high: moralDescriptors[currentDescriptorIndex],
      });
    } else if (selectedImage === "low") {
      setSelectedImages({
        ...selectedImages,
        low: moralDescriptors[currentDescriptorIndex],
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
          high: authorityHigh,
          low: authorityLow,
        };
      case "Fair":
        return {
          high: fairHigh,
          low: fairLow,
        };
      default:
        return {
          high: "",
          low: "",
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
  };

  return (
    <div className="moral-descriptors">
      <h3>How does this technology make you feel?</h3>
      <div className="image-container">
        {transitions((style, item) => (
          <>
            <div className="image-wrapper">
              <a.button
                style={buttonProps}
                onClick={() => handleButtonClick("high")}
              >
                <img
                  src={imageSources.high}
                  alt="High"
                  className={
                    selectedImages.high === moralDescriptors[item]
                      ? "image-pop-up"
                      : ""
                  }
                />
              </a.button>
            </div>
            <div className="image-wrapper">
              <a.button
                style={buttonProps}
                onClick={() => handleButtonClick("low")}
              >
                <img
                  src={imageSources.low}
                  alt="Low"
                  className={
                    selectedImages.low === moralDescriptors[item]
                      ? "image-pop-up"
                      : ""
                  }
                />
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
