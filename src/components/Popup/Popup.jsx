import React from "react";
import { createPortal } from "react-dom";
import "./Popup.css";

function Popup({ data, image, onClose }) {
  if (!data) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className={`content-popup ${data.layout || "side"}`}>
        <button
          className="popup-close"
          onClick={onClose}
          aria-label="סגירה"
        >
          ×
        </button>

        <h2 className="popup-title">
          {data.title}
        </h2>

        <div className="popup-body">
          <div className="popup-text">
            {data.paragraphs?.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>
                {paragraph.parts ? (
                  paragraph.parts.map((part, partIndex) =>
                    part.bold ? (
                      <strong key={partIndex}>
                        {part.text}
                      </strong>
                    ) : (
                      <span key={partIndex}>
                        {part.text}
                      </span>
                    )
                  )
                ) : (
                  <>
                    {paragraph.bold && (
                      <>
                        <strong>{paragraph.bold}</strong>{" "}
                      </>
                    )}

                    {paragraph.text && (
                      <span>{paragraph.text}</span>
                    )}
                  </>
                )}
              </p>
            ))}
          </div>

          {image && (
            <img
              src={image}
              alt=""
              className="popup-image"
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Popup;