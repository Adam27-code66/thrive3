import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ResultsPage from './pages/ResultsPage';
import IncidentsPage from './pages/IncidentsPage';
import DashboardPage from './pages/DashboardPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-cyan-500 selection:text-black">
          <Navbar />
          
          <main className="flex-1 px-4 lg:px-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyzer" element={<AnalyzerPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:incidentId" element={<IncidentDetailsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AnalysisProvider>
  );
}
