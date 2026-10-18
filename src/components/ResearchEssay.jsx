import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import ThreeDModel from './DodecahedronModel';
import BulletPoint from './BulletPoint';
gsap.registerPlugin(ScrollTrigger);


const ResearchEssay = () => {
    const essayRef = useRef(null);

    useEffect(() => {
      gsap.fromTo(essayRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: essayRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: 0.3
        }
      );
    }, []);
  
    return (
      <section className="bg-black text-white py-24 px-6 md:px-12 relative overflow-hidden w-full" id="research-essay">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
  
        <div className="w-full relative z-10">
          {/* Main Essay/Content Section */}
          <div ref={essayRef} className="w-full">
                                           <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Mission Statement */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <img src="/assets/images/ArendaLogo.svg" alt="Logo" width={24} height={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                  </div>
  
                  <ul className="space-y-6 text-lg md:text-xl text-white/90">
                    <BulletPoint 
                      text="We are an accelarator for student based research and development projects" 
                      color="blue" 
                    />
                    <BulletPoint 
                      text="Developing novel, high-impact STEM projects that shape the future" 
                      color="purple" 
                    />
                    <BulletPoint 
                      text="Give students the opportunity to work on Massive Projects and Connect with Industry Experts" 
                      color="blue" 
                    />
                    <BulletPoint 
                      text="Guiding students to become world-class innovators and builders" 
                      color="purple" 
                    />
                  </ul>
                </div>
  
                {/* Right side - Three.js Visual (now a component) */}
                <div className="relative aspect-video md:aspect-square flex items-center justify-center hidden md:block">
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white/5 p-4 flex items-center justify-center">
                    <ThreeDModel /> {/* Render the new component here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ResearchEssay;
  