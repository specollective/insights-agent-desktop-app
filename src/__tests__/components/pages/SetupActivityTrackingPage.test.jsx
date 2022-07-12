import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import SetupActivityTrackingPage from 'renderer/components/pages/SetupActivityTrackingPage';

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(
      <SetupActivityTrackingPage />
    );

    expect(screen.getByText(/Before you click Start, please read this!/i))
      .toBeInTheDocument();
  });

  it('renders expected copy', async () => {
    renderPage(
      <SetupActivityTrackingPage />
    );

    const button = screen.getByTestId("action-button");

    await userEvent.click(button);

    expect(window.api.startActivityTracking).toHaveBeenCalled();
  });
});
