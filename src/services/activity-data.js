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
const trackingCron = cron.schedule('*/5 * * * * *', () => {
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

function sanitizeUrl(rawUrl) {
  if (!rawUrl || rawUrl === '') return '';

  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname;
    const protocol = url.protocol;

    return `${protocol}//${hostname}`;
  } catch(e) {
    return ''
  }
}

// Function triggers data collection and posts it the API.
async function captureActivityData () {
  const isConnected = await isOnline();

  // Create new data entry object;
  const dataEntry = {
    token: store.get('SURVEY_TOKEN'),
    timestamp: new Date().toISOString(),
    url: '',
    tab_name: '',
    application_name: '',
    internet_connection: isConnected ? 'online' : 'offline',
  }

  // Collect system data
  try {
    const windowData = await getActivityData();
    const [applicationName, tabName, url] = windowData;

    dataEntry.application_name = applicationName;
    dataEntry.tab_name = tabName;
    dataEntry.url = sanitizeUrl(url);
  } catch (e) {
    console.log(e)
  }

  if (process.env['DEVELOPMENT']) {
    console.log('DATA ENTRY: ', dataEntry)
  }

  store.set(dataEntry.timestamp, JSON.stringify(dataEntry));

  // if (isConnected) {
  //   try {
  //     const response = await postDataEntry(dataEntry)
  //     console.log(response.status)
  //     const text = await response.text()
  //     console.log(text);
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
}

module.exports = {
  getActivityData,
  startTracking,
  stopTracking,
}
