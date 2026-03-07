import React, { useState, useEffect } from 'react';

export default function ProgressBar({ isRunning, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Reading file…');

  const labels = ['Reading file…', 'Parsing content…', 'Almost ready…', 'Done!'];

  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      setProgressLabel('Reading file…');
      return;
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (currentProgress < 25) setProgressLabel(labels[0]);
      else if (currentProgress < 50) setProgressLabel(labels[1]);
      else if (currentProgress < 75) setProgressLabel(labels[2]);
      else setProgressLabel(labels[3]);

      if (currentProgress >= 100) {
        setProgress(100);
        setProgressLabel(labels[3]);
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  if (!isRunning && progress === 0) return null;

  return (
    <div className="progress-container show" id="progressContainer">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-label">{progressLabel}</div>
    </div>
  );
}
