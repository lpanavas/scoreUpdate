import React from "react";
import robotLogo from "../images/robot-logo.png";
import firstSlide from "../images/firstSlide.png";
import secondSlide from "../images/secondSlide.png";
import thirdSlide from "../images/thirdSlide.png";
import fourthSlide from "../images/fourthSlide.PNG";

import "../components/styles/LandingPage.css";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";

function LandingPage({ onStartGame }) {
  const slides = [
    {
      title: "First item",
      description:
        "Heard of AI? It's hard to miss. Join us in a game to discover your views on it!",
      image: firstSlide,
    },
    {
      title: "Second item",
      description:
        "Test your instincts! Can you predict what others think about each AI technology?",
      image: secondSlide,
    },
    {
      title: "Third item",
      description:
        "Think you know the laws? Let's see if you can match AI technologies with their EU AI Act risk categories.",
      image: thirdSlide,
    },
    {
      title: "Fourth item",
      description:
        "Done with a game? Review your answers, compare with others, and keep playing to explore more!",
      image: fourthSlide,
    },
  ];

  return (
    <div className="landing-page">
      <div className="speech-bubble">
        <h1>Welcome to Game with AIm!</h1>
      </div>

      <img src={robotLogo} alt="Robot Logo" className="logo-image" />
      <div className="bottom">
        <div className="sliderArea">
          <Slider infinite={true}>
            {slides.map((slide, index) => (
              <div key={index}>
                {/* <h2>{slide.title}</h2> */}
                <div className="slideDescription">{slide.description}</div>
                <img className="sliderImage" src={slide.image} alt="Slide" />
              </div>
            ))}
          </Slider>
        </div>

        <button className="landing-page-button" onClick={onStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
