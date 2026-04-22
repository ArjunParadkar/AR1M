import * as Sentry from '@sentry/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import WeeklyHighlights from './components/WeeklyHighlights';
import Navbar from './components/Navbar';
import VideoCarousel from './components/VideoCarousel';
import Footer from './components/Footer';
import BeltOfCollabs from './components/BeltOfCollabs';
import ResearchPage from './components/ResearchPage';
import ContactForm from './components/ContactForm';
import ContactPage from './components/Pages/ContactPage';
import FounderPage from './components/Pages/FounderPage';
import AIPage from './components/Pages/AIPage';
import EngineeringPage from './components/Pages/EngineeringPage';
import SocialImpactPage from './components/Pages/SocialImpactPage';
import DevelopmentBanner from './components/DevelopmentBanner';
import CommitmentToArkansas from './components/CommitmentToArkansas';
import PartnersStrip from './components/PartnersStrip';
import WhyArenda from './components/WhyArenda';
import LabsPage1 from './components/Pages/LabsPage1';
import ExpoPage from './components/Pages/ExpoPage';
import ExpoSignup from './components/Pages/ExpoSignup';
import ExpoBanner from './components/ExpoBanner';
const App = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <DevelopmentBanner />
      <Routes>
        <Route path="/" element={
          <>
            <Hero/>
            <WeeklyHighlights/>
            <ResearchPage/>
            {/* <BeltOfCollabs/> */}
           
            {/* <PartnersStrip/> */}
            <CommitmentToArkansas/>
            
          </>
        } />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/founder" element={<FounderPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/engineering" element={<EngineeringPage />} />
        <Route path="/social-impact" element={<SocialImpactPage />} />
        <Route path="/labs" element={<LabsPage1 />} />
        <Route path="/expo" element={<ExpoPage />} />
        <Route path="/expo/signup" element={<ExpoSignup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default Sentry.withProfiler(App);
