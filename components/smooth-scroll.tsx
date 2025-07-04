"use client";

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    let isInitialLoad = true;

    // Prevent automatic scrolling on page load
    const preventInitialScroll = () => {
      if (isInitialLoad) {
        // Always scroll to top on initial page load
        window.scrollTo(0, 0);
        
        // Clear any hash from URL without triggering scroll
        if (window.location.hash) {
          const cleanUrl = window.location.pathname + window.location.search;
          history.replaceState(null, '', cleanUrl);
        }
        
        isInitialLoad = false;
      }
    };

    // Custom smooth scroll function
    const smoothScrollTo = (target: Element) => {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    };

    // Handle anchor link clicks
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      
      // Check if it's an anchor link
      if (target.tagName === 'A' && target.hash && target.hostname === window.location.hostname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(target.hash);
        if (targetElement) {
          smoothScrollTo(targetElement);
          
          // Update URL without triggering default scroll behavior
          const newUrl = window.location.pathname + window.location.search + target.hash;
          history.pushState(null, '', newUrl);
        }
      }
    };

    // Handle browser back/forward navigation
    const handlePopState = (e: PopStateEvent) => {
      if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          smoothScrollTo(targetElement);
        }
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Prevent default scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Add event listeners
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('popstate', handlePopState);
    
    // Handle initial page load
    preventInitialScroll();

    // Also prevent scroll on DOM content loaded
    const handleDOMContentLoaded = () => {
      preventInitialScroll();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    } else {
      preventInitialScroll();
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);

  return null;
}