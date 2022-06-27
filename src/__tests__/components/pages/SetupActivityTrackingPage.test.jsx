import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import SetupActivityTrackingPage from 'renderer/components/pages/SetupActivityTrackingPage';

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(<SetupActivityTrackingPage />);

    expect(screen.getByText(/By clicking the Start button/i))
      .toBeInTheDocument();
  });
});
