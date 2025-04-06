import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === 'login' ? '/login' : '/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Something went wrong');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error connecting to backend');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1>🏡 Review My Home</h1>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%' }}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>

      <button
        onClick={() => {
          setMessage('');
          setMode(mode === 'login' ? 'register' : 'login');
        }}
        style={{ marginTop: '1rem' }}
      >
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
}

export default App;
