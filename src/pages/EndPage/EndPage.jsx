import React from "react";
import { useNavigate } from "react-router-dom";
import "./EndPage.css";

import til from "../../assets/til-glow.svg";
import confetti from "../../assets/Confetti.svg";

function EndPage() {
  const navigate = useNavigate();

  function handleBackToLearning() {
    navigate("/learning");
  }

  function handleBackToStart() {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("supplyChain-")) {
        sessionStorage.removeItem(key);
      }
    });
  
    navigate("/");
  }

  return (
    <div className="end-page">
      {/* לוגו מדור טי"ל */}
      <img src={til} alt='מדור טי"ל' className="end-til-logo" />

      {/* כרטיס סיום */}
      <div className="end-content-div">
        <img src={confetti} alt="" className="confetti-img-end-page" />

        <div className="end-text">
          <p className="end-text1">כל הכבוד</p>

          <h1 className="end-text2">סיימתם את הלומדה!!</h1>
        </div>

        <div className="btns-end-page-div">
          <button
            className="end-btn end-to-learning-btn"
            onClick={handleBackToLearning}
          >
            &lt; חזרה לחומר
          </button>

          <button
            className="end-btn end-to-start-btn"
            onClick={handleBackToStart}
          >
            לתחילת הלומדה &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndPage;
