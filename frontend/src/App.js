import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('login'); // login/register/search
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleAuth = async (endpoint) => {
    const res = await fetch(`http://localhost:5000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.message || data.error || '');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/reviews?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setMessage('');
      } else {
        setReviews([]);
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setMessage('Could not connect to backend');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>🏡 Review My Home</h1>

      {mode === 'login' || mode === 'register' ? (
        <>
          <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth(mode);
            }}
          >
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
          <button onClick={() => setMode('search')} style={{ marginTop: '1rem' }}>
            🔍 Go to Search Reviews
          </button>
        </>
      ) : (
        <>
          <h2>Search Reviews by Address</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <button type="submit" style={{ width: '100%' }}>
              Search Reviews
            </button>
          </form>
          <p style={{ marginTop: '1rem', color: 'red' }}>{message}</p>

          {reviews.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Reviews for: {address}</h3>
              {reviews.map((r, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                  <p><strong>User:</strong> {r.username}</p>
                  <p><strong>Rating:</strong> {r.rating}/5</p>
                  <p><strong>Comment:</strong> {r.comment}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => setMode('login')} style={{ marginTop: '1rem' }}>
            🔐 Back to Login/Register
          </button>
        </>
      )}
    </div>
  );
}

export default App;
