import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const LazySection = ({ children, fallback = null, threshold = 0.1, rootMargin = '50px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
};

LazySection.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
};

export { LazySection };
