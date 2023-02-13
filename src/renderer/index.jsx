import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import SendAccessCodePage from './components/pages/SendAccessCodePage';
import ConfirmAccessCodePage from './components/pages/ConfirmAccessCodePage';
import SetupActivityTrackingPage from './components/pages/SetupActivityTrackingPage';
import DashboardPage from './components/pages/DashboardPage';
import ExitPage from './components/pages/ExitPage';
import i18n from './utils/i18n';
import LocaleContext from './utils/LocaleContext';
import { ROUTES } from '../constants/routes';

function App () {
  // console.log('App', window.api.onboardingStep);

  const initialRoute = ROUTES['LANDING_PAGE']
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en')

  useEffect(() => {
    localStorage.setItem('locale', locale)
    i18n.changeLanguage(locale)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<SetupActivityTrackingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exit" element={<ExitPage />} />
          <Route path="/send-access-code" element={<SendAccessCodePage />} />
          <Route path="/confirm-access-code" element={<ConfirmAccessCodePage />} />
        </Routes>
      </MemoryRouter>
    </LocaleContext.Provider>
  )
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
