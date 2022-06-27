import React from 'react';
import { useNavigate } from 'react-router-dom';

function DebugActivityTrackingPage() {
  const navigate = useNavigate();

  function goToSettings() {
    navigate('/settings')
  }

  return (
    <div className="page">
      <h2>Something went wrong</h2>
    </div>
  )
}

export default DashboardPage;
