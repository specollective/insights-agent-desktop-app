import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import SendAccessCodePage from 'renderer/components/pages/SendAccessCodePage';

describe('Send access code page', () => {
  it('renders expected copy', async () => {
    renderPage(<SendAccessCodePage />);

    expect(screen.getByText(/Please enter your phone number/i))
      .toBeInTheDocument();
  });

  it('sets IPC event listeners', () => {
    renderPage(<SendAccessCodePage />);

    expect(window.api.onSendAccessCodeSuccess).toHaveBeenCalled();
    expect(window.api.onSendAccessCodeError).toHaveBeenCalled();
  });

  it('sends IPC on successful submit', async () => {
    renderPage(<SendAccessCodePage />);

    expect(window.api.sendAccessCode).not.toHaveBeenCalled();

    const input = screen.getByLabelText('Please enter your phone number');

    fireEvent.change(input, {target: {value: '+18455914054'}});

    await userEvent.click(screen.getByText(/Next/));

    expect(window.api.sendAccessCode).toHaveBeenCalled();
  });
});
