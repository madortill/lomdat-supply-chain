import React, { useEffect, useState } from "react";
import "./BoxConveyor.css";

import Popup from "../Popup/Popup";

import conveyor from "../../assets/conveyor/conveyor.svg";
import boxImage from "../../assets/conveyor/box.svg";
import conveyorBackground from "../../assets/conveyor/conveyor-background.svg";

import planningImg from "../../assets/conveyor/planning.svg";
import purchaseImg from "../../assets/conveyor/purchase.svg";
import storageImg from "../../assets/conveyor/storage.svg";
import catalogImg from "../../assets/conveyor/catalog.svg";
import issueImg from "../../assets/conveyor/issue.svg";
import useImg from "../../assets/conveyor/use.svg";
import removeImg from "../../assets/conveyor/remove.svg";

const popupImages = {
  planning: planningImg,
  purchase: purchaseImg,
  storage: storageImg,
  catalog: catalogImg,
  issue: issueImg,
  use: useImg,
  remove: removeImg,
};

function BoxConveyor({ data, onComplete }) {
  const storageKey = `supplyChain-boxConveyor-${data.id}`;

  /* =========================================
     Popup פתוח
  ========================================= */

  const [openBoxIndex, setOpenBoxIndex] = useState(null);

  /* =========================================
     ארגזים שהושלמו
  ========================================= */

  const [completedBoxes, setCompletedBoxes] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return parsed.completedBoxes || [];
    } catch {
      return [];
    }
  });

  /* =========================================
     שמירה
  ========================================= */

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        completedBoxes,
      })
    );
  }, [completedBoxes, storageKey]);

  /* =========================================
     הארגז הפעיל
  ========================================= */

  /*
    הארגז הפעיל הוא תמיד הראשון
    שעוד לא הושלם.

    אם כולם הושלמו:
    findIndex מחזיר -1,
    ולכן activeBoxIndex יהיה null.

    זה גם פותר את הבעיה שהארגז
    השביעי המשיך להבהב.
  */
    const nextIncompleteIndex = data.boxes.findIndex(
        (_, index) => !completedBoxes.includes(index)
      );
      
      const activeBoxIndex =
        nextIncompleteIndex === -1 ? null : nextIncompleteIndex;
      
      
      /* =========================================
         בדיקה האם הפעילות כבר הושלמה
      ========================================= */
      
      const allBoxesCompleted =
        completedBoxes.length === data.boxes.length;
      
      useEffect(() => {
        if (allBoxesCompleted) {
          onComplete?.();
        }
      }, [allBoxesCompleted, onComplete]);
    
  /* =========================================
     לחיצה על ארגז
  ========================================= */

  function handleBoxClick(index) {
    const isCompleted = completedBoxes.includes(index);

    const isActive = index === activeBoxIndex;

    /*
      אפשר ללחוץ רק על:
      - הארגז הפעיל
      - ארגז שכבר הושלם
    */
    if (!isActive && !isCompleted) {
      return;
    }

    setOpenBoxIndex(index);
  }

  /* =========================================
     סגירת Popup
  ========================================= */

  function handlePopupClose() {
    if (openBoxIndex === null) return;

    const finishedIndex = openBoxIndex;

    const wasAlreadyCompleted = completedBoxes.includes(finishedIndex);

    /*
      אם פתחנו מחדש ארגז שכבר הושלם,
      רק סוגרים את הפופאפ.
    */
    if (wasAlreadyCompleted) {
      setOpenBoxIndex(null);
      return;
    }

    /*
      מסמנים את הארגז החדש כהושלם.
    */
    setCompletedBoxes((prev) => [...prev, finishedIndex]);

    setOpenBoxIndex(null);
  }

  const openBox = openBoxIndex !== null ? data.boxes[openBoxIndex] : null;

  return (
    <div
      className="box-conveyor-page"
      style={{
        backgroundImage: `url(${conveyorBackground})`,
      }}
    >
      {/* =========================
          כותרת
      ========================= */}

      <div className="box-conveyor-heading">
        <h1>{data.title}</h1>

        {data.subtitle && <p>{data.subtitle}</p>}
      </div>

      {/* =========================
          שבעת הארגזים
      ========================= */}

      <div className="conveyor-boxes">
        {data.boxes.map((box, index) => {
          const isActive = index === activeBoxIndex;

          const isCompleted = completedBoxes.includes(index);

          const isLocked = !isActive && !isCompleted;

          return (
            <button
              key={box.id}
              className={`
                conveyor-box
                ${isActive ? "active" : ""}
                ${isCompleted ? "completed" : ""}
                ${isLocked ? "locked" : ""}
              `}
              onClick={() => handleBoxClick(index)}
              disabled={isLocked}
            >
              {/* המספר מעל הארגז */}
              <span className="conveyor-box-number">{box.id}</span>

              <div className="conveyor-box-image-wrapper">
                <img src={boxImage} alt="" className="conveyor-box-image" />

                <span className="conveyor-box-label">{box.label}</span>

                {isCompleted && <span className="conveyor-check">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================
          המסוע
      ========================= */}

      <img src={conveyor} alt="" className="conveyor-image" />

      {/* =========================
          Popup
      ========================= */}

      {openBox && (
        <Popup
          data={openBox.popup}
          image={popupImages[openBox.popup.image]}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

export default BoxConveyor;
