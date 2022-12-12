import React from 'react';
import dashboardStyles from '../styles/dashboard';

function DashboardPage() {
  return (
    <>
      <section className='grid place-content-center h-screen text-lg'>
        <p>
          The Insights Agent is now running. By closing this window, you will not pause the study.
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
