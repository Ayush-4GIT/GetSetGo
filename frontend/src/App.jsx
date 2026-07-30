import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ActivitiesProvider } from './context/ActivitiesContext';
import { NavBar } from './components/NavBar';
import { TodayView } from './views/TodayView';
import { ManageActivitiesView } from './views/ManageActivitiesView';
import { ProgressView } from './views/ProgressView';

function App() {
  return (
    <BrowserRouter>
      <ActivitiesProvider>
        <NavBar />
        <main className="app-container">
          <Routes>
            <Route path="/" element={<TodayView />} />
            <Route path="/activities" element={<ManageActivitiesView />} />
            <Route path="/progress" element={<ProgressView />} />
          </Routes>
        </main>
      </ActivitiesProvider>
    </BrowserRouter>
  );
}

export default App;
