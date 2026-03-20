import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import KamarGrid from './components/KamarGrid';
import KamarDetail from './components/KamarDetail';
import Kwitansi from './components/Kwitansi';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<KamarGrid />} />
            <Route path="/kamar/:kamarId" element={<KamarDetail />} />
            <Route path="/kwitansi/:paymentId" element={<Kwitansi />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;