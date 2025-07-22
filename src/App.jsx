import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import "./App.scss";
import { DefaultPage } from "./components/DefaultPage";


function App() {

  return (
    <Routes>
      <Route path="/*" element={<DefaultPage />} />
    </Routes>
  );
}

export default App;
