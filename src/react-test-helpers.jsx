import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function renderPage(pageComponent) {
  return render(
    <MemoryRouter>
      {pageComponent}
    </MemoryRouter>
  );
}
