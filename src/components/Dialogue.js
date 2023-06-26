// Dialogue.js
import React, { useState, useEffect } from "react";
import loadingGif from "../images/noBackgroundLoading.gif";

import "./styles/Dialogue.css";

function Dialogue({ role, text }) {
  const [showPreDialogue, setShowPreDialogue] = useState(role !== "choice");

  useEffect(() => {
    if (role !== "choice") {
      const timer = setTimeout(() => {
        setShowPreDialogue(false);
      }, 1000);

      // Cleanup function to clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [role]);

  return (
    <>
      {showPreDialogue && role !== "choice" ? (
        <div className="pre-dialogue">
          {" "}
          <img src={loadingGif} alt="loading" className="loading-image" />
        </div>
      ) : (
        <div className={`dialogue ${role}`}>{text}</div>
      )}
    </>
  );
}

export default Dialogue;
