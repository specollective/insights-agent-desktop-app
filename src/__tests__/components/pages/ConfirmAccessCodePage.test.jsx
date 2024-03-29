import React from 'react';
import { screen } from '@testing-library/react';
import { renderPage } from 'react-test-helpers';
import ConfirmAccessCodePage from 'renderer/components/pages/ConfirmAccessCodePage';
import TestLocaleContext from 'renderer/utils/TestLocaleContext';

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(<ConfirmAccessCodePage />);

    expect(screen.getByText(/Please enter your verification code/i)).toBeInTheDocument();
  });
});
