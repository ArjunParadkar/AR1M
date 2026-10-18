import * as Sentry from '@sentry/react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ImmersiveLayout from './redesign/ImmersiveLayout';
import Landing from './redesign/Landing';
import Hub from './redesign/Hub';
import Chamber from './redesign/Chamber';
import Founders from './redesign/Founders';
import Contact from './redesign/Contact';
import Hero from './components/Hero';
import WeeklyHighlights from './components/WeeklyHighlights';
import Navbar from './components/Navbar';
import VideoCarousel from './components/VideoCarousel';
import Footer from './components/Footer';
import BeltOfCollabs from './components/BeltOfCollabs';
import ContactForm from './components/ContactForm';
import AIPage from './components/Pages/AIPage';
import EngineeringPage from './components/Pages/EngineeringPage';
import SocialImpactPage from './components/Pages/SocialImpactPage';
import PartnersStrip from './components/PartnersStrip';
import WhyArenda from './components/WhyArenda';
import LabsPage1 from './components/Pages/LabsPage1';
import ExpoPage from './components/Pages/ExpoPage';
import ExpoSignup from './components/Pages/ExpoSignup';
const App = () => {
  const { pathname } = useLocation();
  const immersive = pathname === '/' || pathname === '/hub' || pathname === '/founder' || pathname === '/contact' || pathname.startsWith('/explore');
  return (
    <div className="scroll-smooth">
      {!immersive && <Navbar />}
      <Routes>
        <Route element={<ImmersiveLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/explore/:cat" element={<Chamber />} />
          <Route path="/founder" element={<Founders />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/legacy" element={
          <>
            <Hero/>
            <div className="relative z-10 bg-black">
            <WeeklyHighlights/>
            {/* <BeltOfCollabs/> */}
           
            {/* <PartnersStrip/> */}
            </div>
            
          </>
        } />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/engineering" element={<EngineeringPage />} />
        <Route path="/social-impact" element={<SocialImpactPage />} />
        <Route path="/labs" element={<LabsPage1 />} />
        <Route path="/expo" element={<ExpoPage />} />
        <Route path="/expo/signup" element={<ExpoSignup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!immersive && <Footer/>}
    </div>
  );
};

export default Sentry.withProfiler(App);
