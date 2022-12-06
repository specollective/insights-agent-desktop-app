import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import SetupActivityTrackingPage from 'renderer/components/pages/SetupActivityTrackingPage';

let mockJest = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: jest.fn().mockImplementation(() => mockJest),
}));

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(<SetupActivityTrackingPage />);

    expect(screen.getByText(/Before you click Start, please read this./i))
      .toBeInTheDocument();
  });

  it('triggers start activity tracking', async () => {
    renderPage(<SetupActivityTrackingPage />);

    const button = screen.getByTestId("action-button");
    await userEvent.click(button);

    expect(window.api.startActivityTracking).toHaveBeenCalled();
  });

  it('navigates to dashboard', async () => {
    window.api.onStartActivityTrackingSuccess = callback => callback();

    renderPage(<SetupActivityTrackingPage />);

    expect(mockJest).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to error message when an error is raised', async () => {
    window.api.onStartActivityTrackingError = callback => callback('error message');

    renderPage(<SetupActivityTrackingPage />);

    expect(screen.getByText(/An error occurred./i)).toBeInTheDocument();
  });
});
