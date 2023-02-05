// Third party depedencies
import fetch from 'electron-fetch'
import Store from 'electron-store'

// Application dependencies
import { BASE_URL, DEFAULT_OPTIONS } from 'constants/urls'

import {
  ONBOARDING_STEP,
  ONBOARDING_STEPS,
  SURVEY_ID,
  SURVEY_TABLE_KEY,
  SURVEY_TOKEN,
  USER_TOKEN,
} from 'constants/configs'

import {
  SEND_ACCESS_CODE_ERROR,
  SEND_ACCESS_CODE_SUCCESS,
  CONFIRM_ACCESS_CODE_SUCCESS,
  CONFIRM_ACCESS_CODE_ERROR,
  CONFIRM_SERIAL_NUMBER_SUCCESS,
  CONFIRM_SERIAL_NUMBER_ERROR,
} from 'constants/events'

import { log } from 'utils/logging'

// Initialization
const store = new Store()

// Triggers sending a text message with an access code.
// POST /api/send_access_code
export async function sendAccessCode(phoneNumber, event) {
  try {
    // 1. Make post request to send access code.
    const response = await fetch(`${BASE_URL}/api/send_access_code`, {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    // 2. Confirm response is successful.
    if (response.ok) {
      // 3. Parse JSON response.
      const json = await response.json()
      // 4. Set study participant token in Electron store.
      store.set(USER_TOKEN, json.token)
      // something might need to happen here, dunno, but it's here for now
      store.set(ONBOARDING_STEP, ONBOARDING_STEPS.CONFIRM_ACCESS_CODE)
      // 5. Emit Ipc message.
      event.sender.send(SEND_ACCESS_CODE_SUCCESS, `success!`)
    } else {
      throw('Something went wrong')
    }
  } catch (e) {
    log('error', e)
    event.sender.send(SEND_ACCESS_CODE_ERROR, 'error')
  }
}

// Handles when a user enters an access code.
// POST /api/confirm_access_code
export async function confirmAccessCode(accessCode, ipcEvent) {
  // 1. Grab user token from Electron store.
  const userToken = store.get(USER_TOKEN)

  // 2. Make post request to confirm access code.
  const response = await fetch(`${BASE_URL}/api/confirm_access_code`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
    body: JSON.stringify({
      access_code: accessCode,
      token: userToken,
    }),
  })

  // 3. Confirm the response is successful.
  if (response.ok) {
    // 4. Parse the JSON response.
    const json = await response.json()

    // 5. Set survey token in Electron store.
    store.set(SURVEY_TOKEN, json.survey_id)
    store.set(SURVEY_ID, json.survey_id)
    store.set(SURVEY_TABLE_KEY, json.table_key)
    store.set(ONBOARDING_STEP, ONBOARDING_STEPS.SETUP)

    // 6. Emit IPC success message.
    ipcEvent.sender.send(CONFIRM_ACCESS_CODE_SUCCESS, `success`)
  } else {
    ipcEvent.sender.send(CONFIRM_ACCESS_CODE_ERROR, `error`)
  }

  return true
}

// Handles confirming if the device's serial number is register.
// POST /api/confirm_serial_number
export async function confirmSerialNumber(ipcEvent, options) {
  // 1. Make post request to confirm access code.
  const response = await fetch(`${BASE_URL}/api/confirm_serial_number`, {
    ...DEFAULT_OPTIONS,
    method: 'POST',
    body: JSON.stringify({
      serial_number: store.get('SERIAL_NUMBER'),
    }),
  })

  // 2. Confirm the response is successful.
  if (response.ok) {
    // 3. Parse the JSON response.
    const json = await response.json()

    // 4. Set survey token in Electron store.
    store.set(SURVEY_TOKEN, json.survey_id)
    store.set(SURVEY_ID, json.survey_id)
    store.set(SURVEY_TABLE_KEY, json.table_key)
    store.set(ONBOARDING_STEP, ONBOARDING_STEPS.SETUP)

    // 5a. Emit IPC success message.
    ipcEvent.sender.send(CONFIRM_SERIAL_NUMBER_SUCCESS, `success`)
  } else {
    const json = await response.json()
    // 5b. Emit IPC error mesage.
    ipcEvent.sender.send(CONFIRM_SERIAL_NUMBER_ERROR, json.message)
  }

  return true
}
