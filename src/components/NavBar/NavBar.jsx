import React from "react";
import "./Navbar.css";

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

        let status = "";

        if (isLocked) {
          status = "locked";
        } else if (isCurrent) {
          status = "current";
        } else if (isCompleted) {
          status = "completed";
        }

        return (
          <button
            key={topic.id}
            className={`navbar-topic ${status}`}
            disabled={isLocked}
            onClick={() => !isLocked && onTopicClick(topic.id)}
          >
            {isCompleted && !isCurrent && (
              <span className="navbar-check">✓</span>
            )}

            <span className="navbar-topic-text">
              {topic.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navbar;