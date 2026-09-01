import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LearningPage.css";

import data from "../../data/data.json";

import PageRenderer from "../../components/PageRenderer/PageRenderer";
import Navbar from "../../components/NavBar/NavBar";

import til from "../../assets/til-glow.svg";
import bahad6 from "../../assets/logo-glow.svg";

const LEARNING_STORAGE_KEY = "supplyChain-learningProgress";

function LearningPage() {
  const navigate = useNavigate();

  const pages = data.pages;
  const topics = data.topics;

  /* =========================================
     טעינת התקדמות
  ========================================= */

  const [savedProgress] = useState(() => {
    try {
      const saved = sessionStorage.getItem(LEARNING_STORAGE_KEY);

      if (!saved) {
        return {};
      }

      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  /* =========================================
     העמוד הנוכחי
  ========================================= */

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = savedProgress.currentPage;

    /*
        הגנה במקרה שה-JSON השתנה
        והעמוד השמור כבר לא קיים.
      */
    if (
      typeof savedPage === "number" &&
      savedPage >= 0 &&
      savedPage < pages.length
    ) {
      return savedPage;
    }

    return 0;
  });

  /* =========================================
     עמודים שהושלמו
  ========================================= */

  const [completedPageIds, setCompletedPageIds] = useState(
    savedProgress.completedPageIds || []
  );

  /* =========================================
     נושאים שהושלמו
  ========================================= */

  const [completedTopics, setCompletedTopics] = useState(
    savedProgress.completedTopics || []
  );

  /* =========================================
     הנושא הכי רחוק שנפתח
  ========================================= */

  const [highestUnlockedTopicIndex, setHighestUnlockedTopicIndex] = useState(
    savedProgress.highestUnlockedTopicIndex ?? 0
  );

  const currentPageData = pages[currentPage];

  const currentTopicIndex = topics.findIndex(
    (topic) => topic.id === currentPageData.topic
  );

  /* =========================================
     האם אפשר ללחוץ הבא?
  ========================================= */

  /*
    אם העמוד לא דורש השלמה -
    אפשר לעבור ישר.

    אם הוא כן דורש השלמה -
    הוא חייב להיות בתוך completedPageIds.
  */
  const canContinue =
    !currentPageData.requiresCompletion ||
    completedPageIds.includes(currentPageData.id);

  /* =========================================
     שמירת כל התקדמות הלומדה
  ========================================= */

  useEffect(() => {
    sessionStorage.setItem(
      LEARNING_STORAGE_KEY,
      JSON.stringify({
        currentPage,
        completedPageIds,
        completedTopics,
        highestUnlockedTopicIndex,
      })
    );
  }, [
    currentPage,
    completedPageIds,
    completedTopics,
    highestUnlockedTopicIndex,
  ]);

  /* =========================================
     לחיצה על Navbar
  ========================================= */

  function handleTopicClick(topicId) {
    const firstPageIndex = pages.findIndex((page) => page.topic === topicId);

    if (firstPageIndex !== -1) {
      setCurrentPage(firstPageIndex);
    }
  }

  /* =========================================
     פעילות הסתיימה
  ========================================= */

  function handlePageComplete() {
    setCompletedPageIds((prev) => {
      if (prev.includes(currentPageData.id)) {
        return prev;
      }

      return [...prev, currentPageData.id];
    });
  }

  /* =========================================
     הבא
  ========================================= */

  function handleNext() {
    if (!canContinue) return;

    const currentTopicId = currentPageData.topic;

    /*
      יש עוד עמוד אחרי הנוכחי
    */
    if (currentPage < pages.length - 1) {
      const nextPage = pages[currentPage + 1];

      /*
        אם ה-topic של העמוד הבא
        שונה מה-topic הנוכחי,
        סימן שסיימנו נושא.
      */
      if (nextPage.topic !== currentTopicId) {
        setCompletedTopics((prev) => {
          if (prev.includes(currentTopicId)) {
            return prev;
          }

          return [...prev, currentTopicId];
        });

        const nextTopicIndex = topics.findIndex(
          (topic) => topic.id === nextPage.topic
        );

        setHighestUnlockedTopicIndex((prev) => Math.max(prev, nextTopicIndex));
      }

      setCurrentPage((prev) => prev + 1);

      return;
    }

    /*
      זה היה העמוד האחרון בלומדה,
      ולכן גם הנושא האחרון הושלם.
    */
    setCompletedTopics((prev) => {
      if (prev.includes(currentTopicId)) {
        return prev;
      }

      return [...prev, currentTopicId];
    });

    navigate("/end");
  }

  /* =========================================
     הקודם
  ========================================= */

  function handleBack() {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="learning-page">
      {/* =========================
          Navbar
      ========================= */}

      <Navbar
        topics={topics}
        currentTopicIndex={currentTopicIndex}
        completedTopics={completedTopics}
        highestUnlockedTopicIndex={highestUnlockedTopicIndex}
        onTopicClick={handleTopicClick}
      />

      {/* =========================
          לוגואים
      ========================= */}

      <div className="learning-logos">
        <img src={bahad6} alt='בה"ד 6' className="learning-bahad-logo" />

        <img src={til} alt='מדור טי"ל' className="learning-til-logo" />
      </div>

      {/* =========================
          התוכן המשתנה
      ========================= */}

      <main className="learning-content">
        <PageRenderer
          /*
            key חשוב!
            אם יהיו שתי קומפוננטות
            מאותו type אחת אחרי השנייה,
            React יאתחל כל עמוד בנפרד
            ויטען את ה-sessionStorage שלו.
          */
          key={currentPageData.id}
          page={currentPageData}
          onComplete={handlePageComplete}
        />
      </main>

      {/* =========================
          הבא
      ========================= */}

      <button
        className="learning-nav-btn learning-next-btn"
        onClick={handleNext}
        disabled={!canContinue}
      >
        הבא &gt;
      </button>

      {/* =========================
          הקודם
      ========================= */}

      <button
        className="learning-nav-btn learning-back-btn"
        onClick={handleBack}
      >
        &lt; הקודם
      </button>
    </div>
  );
}

export default LearningPage;
