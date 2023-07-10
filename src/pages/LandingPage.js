import React from "react";
import robotLogo from "../images/robot-logo.png";
import "../components/styles/LandingPage.css";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";

function LandingPage({ onStartGame }) {
  const slides = [
    {
      title: "First item",
      description: "The EU AI Act goes into effect very soon.",
    },
    {
      title: "Second item",
      description:
        "All of the AI systems you see in the course of the game are directly related to this legislation.",
    },
    {
      title: "Third item",
      description:
        "Help us better understand how you feel about AI and see how your others feel.",
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
                <h2>{slide.title}</h2>
                <div>{slide.description}</div>
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
