import React from 'react';
import {createRoot} from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./index.css";
import axios from "axios";
// import GridGame from './components/GridGame';
import Results from './components/Results';

function App(){
    axios.defaults.withCredentials = true;
  
    return (
      <div>
        <Routes>
            <Route path="/results" element={<Results />} />
          {/* <Route exact path="/" element={<GridGame />} />*/}
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