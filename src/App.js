import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { submitFeedback } from './services/feedbackService';
import './App.css';

const initialValues = { name: '', email: '', feedback: '' };

function validate(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.feedback.trim()) {
    errors.feedback = 'Please share your feedback.';
  } else if (values.feedback.trim().length < 10) {
    errors.feedback = 'Feedback must be at least 10 characters.';
  } else if (values.feedback.trim().length > 1000) {
    errors.feedback = 'Feedback must be 1000 characters or fewer.';
  }

  return errors;
}

function App() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setSubmitted(false);
    setSubmitError('');
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitFeedback({
        name: values.name.trim(),
        email: values.email.trim(),
        feedback: values.feedback.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message || 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
    setSubmitError('');
  };

  return (
    <main className="feedback-page">
      <Container maxWidth="sm" className="feedback-container">
        <Paper className="feedback-card" elevation={0}>
          <Box className="form-heading">
            <span className="form-icon" aria-hidden="true">
              <RateReviewOutlinedIcon />
            </span>
            <Typography component="p" className="eyebrow">
              YOUR VOICE MATTERS
            </Typography>
            <Typography component="h1" variant="h4" className="form-title">
              Share your feedback
            </Typography>
            <Typography component="p" className="form-description">
              Tell us how we’re doing. Your thoughts help us make things better.
            </Typography>
          </Box>

          {submitted && (
            <Alert severity="success" className="success-message" role="status">
              Thank you, {values.name.trim()}! Your feedback has been received.
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" className="success-message" role="alert">
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              id="name"
              name="name"
              label="Name"
              placeholder="Your name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name || ' '}
            />
            <TextField
              fullWidth
              required
              id="email"
              name="email"
              label="Email address"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email || ' '}
            />
            <TextField
              fullWidth
              required
              id="feedback"
              name="feedback"
              label="Your feedback"
              placeholder="What would you like us to know?"
              multiline
              minRows={5}
              value={values.feedback}
              onChange={handleChange}
              error={Boolean(errors.feedback)}
              helperText={errors.feedback || 'At least 10 characters'}
              slotProps={{ htmlInput: { maxLength: 1000 } }}
            />

            <Box className="form-actions">
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit feedback'}
              </Button>
            </Box>
          </Box>
          <Typography component="p" className="privacy-note">
            Your feedback is only used to improve your experience.
          </Typography>
        </Paper>
      </Container>
    </main>
  );
}

export default App;
