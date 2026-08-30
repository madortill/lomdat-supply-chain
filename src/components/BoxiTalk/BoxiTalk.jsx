import React from "react";
import "./BoxiTalk.css";

import boxiMoney from "../../assets/boxi.svg";


function BoxiTalk({ data }) {
  const boxiImages = {
    boxiMoney: boxiMoney
  };

  return (
    <div className="boxi-talk">

      <div className="boxi-speech">

        <p className="boxi-eyebrow">
          {data.eyebrow}
        </p>

        <h1 className="boxi-title">
          {data.title}
        </h1>


        <div className="boxi-paragraphs">
          {data.paragraphs.map((paragraph, index) => (
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