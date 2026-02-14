
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CreatePage } from './pages/CreatePage';
import { LockerPage } from './pages/LockerPage';
import { OwnerPage } from './pages/OwnerPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreatePage />} />
        <Route path="/locker/:slug" element={<LockerPage />} />
        <Route path="/owner/:ownerToken" element={<OwnerPage />} />
        <Route path="/" element={<Navigate to="/create" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
