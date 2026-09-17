import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';

/**
 * App — Root component
 * Currently renders the main dashboard.
 * Authentication routes and other pages can be added here later.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}
