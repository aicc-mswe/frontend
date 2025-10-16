import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import AboutPage from './pages/AboutPage/AboutPage';
import TeamPage from './pages/TeamPage/TeamPage';
import ContactPage from './pages/ContactPage/ContactPage';
import AppPage from './pages/AppPage/AppPage';
import RecommendationHistoryPage from './pages/RecommendationHistoryPage/RecommendationHistoryPage';
import RecommendationResultPage from './pages/RecommendationResultPage/RecommendationResultPage';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/recommendation-history" element={<RecommendationHistoryPage />} />
        <Route path="/results" element={<RecommendationResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
