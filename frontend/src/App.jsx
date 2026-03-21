import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Materials from './pages/Materials';
import Quiz from './pages/Quiz';
import Summarizer from './pages/Summarizer';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/summarizer" element={<Summarizer />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
