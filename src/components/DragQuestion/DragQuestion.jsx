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
    אלה מצבים זמניים בלבד ולכן
    אין צורך לשמור אותם ב-sessionStorage
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

  function getAnswerById(answerId) {
    return data.answers.find((answer) => answer.id === answerId);
  }

  /* =========================================
     התחלת גרירה
  ========================================= */

  function handleDragStart(answerId, fromSlot = null) {
    if (isCompleted) return;

    // תשובה שכבר נכונה ננעלת
    if (fromSlot !== null && statuses[fromSlot] === "correct") {
      return;
    }

    setDraggedItem({
      answerId,
      fromSlot,
    });
  }

  /* =========================================
     גרירה מעל יעד
  ========================================= */

  function handleDragOver(event, slotNumber) {
    event.preventDefault();

    if (!draggedItem) return;

    // יעד שכבר נכון לא ניתן להחלפה
    if (statuses[slotNumber] === "correct") {
      return;
    }

    setDragOverSlot(slotNumber);
  }

  /* =========================================
     שחרור על יעד
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

      // מפנים את המקום הישן
      if (fromSlot !== null) {
        delete next[fromSlot];
      }

      /*
        אם גוררים בין שני יעדים מלאים,
        התשובות מתחלפות ביניהן.
      */
      if (answerAlreadyInTarget && fromSlot !== null) {
        next[fromSlot] = answerAlreadyInTarget;
      }

      /*
        תשובה שמגיעה מבנק התשובות
        לא דורסת יעד שכבר מלא.
      */
      if (answerAlreadyInTarget && fromSlot === null) {
        return prev;
      }

      next[targetSlot] = answerId;

      return next;
    });

    /*
      אם מזיזים תשובה אדומה,
      מסירים את מצב הבדיקה הישן.
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

  function handleDragEnd() {
    setDraggedItem(null);
    setDragOverSlot(null);
  }

  /* =========================================
     בדיקה
  ========================================= */

  function handleCheck() {
    if (!allSlotsFilled || isCompleted) return;

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

      // מודיעים ל-LearningPage
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
                      onDragStart={() => handleDragStart(answer.id, slotNumber)}
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

        <div className="drag-answer-bank">
          {data.answers
            .slice()
            .reverse()
            .map((answer) => {
              const isPlaced = placedAnswerIds.includes(answer.id);

              return (
                <div key={answer.id} className="drag-answer-home">
                  {isPlaced ? (
                    /*
                      המקום המקורי נשאר גם אחרי
                      שהתשובה נגררה.
                    */
                    <div className="drag-answer-placeholder" />
                  ) : (
                    <div
                      className="drag-answer"
                      draggable={!isCompleted}
                      onDragStart={() => handleDragStart(answer.id)}
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
