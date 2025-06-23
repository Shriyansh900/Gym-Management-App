import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate elements on scroll
      gsap.utils.toArray('.animate-on-scroll').forEach((element, index) => {
        gsap.fromTo(element, 
          {
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate cards with stagger
      gsap.utils.toArray('.card-animate').forEach((card, index) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 30,
            rotationX: -15
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Smooth scroll for navigation links
      gsap.utils.toArray('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            gsap.to(window, {
              duration: 1,
              scrollTo: target,
              ease: "power2.inOut"
            });
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
};

export const animatePageTransition = (element) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    }
  );
};

export const animateModal = (element, isOpen) => {
  if (isOpen) {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.9,
        y: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
      }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      ease: "power2.in"
    });
  }
};

export const animateStatsCounter = (element, endValue) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value);
    }
  });
};

export const animateHover = (element) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: 1.05,
    y: -5,
    duration: 0.3,
    ease: "power2.out"
  });

  return {
    play: () => tl.play(),
    reverse: () => tl.reverse()
  };
};