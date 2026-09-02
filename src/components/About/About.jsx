import React, { useState } from "react";
import "./About.css";

import aboutCharacter from "../../assets/keshet.svg";

function About() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`about-wrapper ${isOpen ? "open" : ""}`}>

      {/* כפתור אודות */}
      <button
        className="about-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "סגירת אודות" : "פתיחת אודות"}
      >
        <span className="about-toggle-icon">
          {isOpen ? "×" : "i"}
        </span>

        <span className="about-toggle-text">
          {isOpen ? "סגירה" : "אודות"}
        </span>
      </button>


      {/* חלונית אודות */}
      <div className="about-panel">
        <h2 className="about-main-title">
          מפתחת ראשית:
        </h2>

        <img
          src={aboutCharacter}
          alt=""
          className="about-character"
        />

        <p className="about-name">
          רב״ט קשת פרי
        </p>


        <h3 className="about-title">
          גרפיקה:
        </h3>

        <p className="about-name">
          רב״ט קשת פרי
        </p>


        <h3 className="about-title">
          מומחי תוכן:
        </h3>

        <p className="about-name">
          סמ״ר איתמר חלילי
        </p>

        <p className="about-name">
          רס״ל הדר בן דוד
        </p>


        <h3 className="about-title">
          רמ״ד טי״ל:
        </h3>

        <p className="about-name">
          סמ״ר קטיה מדבדב
        </p>


        <h3 className="about-title">
          גרסה:
        </h3>

        <p className="about-version">
          ספטמבר 2026
        </p>
      </div>

    </div>
  );
}

export default About;