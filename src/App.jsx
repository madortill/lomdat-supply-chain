import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import OpeningPage from "./pages/OpeningPage/OpeningPage";
import LearningPage from "./pages/LearningPage/LearningPage";
import EndPage from "./pages/EndPage/EndPage";

import { preloadAssets } from "./utils/preloadAssets";

import "./css/App.css";

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    preloadAssets().then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  if (!assetsLoaded) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />

        <p>טוענים את הלומדה...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<OpeningPage />}
        />

        <Route
          path="/learning"
          element={<LearningPage />}
        />

        <Route
          path="/end"
          element={<EndPage />}
        />
      </Routes>
    </div>
  );
}

export default App;