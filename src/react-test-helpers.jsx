import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TestLocaleContext from './renderer/utils/TestLocaleContext';

export function renderPage(pageComponent) {
  return render(
    <TestLocaleContext>
      <MemoryRouter>
        {pageComponent}
      </MemoryRouter>
    </TestLocaleContext>
  );
}
