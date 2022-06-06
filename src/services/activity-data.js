// NodeJS Standard library depedencies
const os = require('os');
const { execSync } = require('child_process');
const isOnline = require('is-online');

// Third party depedencies
const cron = require('node-cron');
const fetch = require('electron-fetch').default;
const Store = require('electron-store');
// TODO: Determine if bugs with active-win can be resolved.
// const activeWindow = require('active-win');

// Application dependencies
const { postDataEntry } = require('./data-entries');
const { BASE_URL } = require('../constants/urls');

const {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
} = require('../constants/scripts');

// Initialization the data store
const store = new Store();
// Initialize the tracking cron job
const trackingCron = cron.schedule('*/2 * * * * *', () => {
  captureActivityData();
}, { scheduled: false });

// Helper function for starting the tracking cron job.
function startTracking () {
  trackingCron.start();

  return true;
}

// Helper function for starting the tracking cron job.
function stopTracking () {
  trackingCron.stop();

  return true;
}

// Function for executing platform specific code to collect data.
// returns an array of data points.
async function getActivityData() {
  if (os.platform() === 'win32') {
    const stdout = execSync(`${SCRIPTS_PATH}/${WINDOWS_EXECUTABLE_PATH}`, {
      windowsHide: true,
    });
    return stdout.toString('utf8').split('\n');
  } else if (os.platform() === 'darwin') {
    const stdout = execSync(`osascript ${SCRIPTS_PATH}/${MAC_EXECUTABLE_PATH}`);
    return stdout.toString('utf8').split('\n');
  } {
    throw('Unsupported platform')
  }
}

// Function triggers data collection and posts it the API.
async function captureActivityData () {
  const isConnected = await isOnline();

  const dataEntry = {
    token: store.get('SURVEY_TOKEN'),
    timestamp: new Date().toISOString(),
    url: 'http://example.com',
    tab_name: 'Example Website',
    application_name: 'Google Chrome',
    online: isConnected,
  }

  try {
    const windowData = await getActivityData();
    const [applicationName, tabName, url] = windowData;

    dataEntry.application_name = applicationName;
    dataEntry.tab_name = tabName;
    dataEntry.url = url;

    if (process.env['DEVELOPMENT']) {
      console.log('DATA ENTRY: ', dataEntry)
    }

    if (isConnected) {
      postDataEntry(dataEntry)

      // Optional local DB for debugging
      store.set(dataEntry.timestamp, JSON.stringify(dataEntry));
    } else {
      console.log('Handle offline mode')
    }
  } catch (e) {
    store.set(data.timestamp, e);
    console.log(e);
  }
}

module.exports = {
  getActivityData,
  startTracking,
  stopTracking,
}
