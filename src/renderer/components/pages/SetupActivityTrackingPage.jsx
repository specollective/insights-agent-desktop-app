import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STATUSES = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

function ActivityTrackingStatusInstructions ({ status, error }) {
  const { t } = useTranslation()

  if (status === STATUSES.PENDING) {
    return (
      <div>
        <h1 className='py-2 text-2xl font-bold'>{t('setup.before')}</h1>
        <ul className='list-disc py-4 pl-10 text-lg '>
          <li>{t('setup.purpose')}</li>
          <li>{t('setup.privacy')}</li>
          <li>{t('setup.paid')}</li>
        </ul>
        <p className='py-2 text-lg'>
          {t('setup.agreement')}
        </p>
        <p className='py-2 text-base font-bold'>
          {t('setup.note')}
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
  }, [])

  return (
    <div className='grid place-content-center h-screen'>
      <ActivityTrackingStatusInstructions
        status={status}
        error={error}
      />
      <div className='float-right pt-8'>
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
