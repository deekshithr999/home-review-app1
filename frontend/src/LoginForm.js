import React, { useState } from 'react';
import { Box, Button, TextField, Typography, ToggleButton, ToggleButtonGroup, Alert } from '@mui/material';

const LoginForm = ({ setUsername, onLogin }) => {
  const [mode, setMode] = useState('login'); // login or register
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === 'login' ? '/login' : '/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Something went wrong');
      } else {
        setMessage('');
        setUsername(usernameInput); // save to global app state
        localStorage.setItem('username', usernameInput);
        onLogin(); // redirect or switch view
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'login' ? 'Login' : 'Register'}
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, newMode) => newMode && setMode(newMode)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
