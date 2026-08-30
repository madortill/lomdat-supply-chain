import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OpeningPage.css";

import bahad6 from "../../assets/logo-glow.svg";
import til from "../../assets/til-glow.svg";

import boxCharacter from "../../assets/box-character.svg";
import menuItem1 from "../../assets/menu-item-1.svg";
import menuItem2 from "../../assets/menu-item-2.svg";
import menuItem3 from "../../assets/menu-item-3.svg";

function OpeningPage() {
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

      {/* =========================
          חלונית הוראות
      ========================= */}
      {showInstructions && (
        <>
          <div className="instructions-modal">
            <h1 className="instructions-title">הוראות לתפעול הלומדה</h1>

            <div className="instructions-content">
              {/* =========================
                  בוקסי + טקסט
              ========================= */}
              <div className="instructions-main">
                <div className="instructions-text">
                  <p>
                    הכירו את בוקסי הקופסה שתלווה אתכם
                    <br />
                    במהלך הלומדה ותיתן לכם עצות וטיפים:
                  </p>
                </div>

                <div className="instructions-character">
                  <img
                    src={boxCharacter}
                    alt="בוקסי"
                    className="instructions-character-img"
                  />
                </div>
              </div>

              {/* =========================
                  דוגמאות לכפתורים
              ========================= */}
              <div className="instractions-buttons-div">
                <p>
                  במהלך הלומדה תוכלו להתקדם קדימה ולחזור אחורה באמצעות כפתורים -
                  שימו לב שיהיו חלקים בהם לא תוכלו להתקדם עד שתמלאו אחר ההוראות.
                </p>

                <div className="instructions-buttons-example">
                  <div className="instruction-button-wrapper">
                    <button className="example-btn back">&lt; הקודם</button>

                    <span>חזרה לאחור</span>
                  </div>

                  <div className="instruction-button-wrapper">
                    <button className="example-btn">הבא &gt;</button>

                    <span>מעבר הלאה</span>
                  </div>

                  <div className="instruction-button-wrapper">
                    <button className="example-btn disabled-example">
                      הבא &gt;
                    </button>

                    <span>
                      שימו לב להוראות -
                      <br />
                      אין עדיין מעבר הלאה
                    </span>
                  </div>
                </div>
              </div>

              {/* =========================
                  אזור תחתון
              ========================= */}
              <div className="instructions-bottom">
                <p className="instructions-bottom-text">
                  בעזרת תפריט הניווט
                  <br />
                  תוכלו לראות את נושאי
                  <br />
                  הלומדה ואת
                  <br />
                  התקדמותכם בה.
                  <br />
                  שימו לב, כשנושא אפור הוא
                  <br />
                  עדיין לא מאופשר.
                </p>

                <div className="instructions-menu-demo">
                  <img
                    src={menuItem1}
                    alt=""
                    className="instruction-menu-img menu-item-1"
                  />

                  <img
                    src={menuItem2}
                    alt=""
                    className="instruction-menu-img menu-item-2"
                  />

                  <img
                    src={menuItem3}
                    alt=""
                    className="instruction-menu-img menu-item-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              כפתורי ניווט של העמוד
          ========================= */}

          <button className="opening-page-next-btn" onClick={() => navigate("/learning")}>
            הבא &gt;
          </button>

          <button
            className="opening-page-back-btn"
            onClick={() => setShowInstructions(false)}
          >
            &lt; הקודם
          </button>
        </>
      )}
    </div>
  );
}

export default OpeningPage;
