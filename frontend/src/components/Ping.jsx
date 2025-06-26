import React, { useState, useEffect } from 'react';

const Ping = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/ping', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          setMessage('Failed to reach backend.');
        }
      } catch (error) {
        setMessage('An error occurred.');
      }
    };

    fetchPing();
  }, []);

  return (
    <div>
      <h1>Ping Backend</h1>
      <p>{message}</p>
    </div>
  );
};

export default Ping;