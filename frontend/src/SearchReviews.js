import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Rating
} from '@mui/material';

const SearchReviews = () => {
  const [address, setAddress] = useState('');
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

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
      setMessage('Server error');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Search Reviews by Address
      </Typography>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <TextField
          label="Enter address"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Search
        </Button>
      </form>

      {message && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      {reviews.length > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            {reviews.length} Review{reviews.length > 1 ? 's' : ''} Found:
          </Typography>

          <Typography variant="body2" gutterBottom>
            Average Rating: ⭐{" "}
            {(
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
             ).toFixed(1)} from {reviews.length} review{reviews.length > 1 ? 's' : ''}
          </Typography>


          {reviews.map((r, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
                <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    boxShadow: 3,
                    p: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                    transform: 'scale(1.02)',
                    },
                }}
                >
                {r.image && (
                    <CardMedia
                    component="img"
                    image={`http://localhost:5000/uploads/${r.image}`}
                    alt="Review"
                    sx={{
                        width: 140,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mr: 2,
                    }}
                    onError={(e) => (e.target.style.display = 'none')}
                    />
                )}

                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                    User: {r.username}
                    </Typography>

                    {/* Timestamp */}
                    {r.timestamp && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Posted on {new Date(r.timestamp).toLocaleString()}
                    </Typography>
                    )}

                    <Rating name="read-only" value={r.rating} readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {r.comment}
                    </Typography>
                </CardContent>
                </Card>
            </Box>
            ))}

        </>
      )}
    </Box>
  );
};

export default SearchReviews;
