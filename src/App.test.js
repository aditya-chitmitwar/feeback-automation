import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('validates required feedback form fields', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));

  expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
  expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
  expect(screen.getByText('Please share your feedback.')).toBeInTheDocument();
});

test('posts valid feedback and resets the form', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<App />);

  fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
    target: { value: 'Alex Morgan' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
    target: { value: 'alex@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /your feedback/i }), {
    target: { value: 'The experience has been great so far.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
    'http://localhost:5000/api/feedback',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Morgan',
        email: 'alex@example.com',
        feedback: 'The experience has been great so far.',
      }),
    }
  ));
  expect(await screen.findByRole('status')).toHaveTextContent(
    /thank you, alex morgan/i
  );

  fireEvent.click(screen.getByRole('button', { name: /reset/i }));

  expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('shows an error when the feedback request fails', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false });
  render(<App />);

  fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
    target: { value: 'Alex Morgan' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
    target: { value: 'alex@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /your feedback/i }), {
    target: { value: 'The experience has been great so far.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    /feedback could not be submitted/i
  );
});
