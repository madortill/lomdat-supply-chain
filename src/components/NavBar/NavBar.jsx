import React from "react";
import "./NavBar.css";

function Navbar({
  topics,
  currentTopicIndex,
  completedTopics,
  highestUnlockedTopicIndex,
  onTopicClick,
}) {
  return (
    <nav className="learning-navbar">
      {topics.map((topic, index) => {
        const isCurrent = index === currentTopicIndex;

        const isCompleted = completedTopics.includes(topic.id);

        const isLocked = index > highestUnlockedTopicIndex;

        return (
          <button
            key={topic.id}
            className={`
              navbar-topic
              ${isCurrent ? "current" : ""}
              ${isCompleted ? "completed" : ""}
              ${isLocked ? "locked" : ""}
            `}
            disabled={isLocked}
            onClick={() => {
              if (!isLocked) {
                onTopicClick(topic.id);
              }
            }}
          >
            {/*
              גם אם הוא current,
              הוי עדיין מוצג.
            */}
            {isCompleted && <span className="navbar-check">✓</span>}

            <span className="navbar-topic-text">{topic.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navbar;
