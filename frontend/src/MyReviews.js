import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Button
} from '@mui/material';


  

const MyReviews = ({ username }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/my-reviews?username=${username}`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to fetch my reviews', err);
      }
    };

    if (username) {
      fetchMyReviews();
    }
  }, [username]);

  const handleDelete = async (review) => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;
  
    try {
      const res = await fetch('http://localhost:5000/delete-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          address: review.address,
          comment: review.comment
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(reviews.filter((r) => r.comment !== review.comment));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting review");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant="body1">You haven't posted any reviews yet.</Typography>
      ) : (
        reviews.map((r, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Card sx={{ display: 'flex', p: 2, boxShadow: 3 }}>
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
                    mr: 2
                  }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {r.address}
                </Typography>
                <Rating name="read-only" value={r.rating} readOnly />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {r.comment}
                </Typography>
                <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleDelete(r)}
                >
                    Delete
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))
      )}
    </Box>
  );
};

export default MyReviews;
