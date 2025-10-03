import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen width and provide responsive breakpoints
 */
const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = () => {
    if (screenWidth <= 480) return 'mobile';
    if (screenWidth <= 768) return 'tablet';
    if (screenWidth <= 1024) return 'laptop';
    return 'desktop';
  };

  const isMobile = screenWidth <= 480;
  const isTablet = screenWidth > 480 && screenWidth <= 768;
  const isLaptop = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;

  return {
    screenWidth,
    breakpoint: getBreakpoint(),
    isMobile,
    isTablet,
    isLaptop,
    isDesktop
  };
};

export default useScreenWidth;
