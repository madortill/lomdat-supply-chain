import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EndPage.css";

import bahad6 from "../../assets/logo-glow.svg";
import til from "../../assets/til-glow.svg";

import boxCharacter from "../../assets/box-character.svg";
import menuItem1 from "../../assets/menu-item-1.svg";
import menuItem2 from "../../assets/menu-item-2.svg";
import menuItem3 from "../../assets/menu-item-3.svg";

function EndPage() {
  const navigate = useNavigate();

  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="opening-page">
      {/* לוגו מדור טי"ל */}
      <img src={til} alt="מדור טיל" className="til-logo" />

      {/* =========================
          מסך הפתיחה
      ========================= */}
      {!showInstructions && (
        <div className="opening-content">
          <img src={bahad6} alt='בה"ד 6' className="bahad6-logo-opening-page" />

          <div className="opening-text">
            <p className="opening-welcome">ברוכים הבאים</p>

            <h1 className="opening-title">ללומדת שרשרת האספקה</h1>
          </div>

          <button
            className="opening-start-btn"
            onClick={() => setShowInstructions(true)}
          >
            להתחלת הלומדה
          </button>
        </div>
      )}

    </div>
  );
}

export default EndPage;
