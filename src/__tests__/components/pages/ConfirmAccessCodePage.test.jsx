import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import ConfirmAccessCodePage from 'renderer/components/pages/ConfirmAccessCodePage';

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(<ConfirmAccessCodePage />);

    expect(screen.getByText(/Please enter your verification code/i)).toBeInTheDocument();
  });
});
