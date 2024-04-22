// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateTreePage from './pages/CreateTreePage';
import CreateRelationPage from './pages/CreateRelationPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/create-tree" element={<CreateTreePage />} />
          <Route path="/create-relation" element={<CreateRelationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
