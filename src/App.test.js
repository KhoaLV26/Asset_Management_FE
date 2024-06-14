import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders Home link', () => {
  render(
      <App />
  );
  const linkElement = screen.getByText(/Manage User/i);
  expect(linkElement).toBeInTheDocument();
});
