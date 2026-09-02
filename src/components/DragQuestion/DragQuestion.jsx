import React, { useEffect, useState } from "react";
import "./DragQuestion.css";

import dragBackground from "../../assets/drag-question-background.svg";

function DragQuestion({ data, onComplete }) {
  const storageKey = `supplyChain-dragQuestion-${data.id}`;

  /* =========================================
     טעינת מצב שמור
  ========================================= */

  const [savedState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);

      if (!saved) {
        return {};
      }

      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  /*
    placements:
    המפתח = מספר היעד
    הערך = id של התשובה שנמצאת בו
  */
  const [placements, setPlacements] = useState(savedState.placements || {});

  /*
    statuses:
    {
      1: "correct",
      2: "wrong"
    }
  */
  const [statuses, setStatuses] = useState(savedState.statuses || {});

  const [isCompleted, setIsCompleted] = useState(
    savedState.isCompleted || false
  );

  /*
    מידע זמני בזמן גרירה בלבד
  */
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  /* =========================================
     שמירה
  ========================================= */

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        placements,
        statuses,
        isCompleted,
      })
    );
  }, [placements, statuses, isCompleted, storageKey]);

  /* =========================================
     נתונים מחושבים
  ========================================= */

  const slots = Array.from(
    { length: data.answers.length },
    (_, index) => index + 1
  );

  const placedAnswerIds = Object.values(placements);

  const allSlotsFilled = Object.keys(placements).length === data.answers.length;

  /*
    האם כרגע גוררים תשובה
    מתוך אחד היעדים העליונים?
  */
  const canReturnToBank =
    draggedItem?.fromSlot !== null &&
    draggedItem?.fromSlot !== undefined &&
    !isCompleted;

  function getAnswerById(answerId) {
    return data.answers.find((answer) => answer.id === answerId);
  }

  /* =========================================
     התחלת גרירה
  ========================================= */

  function handleDragStart(event, answerId, fromSlot = null) {
    if (isCompleted) return;

    /*
      תשובה שכבר נבדקה כנכונה
      נשארת נעולה.
    */
    if (fromSlot !== null && statuses[fromSlot] === "correct") {
      event.preventDefault();
      return;
    }

    /*
      נותן לדפדפן להבין שמדובר
      בפעולת move אמיתית.
    */
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", answerId);

    setDraggedItem({
      answerId,
      fromSlot,
    });
  }

  /* =========================================
     גרירה מעל יעד עליון
  ========================================= */

  function handleDragOver(event, slotNumber) {
    event.preventDefault();

    if (!draggedItem) return;

    /*
      יעד שכבר נכון לא ניתן להחלפה.
    */
    if (statuses[slotNumber] === "correct") {
      return;
    }

    event.dataTransfer.dropEffect = "move";

    setDragOverSlot(slotNumber);
  }

  /* =========================================
     שחרור על יעד עליון
  ========================================= */

  function handleDrop(event, targetSlot) {
    event.preventDefault();

    if (!draggedItem) return;

    if (statuses[targetSlot] === "correct") {
      setDraggedItem(null);
      setDragOverSlot(null);
      return;
    }

    const { answerId, fromSlot } = draggedItem;

    setPlacements((prev) => {
      const next = { ...prev };

      const answerAlreadyInTarget = next[targetSlot];

      /*
        אם גררנו מתוך יעד אחר,
        קודם מפנים אותו.
      */
      if (fromSlot !== null) {
        delete next[fromSlot];
      }

      /*
        גרירה בין שני יעדים מלאים:
        התשובות מתחלפות ביניהן.
      */
      if (answerAlreadyInTarget && fromSlot !== null) {
        next[fromSlot] = answerAlreadyInTarget;
      }

      /*
        תשובה חדשה מהבנק לא דורסת
        תשובה שכבר נמצאת ביעד.
      */
      if (answerAlreadyInTarget && fromSlot === null) {
        return prev;
      }

      next[targetSlot] = answerId;

      return next;
    });

    /*
      אם משנים תשובה אחרי בדיקה,
      מוחקים את מצב האדום הישן.
    */
    setStatuses((prev) => {
      const next = { ...prev };

      if (fromSlot !== null) {
        delete next[fromSlot];
      }

      delete next[targetSlot];

      return next;
    });

    setDraggedItem(null);
    setDragOverSlot(null);
  }

  /* =========================================
     גרירה חזרה לבנק התשובות
  ========================================= */

  function handleBankDragOver(event) {
    /*
      אפשר להחזיר לבנק רק תשובה
      שכבר נמצאת באזור העליון.
    */
    if (!draggedItem || draggedItem.fromSlot === null || isCompleted) {
      return;
    }

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  }

  function handleBankDrop(event) {
    event.preventDefault();

    if (!draggedItem || draggedItem.fromSlot === null || isCompleted) {
      return;
    }

    const { fromSlot } = draggedItem;

    /*
      מוציאים את התשובה מהיעד העליון.
      ברגע שהיא כבר לא ב-placements,
      React מציג אותה מחדש במקום
      המקורי שלה בבנק התשובות.
    */
    setPlacements((prev) => {
      const next = { ...prev };

      delete next[fromSlot];

      return next;
    });

    /*
      אם היא הייתה אדומה אחרי בדיקה,
      מוחקים גם את סטטוס הטעות.
    */
    setStatuses((prev) => {
      const next = { ...prev };

      delete next[fromSlot];

      return next;
    });

    setDraggedItem(null);
    setDragOverSlot(null);
  }

  /* =========================================
     סיום גרירה
  ========================================= */

  function handleDragEnd() {
    setDraggedItem(null);
    setDragOverSlot(null);
  }

  /* =========================================
     בדיקה
  ========================================= */

  function handleCheck() {
    if (!allSlotsFilled || isCompleted) {
      return;
    }

    const newStatuses = {};

    let allCorrect = true;

    slots.forEach((slotNumber) => {
      const answerId = placements[slotNumber];

      const answer = getAnswerById(answerId);

      const isCorrect = answer?.correctSlot === slotNumber;

      newStatuses[slotNumber] = isCorrect ? "correct" : "wrong";

      if (!isCorrect) {
        allCorrect = false;
      }
    });

    setStatuses(newStatuses);

    if (allCorrect) {
      setIsCompleted(true);

      onComplete?.();
    }
  }

  return (
    <div
      className="drag-question-page"
      style={{
        backgroundImage: `url(${dragBackground})`,
      }}
    >
      {/* שכבת החשכה */}
      <div className="drag-question-dark-overlay" />

      {/* חלונית השאלה */}
      <section className="drag-question-card">
        <h1 className="drag-question-title">{data.title}</h1>

        <p className="drag-question-instruction">- {data.instruction} -</p>

        {/* =========================
            אזורי יעד
        ========================= */}

        <div className="drag-targets">
          {slots
            .slice()
            .reverse()
            .map((slotNumber) => {
              const answerId = placements[slotNumber];

              const answer = answerId ? getAnswerById(answerId) : null;

              const status = statuses[slotNumber];

              const isDragOver = dragOverSlot === slotNumber;

              return (
                <div
                  key={slotNumber}
                  className={`
                    drag-target
                    ${answer ? "filled" : ""}
                    ${isDragOver ? "drag-over" : ""}
                    ${status === "correct" ? "correct" : ""}
                    ${status === "wrong" ? "wrong" : ""}
                  `}
                  onDragOver={(event) => handleDragOver(event, slotNumber)}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(event) => handleDrop(event, slotNumber)}
                >
                  {/* המספר תמיד מעל התשובה */}
                  <span className="drag-target-number">{slotNumber}</span>

                  {answer && (
                    <div
                      className="drag-answer-in-target"
                      draggable={status !== "correct" && !isCompleted}
                      onDragStart={(event) =>
                        handleDragStart(event, answer.id, slotNumber)
                      }
                      onDragEnd={handleDragEnd}
                    >
                      {answer.text}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* =========================
            בנק התשובות
        ========================= */}

        <div
          className={`
            drag-answer-bank
            ${canReturnToBank ? "return-active" : ""}
          `}
          onDragOver={handleBankDragOver}
          onDrop={handleBankDrop}
        >
          {data.answers
            .slice()
            .reverse()
            .map((answer) => {
              const isPlaced = placedAnswerIds.includes(answer.id);

              return (
                <div key={answer.id} className="drag-answer-home">
                  {isPlaced ? (
                    <div className="drag-answer-placeholder" />
                  ) : (
                    <div
                      className="drag-answer"
                      draggable={!isCompleted}
                      onDragStart={(event) => handleDragStart(event, answer.id)}
                      onDragEnd={handleDragEnd}
                    >
                      {answer.text}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* =========================
            בדיקה
        ========================= */}

        <button
          className="drag-check-btn"
          onClick={handleCheck}
          disabled={!allSlotsFilled || isCompleted}
        >
          {isCompleted ? "כל הכבוד!" : "בדיקה"}
        </button>
      </section>
    </div>
  );
}

export default DragQuestion;
