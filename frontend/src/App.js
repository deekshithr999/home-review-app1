import React, { useState } from 'react';

function App() {
  const [mode, setMode] = useState('login'); // login, register, search, submit
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  const handleAuth = async (endpoint) => {
    const res = await fetch(`http://localhost:5000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setMessage(data.message || data.error || '');
    if (res.ok) {
      setMode('search');
    }
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, address, rating, comment }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || '');
      if (res.ok) {
        setRating(5);
        setComment('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error submitting review');
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
        </>
      ) : mode === 'search' ? (
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

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setMode('submit')} style={{ marginRight: '0.5rem' }}>
              ➕ Submit Review
            </button>
            <button onClick={() => setMode('login')}>🔐 Logout</button>
          </div>
        </>
      ) : mode === 'submit' ? (
        <>
          <h2>Submit a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <input
              type="text"
              placeholder="Home address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              required
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <textarea
              placeholder="Leave your comment..."
              value={comment}
              required
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            ></textarea>
            <button type="submit" style={{ width: '100%' }}>
              Submit Review
            </button>
          </form>
          <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>
          <button onClick={() => setMode('search')} style={{ marginTop: '1rem' }}>
            🔍 Back to Search
          </button>
        </>
      ) : null}
    </div>
  );
}

export default App;
