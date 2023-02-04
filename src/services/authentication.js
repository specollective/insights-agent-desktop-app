// Third party depedencies
const fetch = require('electron-fetch').default;
const Store = require('electron-store');
const serialNumber = require('serial-number')

// Application dependencies
const { BASE_URL, DEFAULT_OPTIONS } = require('../constants/urls');

// Initialization
const store = new Store();

async function sendAccessCode(phoneNumber, event) {
  console.log('did this event attempt to re-render the main process?')
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

      // something might need to happen here, dunno, but it's here for now
      store.set('ONBOARDING_STEP', 'CONFIRM_ACCESS_CODE');

      // 5. Emit Ipc message.
      event.sender.send('send-access-code-success', `success!`);
    } else {
      throw('Something went wrong');
    }
  } catch (e) {
    console.log('error', e)
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
    const json = await response.json();

    // 5. Set survey token in Electron store.
    store.set('SURVEY_TOKEN', json.survey_id);
    store.set('SURVEY_ID', json.survey_id);
    store.set('SURVEY_TABLE_KEY', json.table_key);
    store.set('ONBOARDING_STEP', 'SETUP');

    // 6. Emit IPC success message.
    event.sender.send('check-access-code-success', `success`);
  } else {
    event.sender.send('check-access-code-error', `error`);
  }

  return true;
}

async function verifySerialNumber(serialNumber, event) {
  // 1. Grab user token from Electron store.
  const userToken = store.get("USER_TOKEN");

  //2. Get serial number from device
  serialNumber((error, serial) => {
     return serial
     console.log(`This is${serial}`);
   });

  // 3. Make post request to confirm serial number.
  const response = await fetch(`${BASE_URL}/api/validate_serial_number`, {
    ...DEFAULT_OPTIONS,
    method: "POST",
    body: JSON.stringify({
      serial_number: serialNumber,
      token: userToken,
    }),
  });

  // 4. Confirm the response is successful.
  if (response.ok) {
    // 5. Parse the JSON response.
    const json = await response.json();

    // 6. Set survey token in Electron store. Commenting out as it is related to survey
     store.set("SURVEY_TOKEN", json.survey_id);
     store.set("SURVEY_ID", json.survey_id);
     store.set("SURVEY_TABLE_KEY", json.table_key);
     store.set("ONBOARDING_STEP", "SETUP");

    // 7. Emit IPC success message.
    event.sender.send("check-access-code-success", `success`);
  } else {
    event.sender.send("check-access-code-error", `error`);
  }

  return true;
}

module.exports = {
  sendAccessCode,
  confirmAccessCode,
  verifySerialNumber,
};
