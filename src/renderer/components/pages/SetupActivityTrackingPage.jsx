import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

function ActivityTrackingStatusInstructions ({ status, error }) {
  if (status === STATUSES.PENDING) {
    return (
      <div>
        <h1 className='py-8 text-2xl font-bold'>Before you click Start, please read this.</h1>
        <ul className='list-disc py-4 pl-10 text-lg '>
          <li>The purpose of this study is to collect data on how you use your computer.</li>
          <li>The data will be anonymized to ensure your privacy.</li>
          <li>You will be paid for taking part in this study.</li>
        </ul>
        <p className='py-2 text-lg'>
          By clicking on the Start button below, you agree that you are 18 years of age or older, have read the information above and are participating voluntarily.
        </p>
        <p className='py-2 text-base font-bold'>
          Note: You will need to be connected to the internet to begin the process. Once running, continuous connection is required.
        </p>
      </div>
    )
  }

  if (status === STATUSES.LOADING) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (status === STATUSES.ERROR) {
    return (
      <div>
        <h1>An error occurred.</h1>

        <div style={{ background: 'lightGray', width: '100%', padding: '2em' }}>
          { error }
        </div>
      </div>
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

  return (
    <div className="float-right py-5">
      <button className="bg-none pr-12" onClick={handleCancel}>Cancel</button>

      <button
        data-testid="action-button"
        className='rounded w-28 h-11 bg-[#70B443] text-xl font-semibold'
        disabled={disabled}
        onClick={handleSubmit}
      >
        <ActivityTrackingButtonText status={status} />
      </button>
    </div>
  )
}

function SetupActivityTrackingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUSES.PENDING);
  const [error, setError] = useState();

  function handleSubmit () {
    if (status === STATUSES.PENDING) {
      setStatus(STATUSES.LOADING);
      window.api.startActivityTracking();
    } else if (status === STATUSES.SUCCESS) {
      navigate('/dashboard');
    } else if (status === STATUSES.ERROR) {
      window.open('https://insights-agent-web-app.specollective.org/');
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
      // setStatus(STATUSES.SUCCESS);
      navigate('/dashboard');
    });

    window.api.onStartActivityTrackingError((message) => {
      setStatus(STATUSES.ERROR);
      setError(message);
    });

    // https://patrickpassarella.com/blog/creating-electron-react-app;
    return () => window.api.removeAllListeners();
  }, []);

  return (
    <div>
      <ActivityTrackingStatusInstructions
        status={status}
        error={error}
      />

      <ActivityTrackingActions
        status={status}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}

export default SetupActivityTrackingPage;
