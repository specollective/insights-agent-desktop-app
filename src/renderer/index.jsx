import React from 'react';
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

const ROUTES = {
  'SEND_ACCESS_CODE': '/',
  'SETUP': '/setup',
  'CONFIRM_ACCESS_CODE': '/confirm',
  'DASHBOARD': '/dashboard',
}

function App () {
  const initialRoute = ROUTES[window.api.onboardingStep]

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<SetupActivityTrackingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  )
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
