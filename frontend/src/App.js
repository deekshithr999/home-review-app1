import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching from backend:', error));
  }, []);

  return (
    <div>
      <h1>🏡 Welcome to Review My Home</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
