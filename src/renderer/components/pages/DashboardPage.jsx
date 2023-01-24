import React from 'react';
import dashboardStyles from '../styles/dashboard';
import { useTranslation } from 'react-i18next';

function DashboardPage() {
  const { t } = useTranslation();

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
        <div className='float-right pt-8'>
          <button style={dashboardStyles.close} onClick={window.close}>{t('dashboard.close')}</button>
        </div>
      </section>
    </>
  )
}

export default DashboardPage;
