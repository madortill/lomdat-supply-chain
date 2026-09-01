import React, { useEffect, useState } from "react";
import "./OptionsQuestion.css";
import answerBox from "../../assets/answer-box.svg";

function OptionsQuestion({ data, onComplete }) {
  const storageKey = `supplyChain-optionsQuestion-${data.id}`;

  const [animateCorrect, setAnimateCorrect] = useState(false);

  /* =========================================
     טעינת מצב שמור
  ========================================= */

  const [savedState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);

      if (!saved) return {};

      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  const [isCompleted, setIsCompleted] = useState(
    savedState.isCompleted || false
  );

  const [correctAnswerId, setCorrectAnswerId] = useState(
    savedState.correctAnswerId || null
  );

  const [wrongAnswerId, setWrongAnswerId] = useState(null);

  /*
    מפתח קטן כדי לאפשר לאנימציית הטעות
    לפעול שוב אם לוחצים שוב.
  */
  const [wrongAnimationKey, setWrongAnimationKey] = useState(0);

  /* =========================================
     שמירה
  ========================================= */

  useEffect(() => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        isCompleted,
        correctAnswerId,
      })
    );
  }, [isCompleted, correctAnswerId, storageKey]);

  /* =========================================
     אם נטען מה-sessionStorage כפתור שכבר נפתר
  ========================================= */

  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  /* =========================================
     לחיצה על תשובה
  ========================================= */

  function handleAnswerClick(answer) {
    if (isCompleted) return;

    if (answer.correct) {
      setWrongAnswerId(null);

      setCorrectAnswerId(answer.id);
      setIsCompleted(true);

      // האנימציה מתרחשת רק עכשיו
      setAnimateCorrect(true);

      return;
    }

    setWrongAnswerId(answer.id);
    setWrongAnimationKey((prev) => prev + 1);
  }

  return (
    <div className="options-question-page">
      <section className="options-question-card">
        <h1 className="options-question-title">{data.title}</h1>

        {data.question && (
          <p className="options-question-question">{data.question}</p>
        )}

        {data.instruction && (
          <p className="options-question-instruction">- {data.instruction} -</p>
        )}

        <div className="options-question-answers">
          {data.answers.map((answer) => {
            const isCorrect = correctAnswerId === answer.id;

            const isWrong = wrongAnswerId === answer.id;

            return (
              <button
                key={isWrong ? `${answer.id}-${wrongAnimationKey}` : answer.id}
                className={`
                    option-answer
                    ${isCorrect ? "correct" : ""}
                    ${isCorrect && animateCorrect ? "correct-animate" : ""}
                    ${isWrong ? "wrong" : ""}
                  `}
                onClick={() => handleAnswerClick(answer)}
                onAnimationEnd={() => {
                  if (isCorrect) {
                    setAnimateCorrect(false);
                  }
                }}
                disabled={isCompleted}
              >
                {/* הצורה הגרפית */}
                <span
                  className="option-answer-shape"
                  style={{
                    WebkitMaskImage: `url(${answerBox})`,
                    maskImage: `url(${answerBox})`,
                  }}
                />

                {/* הטקסט */}
                <span className="option-answer-text">{answer.text}</span>

                {/* וי קטן כשנכון */}
                {isCorrect && <span className="option-answer-check">✓</span>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default OptionsQuestion;
