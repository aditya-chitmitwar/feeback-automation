const FEEDBACK_API_URL = 'http://localhost:5000/api/feedback';

export async function submitFeedback(feedback) {
  const response = await fetch(FEEDBACK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });


  console.log('Response status:', response);
  if (!response.ok) {
    throw new Error('The feedback could not be submitted. Please try again.');
  }

  return response;
}
