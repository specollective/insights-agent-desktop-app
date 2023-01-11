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
          If you are having trouble or have any questions, please contact tech4all@buildjustly.org.
        </p><br />

        <p>
          If you would like to opt out of this study, click the Pause button in the taskbar and follow instructions.
        </p><br />
        <div className='float-right pt-8'>
          <button style={dashboardStyles.close} onClick={window.close}>Close</button>
        </div>
      </section>
    </>
  )
}

export default DashboardPage;
