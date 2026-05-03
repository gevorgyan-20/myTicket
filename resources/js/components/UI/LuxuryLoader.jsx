import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '../../../css/luxury-loader.css';

const LuxuryLoader = ({ onFinished }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const logoRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const shineRef = useRef(null);

    useGSAP(() => {
        // 1. Independent Shine Animation
        gsap.to(shineRef.current, {
            left: "150%",
            duration: 1.2,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 0.5
        });

        const tl = gsap.timeline({
            onComplete: () => {
                if (onFinished) onFinished();
            }
        });

        // Split text into spans for individual animation
        const titleChars = titleRef.current.innerText.split('');
        titleRef.current.innerHTML = titleChars
            .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('');
        
        const chars = titleRef.current.querySelectorAll('span');

        // Initial setup
        gsap.set([contentRef.current, logoRef.current, subtitleRef.current], { opacity: 0 });
        gsap.set(logoRef.current, { scale: 0.9, y: 15 });
        
        // Fast Sequence
        tl.to(contentRef.current, { opacity: 1, duration: 0.4, ease: "power2.inOut" })
          .to(logoRef.current, { 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              duration: 0.7, 
              ease: "expo.out" 
          }, "-=0.2")
          
          .to(chars, {
              y: 0,
              duration: 0.6,
              stagger: 0.03,
              ease: "expo.out"
          }, "-=0.4")
          
          .to(subtitleRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out"
          }, "-=0.3")
          
          // Pause briefly to let the brand settle
          .to({}, { duration: 0.8 })

          // Exit Sequence
          .to([logoRef.current, titleRef.current, subtitleRef.current], {
              opacity: 0,
              y: -30,
              duration: 0.4,
              ease: "power4.in",
              stagger: 0.05
          })
          .to(leftPanelRef.current, {
              x: "-100%",
              duration: 0.9,
              ease: "expo.inOut"
          })
          .to(rightPanelRef.current, {
              x: "100%",
              duration: 0.9,
              ease: "expo.inOut"
          }, "<")
          .to(containerRef.current, {
              opacity: 0,
              duration: 0.2
          });

    }, { scope: containerRef });

    // Mark as shown in session
    useEffect(() => {
        sessionStorage.setItem('hasShownLuxuryLoader', 'true');
    }, []);

    return (
        <div ref={containerRef} className="luxury-loader-container">
            <div ref={leftPanelRef} className="loader-panel left"></div>
            <div ref={rightPanelRef} className="loader-panel right"></div>
            <div className="loader-grain"></div>
            
            <div ref={contentRef} className="luxury-loader-content">
                <div className="loader-logo-container" ref={logoRef}>
                    <img src="/logo.png" alt="Logo" className="loader-logo-img" />
                    <div ref={shineRef} className="logo-shine"></div>
                </div>
                
                <h1 ref={titleRef} className="loader-title">MYTICKET</h1>
                <p ref={subtitleRef} className="loader-subtitle">Premier Entertainment Access</p>
            </div>
        </div>
    );
};

export default LuxuryLoader;
