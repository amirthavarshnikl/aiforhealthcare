import React, { useState, useEffect } from 'react';

export default function Toast({ message, duration = 2500 }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    <div className={`toast ${isVisible ? 'visible' : ''}`}>
      <span className="toast-text">{message}</span>
    </div>
  );
}
