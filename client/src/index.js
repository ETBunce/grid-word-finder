import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./index.css";
import axios from "axios";
import GridGame from './components/GridGame';
import Results from './components/Results';
import LobbyScreen from './components/LobbyScreen';

function App(){
    axios.defaults.withCredentials = true;
  
    return (
        <Routes>
            <Route exact path="/" element={<LobbyScreen />} />
            <Route path="/results" element={<Results />} />
            <Route path="/game" element={<GridGame />}/>
        </Routes>
    );
  }
  
  const root = createRoot(document.getElementById("root"));
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );