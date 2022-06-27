import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from 'react-test-helpers';
import DashboardPage from 'renderer/components/pages/DashboardPage';

describe('Send access code page', () => {
  it('renders expected copy', () => {
    renderPage(<DashboardPage />);

    expect(screen.getByText(/The Insights Agent is now running./i)).toBeInTheDocument();
  });
});
