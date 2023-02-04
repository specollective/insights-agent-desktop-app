import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import SendAccessCodePage from './components/pages/SendAccessCodePage';
import ConfirmAccessCodePage from './components/pages/ConfirmAccessCodePage';
import SetupActivityTrackingPage from './components/pages/SetupActivityTrackingPage';
import DashboardPage from './components/pages/DashboardPage';
import i18n from './utils/i18n';
import LocaleContext from './utils/LocaleContext';
import Layout from './components/elements/Layout';

const ROUTES = {
  'SEND_ACCESS_CODE': '/',
  'SETUP': '/setup',
  'CONFIRM_ACCESS_CODE': '/confirm',
  'DASHBOARD': '/dashboard',
}

function App () {
  const initialRoute = ROUTES[window.api.onboardingStep]

  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en')

  useEffect(() => {
    localStorage.setItem('locale', locale)
    i18n.changeLanguage(locale)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Layout>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/" element={<SendAccessCodePage />} />
            <Route path="/confirm" element={<ConfirmAccessCodePage />} />
            <Route path="/setup" element={<SetupActivityTrackingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </MemoryRouter>
      </Layout>
    </LocaleContext.Provider>
  )
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
