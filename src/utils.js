// NodeJS Standard library depedencies
const os = require('os');
const { execSync } = require('child_process');

// Third party depedencies
const cron = require('node-cron');
const fetch = require('electron-fetch').default;
const Store = require('electron-store');

// Application dependencies
const { getActivityData } = require('./services/activity-data');
const { BASE_URL, DEFAULT_OPTIONS } = require('./constants/urls');

// Initialization
const store = new Store();
const hostname = os.hostname(); console.log(hostname);

const trackingCron = cron.schedule('*/5 * * * * *', () => {
  captureActivityData();
}, { scheduled: false });

// POST /api/send_access_code
async function sendAccessCode(phoneNumber, event) {
  try {
    // 1. Make post request to send access code.
    const response = await fetch(`${BASE_URL}/api/send_access_code`, {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    // 2. Confirm response is successful.
    if (response.ok) {
      // 3. Parse JSON response.
      const json = await response.json();
      // 4. Set study participant token in Electron store.
      store.set('USER_TOKEN', json.token);
      // 5. Emit Ipc message.
      event.sender.send('send-access-code-success', `success!`);
    } else {
      throw('Something went wrong');
    }
  } catch (e) {
    event.sender.send('send-access-code-error', `error`);
  }
}

// POST /api/confirm_access_code
async function confirmAccessCode(accessCode, event) {
  // 1. Grab user token from Electron store.
  const userToken = store.get('USER_TOKEN');

  // 2. Make post request to confirm access code.
  const response = await fetch(`${BASE_URL}/api/confirm_access_code`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
    body: JSON.stringify({
      access_code: accessCode,
      token: userToken,
    }),
  });

  // 3. Confirm the response is successful.
  if (response.ok) {
    // 4. Parse the JSON response.
    const json = await response.json()

    // 5. Set survey token in Electron store.
    store.set('SURVEY_TOKEN', json.survey_token);

    // 6. Emit IPC success message.
    event.sender.send('check-access-code-success', `processed: success!`);
  } else {
    event.sender.send('check-access-code-error', `error`);
   }

  return true;
}

function startTracking () {
  console.log('Tracking');

  trackingCron.start();

  return true;
}

function stopTracking () {
  trackingCron.stop();
}

async function captureActivityData () {
  const data = {
    token: store.get('SURVEY_TOKEN'),
    timestamp: new Date().toISOString(),
    url: 'http://example.com',
    tab_name: 'Example Website',
    application_name: 'Google Chrome',
  }

  try {
    const windowData = await getActivityData();
    store.set(data.timestamp, JSON.stringify(windowData));
  } catch (e) {
    store.set(data.timestamp, e);
  }

  // postEventData(data)
}

function postEventData (eventData) {
  return fetch(`${process.env['BACKEND_API_URL']}/api/data_entries/`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

module.exports = {
  sendAccessCode,
  confirmAccessCode,
  startTracking,
  stopTracking,
}
