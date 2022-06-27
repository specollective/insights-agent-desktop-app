import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SetupActivityTrackingPage() {
  const navigate = useNavigate();

  function handleSubmit () {
    window.api.startActivityTracking();
  }

  // useEffect(() => {
  //   window.api.onStartActivityTrackingSuccess((message) => {
  //     console.log(message);
  //   });
  //
  //   window.api.onStartActivityTrackingError((message) => {
  //     console.log(message);
  //   });
  //
  //   // https://patrickpassarella.com/blog/creating-electron-react-app;
  //   return () => window.api.removeAllListeners();
  // }, []);

  return (
    <div className="page">
      <p>
        By clicking the Start button, you are confirming to Start the Insights Agent monitoring.
      </p>

      <button onClick={handleSubmit}>Start</button>
    </div>
  )
}

export default SetupActivityTrackingPage;
