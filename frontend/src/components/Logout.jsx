import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutStatus, setLogoutStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/logout', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const message = await response.text();
          setLogoutStatus('success');
          setIsLoggingOut(false);
          
          // Optional: Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setLogoutStatus('error');
          setIsLoggingOut(false);
        }
      } catch (error) {
        console.error('Logout error:', error);
        setLogoutStatus('error');
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLoginAgain = () => {
    window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify';
  };

  if (isLoggingOut) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <h2 style={styles.title}>Logging you out...</h2>
          <p style={styles.subtitle}>Please wait while we securely log you out</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {logoutStatus === 'success' ? (
          <>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.title}>You have been logged out</h1>
            <p style={styles.subtitle}>
              Your session has been securely terminated. Thank you for using our Spotify playlist analyzer!
            </p>
            <div style={styles.buttonGroup}>
              <button 
                style={{...styles.button, ...styles.primaryButton}} 
                onClick={handleGoHome}
              >
                Go to Home
              </button>
              <button 
                style={{...styles.button, ...styles.secondaryButton}} 
                onClick={handleLoginAgain}
              >
                Login Again
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.errorIcon}>❌</div>
            <h1 style={styles.title}>Logout Failed</h1>
            <p style={styles.subtitle}>
              There was an issue logging you out. Please try again or close your browser.
            </p>
            <div style={styles.buttonGroup}>
              <button 
                style={{...styles.button, ...styles.primaryButton}} 
                onClick={handleGoHome}
              >
                Go to Home
              </button>
              <button 
                style={{...styles.button, ...styles.retryButton}} 
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1ED760 0%, #1db954 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '2rem',
  },
  
  card: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    maxWidth: '500px',
    width: '100%',
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1ED760',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 2rem',
  },
  
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  
  title: {
    color: '#2c3e50',
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
  },
  
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    margin: '0 0 2rem 0',
    lineHeight: 1.5,
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  button: {
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    minWidth: '150px',
  },
  
  primaryButton: {
    background: '#1ED760',
    color: '#ffffff',
  },
  
  secondaryButton: {
    background: '#ffffff',
    color: '#1ED760',
    border: '2px solid #1ED760',
  },
  
  retryButton: {
    background: '#e74c3c',
    color: '#ffffff',
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 480px) {
    .logout-button-group {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Logout;