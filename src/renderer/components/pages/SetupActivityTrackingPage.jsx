import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'SUCCESS',
}

function ActivityTrackingStatusInstructions ({ status }) {
  if (status === STATUSES.PENDING) {
    return (
      <p>
        By clicking the Start button, you are confirming to Start the Insights Agent monitoring.
      </p>
    )
  }

  if (status === STATUSES.LOADING) {
    return (
      <p>
        Testing data collection
      </p>
    )
  }

  if (status === STATUSES.SUCCESS) {
    return (
      <p>
        Data collection activated
      </p>
    )
  }

  if (status === STATUSES.ERROR) {
    return (
      <p>
        Something went wrong.
      </p>
    )
  }
}

function ActivityTrackingButtonText({ status }) {
  if (status === STATUSES.LOADING) return 'Wait'
  if (status === STATUSES.SUCCESS) return 'Continue'
  if (status === STATUSES.ERROR) return 'Get help'

  return 'Start'
}

function ActivityTrackingActions({ status, handleSubmit, handleCancel }) {
  const disabled = status === STATUSES.LOADING ? true : false;

  console.log(disabled)
  // const disabled = false;

  return (
    <div className="tracking-actions">
      <button onClick={handleCancel}>Cancel</button>

      <button disabled={disabled} onClick={handleSubmit}>
        <ActivityTrackingButtonText status={status} />
      </button>
    </div>
  )
}

function SetupActivityTrackingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUSES.PENDING);

  function handleSubmit () {
    if (status === STATUSES.PENDING) {
      setStatus(STATUSES.LOADING);
      window.api.startActivityTracking();
    } else if (status === STATUSES.SUCCESS) {
      navigate('/dashboard')
    } else if (status === STATUSES.ERROR) {
      console.log('go to error page ')
    }
  }

  function handleCancel () {
  const confirmationMessage = `
    This action will quit the application and you will not be
    able to participate in the study.
  `
    if (window.confirm(confirmationMessage)) {
      window.api.cancelActivityTracking();
    }
  }

  useEffect(() => {
    window.api.onStartActivityTrackingSuccess((message) => {
      setStatus(STATUSES.SUCCESS);
    });

    window.api.onStartActivityTrackingError((message) => {
      setStatus(STATUSES.ERROR);
    });

    // https://patrickpassarella.com/blog/creating-electron-react-app;
    return () => window.api.removeAllListeners();
  }, []);

  return (
    <div className="page">
      <div className="tracking-details">
        <ActivityTrackingStatusInstructions status={status} />

        <ActivityTrackingActions
          status={status}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default SetupActivityTrackingPage;