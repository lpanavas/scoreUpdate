import React from "react";
import robotLogo from "../images/robot-logo.png";
import "../components/styles/LandingPage.css";

function LandingPage({ onStartGame }) {
  return (
    <div className="landing-page">
      <h1>Welcome to Game with AIm!</h1>
      <img src={robotLogo} alt="Robot Logo" className="logo-image" />
      <p>
        We want your help in deciding what AI technology is acceptable! Click
        the button below to start the game.
      </p>
      <button className="landing-page-button" onClick={onStartGame}>
        Start Game
      </button>
    </div>
  );
}

export default LandingPage;
