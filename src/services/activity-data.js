// NodeJS Standard library depedencies
import os from 'os'
import { exec } from 'child_process'
import isOnline from 'is-online'

// Third party depedencies
import cron from 'node-cron'
import Store from 'electron-store'
// TODO: Determine if bugs with active-win can be resolved.
// const activeWindow = require('active-win');

// Application dependencies
import {
  postDataEntries,
  buildDataEntryFromWindowData,
} from 'services/data-entries'

import {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
} from 'constants/scripts'

import {
  ONBOARDING_STEP,
  ONBOARDING_STEPS,
  DATA_ENTRIES,
} from 'constants/configs'

import {
  START_TRACKING_SUCCESS,
  START_TRACKING_ERROR,
} from 'constants/events'

import { log } from 'utils/logging'

// Initialization the data store
export const store = new Store()
export const DATA_ENTRIES_KEY = 'DATA_ENTRIES'

export function cronTask(task) {
  captureActivityData();
}

// Initialize the tracking cron job
export const trackingCron = cron.schedule(
  '*/5 * * * * *',
  cronTask,
  { scheduled: false },
);

export function startCron() {
  trackingCron.start();
}

export function stopCron() {
  trackingCron.stop();
}

// Helper function for starting the tracking cron job.
export function stopTracking() {
  stopCron()
}

export function readObjectStore(key) {
  return store.get(key)
}

export function writeObjectStore(key, dataEntries) {
  store.set(key, dataEntries)
}

export function initObjectStore(key) {
  store.set(key, [])
}

// Helper method for testing the data entry tracking.
export async function testGetDataEntry() {
  log('testGetDataEntry');

  let dataEntry
  let dataEntryError

  try {
    dataEntry = await getDataEntry();
  } catch (e) {
    dataEntryError = e.message;
  }

  return [dataEntry, dataEntryError];
}

// Helper method for testing the data ingestion engine.
export async function testDataIngestion(dataEntry) {
  log('testDataIngestion');

  let response
  let responseError

  try {
    response = await postDataEntries([dataEntry]);

    if (!response.ok) {
      responseError = await response.text();
    }
  } catch (e) {
    responseError = e.message;
  }

  return [response, responseError];
}

// Helper function for testing if tracking is working.
export async function startTracking(ipcEvent) {
  log('startTracking');

  const [dataEntry, dataEntryError] = await testGetDataEntry()
  if (!dataEntry || dataEntryError) {
    log('Data entry error', dataEntryError)
    ipcEvent.sender.send(START_TRACKING_ERROR, dataEntryError)
    return
  }

  const [response, responseError] = await testDataIngestion(dataEntry)
  if (!response || responseError) {
    log('Request error', responseError)
    ipcEvent.sender.send(START_TRACKING_ERROR, responseError)
    return
  }

  if (!dataEntryError && !responseError) {
    log('Tests success, starting cron')
  }

  try {
    // Start cron job
    startCron()
    // Update onboarding step
    store.set(ONBOARDING_STEP, ONBOARDING_STEPS.DASHBOARD)
  } catch(e) {
    log('cron error', e.message)
    ipcEvent.sender.send(START_TRACKING_ERROR, e.message)
    return
  }

  ipcEvent.sender.send(START_TRACKING_SUCCESS, 'success')
}

// Generate the path to run the native executable.
export function trackingScriptPath() {
  if (os.platform() === 'win32') {
    return `${SCRIPTS_PATH}\\${WINDOWS_EXECUTABLE_PATH}`
  } else if (os.platform() === 'darwin') {
    return `osascript ${SCRIPTS_PATH}/${MAC_EXECUTABLE_PATH}`
  } else {
    throw(`Unsupported platform ${os.platform()}`)
  }
}

// Function for executing platform specific code to collect data.
// returns an array of data points.
export async function getDataEntry() {
  const scriptPath = trackingScriptPath()
  const isConnected = await isOnline()
  const redactor = new SyncRedactor()

  return new Promise((resolve, reject) => {
    exec(scriptPath, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      const rawData = stdout.toString('utf8').split('\n')
      const [appName, tabName, url] = rawData

      const windowData = {
        appName: appName === '\r' ? 'MISSING' : appName,
        tabName,
        url,
        isConnected,
      }

      const dataEntry = buildDataEntryFromWindowData(windowData);

      resolve(dataEntry);
    });
  });
}

export async function syncDataWithServer() {
  log('Syncing data with server...');

  const dataEntries = store.get(DATA_ENTRIES_KEY);

  try {
    const response = await postDataEntries(dataEntries);
    const json = await response.json();

    if (response.ok) {
      log(`Synced ${dataEntries.length} data entries`);
      store.set(DATA_ENTRIES, []);
    } else {
      log('Request error occurred');
      const errorMessage = await response.text();
      throw new Error(JSON.stringify(json));
    }
  } catch (e) {
    log('Unknown error occurred', e.message);
  }
}

// Function triggers data collection and posts it the API.
export async function captureActivityData() {
  log('capturing activity data');

  const isConnected = await isOnline();
  const dataEntries = store.get(DATA_ENTRIES);

  try {
    const dataEntry = await getDataEntry();
    dataEntries.push(dataEntry);
    store.set(DATA_ENTRIES, dataEntries);
  } catch (e) {
    log('An error occurred capturing data');
    log(e.message);
  }

  if (isConnected) {
    syncDataWithServer();
  }
}