import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import GlobalStyle from "styles";

const Home = lazy(() => import("pages/Home"));
const Pokemon = lazy(() => import("pages/Pokemon"));
const Canvas = lazy(() => import("pages/Canvas"));

const App: React.FC = () => (
  <main>
    <GlobalStyle />
    <Suspense fallback={<span>loading</span>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </Suspense>
  </main>
);

export default App;
