import React from "react";
import { Routes, Route } from "react-router-dom";

import OpeningPage from "./pages/OpeningPage/OpeningPage";
import LearningPage from "./pages/LearningPage/LearningPage";
import EndPage from "./pages/EndPage/EndPage";

import "./css/App.css";

function App() {
  return (
    <div className="app">
      <Routes>

        {/* פתיחת הלומדה */}
        <Route
          path="/"
          element={<OpeningPage />}
        />

        {/* הלומדה עצמה */}
        <Route
          path="/learning"
          element={<LearningPage />}
        />

        {/* סיום */}
        <Route
          path="/end"
          element={<EndPage />}
        />

      </Routes>
    </div>
  );
}

export default App;