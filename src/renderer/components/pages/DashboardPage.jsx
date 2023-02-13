import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardStyles from '../styles/dashboard';
import { useTranslation } from 'react-i18next';

function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    window.api.onMainNavigation((routeName) => {
      navigate(routeName)
    })
  }, [])

  window.addEventListener('online', () => console.log('Became online'))
  window.addEventListener('offline', () => console.log('Became offline'))

  return (
    <>
      <section className='grid place-content-center h-screen text-lg'>
        <p>
          {t('dashboard.welcome')}
        </p><br />

        <p>
          {t('dashboard.contact')}
        </p><br />
          {t('dashboard.optout')}
        <p>
        </p><br />
        <div className='float-right pt-8 text-right'>
          <button className="p-2 text-xl underline w-40" onClick={window.api.hideApp}>
            {t('close')}
          </button>
          <button 
            className="rounded p-2 h-11 w-40 bg-[#70B443] text-xl font-semibold active:bg-green-600"
            onClick={window.api.downloadData}
          >
            Download Data
          </button>
        </div>
      </section>
    </>
  )
}

export default DashboardPage;
