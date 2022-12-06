import React from 'react';
import dashboardStyles from '../styles/dashboard';

function DashboardPage() {
  return (
    <>
      <section className="page" style={dashboardStyles.dashboard}>
        <p>
          The Insights Agent is now running. By closing this window, you will not pause the study.
        </p>

        <p>
          If you are having trouble or have any questions, please contact tech4all@buildjustly.org.
        </p>

        <p>
          If you would like to opt out of this study, click the Pause button in the taskbar and follow instructions.
        </p>
      </section>

      <button style={dashboardStyles.close} onClick={window.close}>Close</button>
    </>
  )
}

export default DashboardPage;
