import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LearningPage.css";

import data from "../../data/data.json";

import PageRenderer from "../../components/PageRenderer/PageRenderer";
import Navbar from "../../components/Navbar/NavBar";

import til from "../../assets/til-glow.svg";
import bahad6 from "../../assets/logo-glow.svg";

function LearningPage({ onFinish, onBackToOpening }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [canContinue, setCanContinue] = useState(true);

  const pages = data.pages;

  const currentPageData = pages[currentPage];

  const topics = data.topics;

  const [completedTopics, setCompletedTopics] = useState([]);
  const [highestUnlockedTopicIndex, setHighestUnlockedTopicIndex] = useState(0);

  const currentTopicIndex = topics.findIndex(
    (topic) => topic.id === currentPageData.topic
  );

  function handleTopicClick(topicId) {
    const firstPageIndex = pages.findIndex(
      (page) => page.topic === topicId
    );
  
    if (firstPageIndex !== -1) {
      setCurrentPage(firstPageIndex);
    }
  }

  useEffect(() => {
    if (currentPageData.requiresCompletion) {
      setCanContinue(false);
    } else {
      setCanContinue(true);
    }
  }, [currentPageData]);

  function handleNext() {
    if (!canContinue) return;
  
    const currentTopicId = currentPageData.topic;
  
    if (currentPage < pages.length - 1) {
      const nextPage = pages[currentPage + 1];
  
      // אם העמוד הבא שייך לנושא אחר,
      // סימן שסיימנו את הנושא הנוכחי
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
  
        setHighestUnlockedTopicIndex((prev) =>
          Math.max(prev, nextTopicIndex)
        );
      }
  
      setCurrentPage((prev) => prev + 1);
    } else {
      // גם הנושא האחרון הושלם
      setCompletedTopics((prev) => {
        if (prev.includes(currentTopicId)) {
          return prev;
        }
  
        return [...prev, currentTopicId];
      });
  
      navigate("/end");
    }
  }

  function handleBack() {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      navigate("/");
    }
  }

  function handlePageComplete() {
    setCanContinue(true);
  }

  return (
    <div className="learning-page">
      <Navbar
        topics={topics}
        currentTopicIndex={currentTopicIndex}
        completedTopics={completedTopics}
        highestUnlockedTopicIndex={highestUnlockedTopicIndex}
        onTopicClick={handleTopicClick}
      />

      {/* לוגואים */}
      <div className="learning-logos">
        <img src={bahad6} alt='בה"ד 6' className="learning-bahad-logo" />

        <img src={til} alt='מדור טי"ל' className="learning-til-logo" />
      </div>

      {/* התוכן המשתנה */}
      <main className="learning-content">
        <PageRenderer page={currentPageData} onComplete={handlePageComplete} />
      </main>

      {/* כפתור הבא */}
      <button
        className="learning-nav-btn learning-next-btn"
        onClick={handleNext}
        disabled={!canContinue}
      >
        הבא &gt;
      </button>

      {/* כפתור הקודם */}
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
