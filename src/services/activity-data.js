// NodeJS Standard library depedencies
import os from 'os'
import { execSync, exec } from 'child_process'
import isOnline from 'is-online'

// Third party depedencies
import cron from 'node-cron'
import fetch from 'electron-fetch'
import Store from 'electron-store'
// TODO: Determine if bugs with active-win can be resolved.
// const activeWindow = require('active-win');

// Application dependencies
import {
  postDataEntries,
  buildDataEntryFromWindowData,
} from './data-entries'

import { BASE_URL } from '../constants/urls'

import {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
} from '../constants/scripts'

let dataEntries = [];

// Initialization the data store
export const store = new Store();

export function cronTask(task) {
  captureActivityData();
}

// Initialize the tracking cron job
export const trackingCron = cron.schedule(
  '*/5 * * * * *',
  cronTask,
  { scheduled: false },
);

// Helper function for starting the tracking cron job.
export function stopTracking() {
  trackingCron.stop();
}

export function log(...args) {
  console.log(process.env['NODE_ENV']);
  console.log(...args);
}

// Helper function for testing if tracking is working.
export async function startTracking(ipcEvent) {
  log('startTracking');

  let dataEntry, response

  const errorMessages = [];

  function sendMessage(message, data) {
    if (ipcEvent) {
      ipcEvent.sender.send(message, JSON.stringify(data));
    } else {
      console.log('NO IPC MAIN PRESENT');
    }
  }

  if (store.get('ACTIVITY_TRACKING_ENABLED')) {
    trackingCron.start();
    sendMessage('start-tracking-success', 'success');
    return
  }

  log('getDataEntry');
  try {
    dataEntry = await getDataEntry();
    log('getDataEntrySuccess');
  } catch (e) {
    log('getDataEntryError', e.message);
    errorMessages.push(e.message);
    sendMessage('start-tracking-error', errorMessages);
    return
  }

  log('postDataEntries');
  try {
    const response = await postDataEntries([dataEntry]);
    log('postDataEntriesStatus', response.status);
  } catch (e) {
    log('postDataEntriesError', e.message);
    errorMessages.push(e.message);
    sendMessage('start-tracking-error', errorMessages);
    return
  }

  log('trackingCron');
  try {
    trackingCron.start();

    store.set('ACTIVITY_TRACKING_ENABLED', true);
    store.set('ONBOARDING_STEP', 'DASHBOARD');

    log('trackingCronSuccess');
  } catch (e) {
    log('trackingCronError', e.message);
    errorMessages.push(e.message);
    ipcEvent.sender.send('start-tracking-error', JSON.stringify(errorMessages));
    return
  }

  ipcEvent.sender.send('start-tracking-success', 'success');
}

export function trackingScriptPath() {
  if (os.platform() === 'win32') {
    return `${SCRIPTS_PATH}\\${WINDOWS_EXECUTABLE_PATH}`;
  } else if (os.platform() === 'darwin') {
    return `osascript ${SCRIPTS_PATH}/${MAC_EXECUTABLE_PATH}`;
  } else {
    throw(`Unsupported platform ${os.platform()}`);
  }
}

// Function for executing platform specific code to collect data.
// returns an array of data points.
export async function getDataEntry() {
  const scriptPath = trackingScriptPath();
  const isConnected = await isOnline();

  return new Promise((resolve, reject) => {
    exec(scriptPath, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      const rawData = stdout.toString('utf8').split('\n')

      const [appName, tabName, url] = rawData;

      const windowData = {
        appName,
        tabName,
        url,
        isConnected,
      }

      const dataEntry = buildDataEntryFromWindowData(windowData);

      resolve(dataEntry);
    });
  });
}

export function storeDataEntry(dataEntry) {
  store.set(dataEntry.timestamp, JSON.stringify(dataEntry));

  dataEntries.push(dataEntry);
}

export async function syncDataWithServer() {
  try {
    const response = await postDataEntries(dataEntries);
    const json = await response.json();

    if (response.status === 201) {
      dataEntries = [];
    } else {
      console.log(json);
    }
  } catch (e) {
    console.log(e.message);
  }
}

// Function triggers data collection and posts it the API.
export async function captureActivityData() {
  const isConnected = await isOnline();

  let dataEntry

  try {
    dataEntry = await getDataEntry();
  } catch (e) {
    dataEntry = {
      application_name: 'ERROR',
      tab_name: '',
      url: '',
      internet_connection: isConnected ? 'online' : 'offline',
      timestamp: new Date().toISOString(),
      token: store.get('SURVEY_TOKEN'),
    }
  }

  storeDataEntry(dataEntry);

  if (isConnected) {
    syncDataWithServer();
  }
}   