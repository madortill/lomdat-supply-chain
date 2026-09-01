import React, { useEffect, useState } from "react";
import "./BoxiSteps.css";

import Popup from "../Popup/Popup";

import boxi from "../../assets/boxi.svg";

// תחליפי בשם של קובץ החץ שלך
import branchArrow from "../../assets/arrow.svg";

// תמונות לפופאפים
import planningRequirements from "../../assets/planning-requirements.svg";
import orders from "../../assets/orders.svg";

const popupImages = {
  planningRequirements,
  orders,
};

function BoxiSteps({ data, onComplete }) {
  const storageKey = `supplyChain-boxiSteps-${data.id}`;

  /* =========================
     מה כבר נפתח
  ========================= */

  const [visitedOptions, setVisitedOptions] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return parsed.visitedOptions || [];
    } catch {
      return [];
    }
  });

  /* =========================
     איזה Popup פתוח
  ========================= */

  const [openOptionId, setOpenOptionId] = useState(null);

  /* =========================
     שמירה
  ========================= */

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        visitedOptions,
      })
    );
  }, [visitedOptions, storageKey]);

  /* =========================
     השלמת הפעילות
  ========================= */

  const allVisited =
    visitedOptions.length === data.options.length;

  useEffect(() => {
    if (allVisited) {
      onComplete?.();
    }
  }, [allVisited, onComplete]);

  /* =========================
     פתיחת שלב
  ========================= */

  function handleOptionClick(optionId) {
    setOpenOptionId(optionId);
  }

  /* =========================
     סגירת Popup
  ========================= */

  function handlePopupClose() {
    if (!openOptionId) return;

    setVisitedOptions((prev) => {
      if (prev.includes(openOptionId)) {
        return prev;
      }

      return [...prev, openOptionId];
    });

    setOpenOptionId(null);
  }

  const openOption = data.options.find(
    (option) => option.id === openOptionId
  );

  return (
    <div className="boxi-steps">
      {/* בועת הדיבור */}
      <div className="boxi-steps-speech">

        <h1 className="boxi-steps-title">
          {data.title}
        </h1>

        {/* שני הענפים */}
        <div className="boxi-steps-branches">
          {data.options.map((option, index) => {
            const isVisited =
              visitedOptions.includes(option.id);

            return (
              <div
                className="boxi-step-branch"
                key={option.id}
              >
                {/* חץ */}
                <img
                  src={branchArrow}
                  alt=""
                  className={`
                    boxi-step-arrow
                    ${index === 0 ? "right" : "left"}
                  `}
                />

                {/* כפתור */}
                <button
                  className={`
                    boxi-step-btn
                    ${isVisited ? "visited" : ""}
                  `}
                  onClick={() =>
                    handleOptionClick(option.id)
                  }
                >
                  {option.label}

                  {isVisited && (
                    <span className="boxi-step-check">
                      ✓
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {data.instruction && (
          <p className="boxi-steps-instruction">
            - {data.instruction} -
          </p>
        )}

        <div className="boxi-steps-speech-arrow" />

      {/* בוקסי */}
      <img
        src={boxi}
        alt="בוקסי"
        className="boxi-steps-character"
      />
      </div>

      {/* Popup */}
      {openOption && (
        <Popup
          data={openOption.popup}
          image={
            popupImages[
              openOption.popup.image
            ]
          }
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

export default BoxiSteps;