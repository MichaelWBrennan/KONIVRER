import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  timeout?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  timeout = 1500 
}) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading resources...');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;
    
    // Simulate loading progress
    interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        // Update loading message based on progress
        if (newProgress > 25 && newProgress < 50) {
          setMessage('Optimizing resources...');
        } else if (newProgress > 50 && newProgress < 75) {
          setMessage('Preparing interface...');
        } else if (newProgress > 75) {
          setMessage('Almost ready...');
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Set a minimum display time
    timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setMessage('Ready!');
      
      // Fade out the loading screen
      setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 500);
    }, timeout);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, timeout]);
  
  if (!visible) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#f2e8c9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      transition: 'opacity 0.5s ease-in-out',
      opacity: progress === 100 ? 0.5 : 1
    }}>
      <div className="ancient-scroll" style={{
        width: '80%',
        maxWidth: '500px',
        textAlign: 'center',
        padding: '30px',
        position: 'relative'
      }}>
        <h1 style={{ 
          color: '#3a2921', 
          marginBottom: '20px',
          fontSize: '28px'
        }}>
          KONIVRER Deck Database
        </h1>
        
        <p style={{ 
          color: '#3a2921', 
          marginBottom: '20px',
          fontSize: '16px'
        }}>
          Resource-Optimized Edition
        </p>
        
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#d9b38c',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #8b5a2b',
          marginBottom: '15px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#8b5a2b',
            transition: 'width 0.3s ease-in-out'
          }} />
        </div>
        
        <p style={{ 
          color: '#3a2921', 
          fontSize: '14px'
        }}>
          {message}
        </p>
        
        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#6b4423'
        }}>
          <p>System optimized for resource efficiency</p>
          <p>CPU usage limited • Memory usage optimized • Disk I/O reduced</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;