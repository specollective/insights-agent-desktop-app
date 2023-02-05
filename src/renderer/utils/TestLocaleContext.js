import React from 'react';
import i18n from 'renderer/utils/i18n';
import LocaleContext from 'renderer/utils/LocaleContext';

function TestLocaleContext({ children }) {
  const mockI18n = { locale: 'en', setLocale: jest.fn() };

  return (
    <LocaleContext.Provider value={mockI18n}>
      { children }
    </LocaleContext.Provider>
  )
}

export default TestLocaleContext;