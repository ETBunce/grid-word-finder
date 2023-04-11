import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./index.css";
import axios from "axios";
import GridGame from './components/GridGame';
import Results from './components/Results';
import Lobby from './components/Lobby';

function App(){
    axios.defaults.withCredentials = true;
  
    return (
      <div>
        <Routes>
            <Route exact path="/" element={<GridGame />} />
            <Route path="/results" element={<Results />} />
            <Route path="/lobby" element={<Lobby />} />
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