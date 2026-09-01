import React from "react";
import "./BoxiTalk.css";

import boxiMoney from "../../assets/boxi.svg";
import managementRoles from "../../assets/managementRoles.svg";

function BoxiTalk({ data }) {
  const boxiImages = {
    boxiMoney: boxiMoney,
  };

  const contentImages = {
    managementRoles: managementRoles,
  };

  return (
    <div className="boxi-talk">
      <div className="boxi-speech">
        {data.eyebrow && (
          <p className="boxi-eyebrow">
            {data.eyebrow}
          </p>
        )}

        <h1 className="boxi-title">
          {data.title}
        </h1>

            {data.contentImage && (
              <img
                src={contentImages[data.contentImage]}
                alt=""
                className="boxi-content-image"
              />
            )}

        <div className="boxi-paragraphs">
          {data.paragraphs?.map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))}
        </div>

        {data.infoBox && (
          <div className="boxi-info-box">
            <p className="boxi-info-text">
              {data.infoBox.text}
            </p>

            {data.infoBox.source && (
              <span className="boxi-info-source">
                {data.infoBox.source}
              </span>
            )}
          </div>
        )}

        <div className="boxi-speech-arrow" />
      </div>

      <img
        src={boxiImages[data.boxiImage]}
        alt="בוקסי"
        className="boxi-character"
      />
    </div>
  );
}

export default BoxiTalk;