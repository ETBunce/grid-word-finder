import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import axios from "axios";
// import GridGame from './components/GridGame';
// import HighScores from './components/HighScores';
// import SubmitScore from './components/SubmitScore';

function App(){
    axios.defaults.withCredentials = true;
  
    return (
      <div>
        <Routes>
          {/* <Route exact path="/" element={<GridGame />} />  
          <Route path="high-scores" element={<HighScores />} />
          <Route path="submit-score" element={<SubmitScore />} /> */}
        </Routes>
      </div>
    );
  }
  
  const root = createRoot(document.getElementById("root"));
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );