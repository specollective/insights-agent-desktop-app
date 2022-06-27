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
// Initialize the tracking cron job
export const trackingCron = cron.schedule('*/5 * * * * *', () => {
  captureActivityData();
}, { scheduled: false });

// Helper function for starting the tracking cron job.
export function startTracking (ipcEvent) {
  trackingCron.start();

  return true;
}

// Helper function for starting the tracking cron job.
export function stopTracking () {
  trackingCron.stop();

  return true;
}

// Helper function for testing if tracking is working.
export async function testTracking (ipcEvent) {
  let trackingWorking, windowData, errorMessage;

  startTracking();

  // try {
  //   const windowData = await execActivityDataTracking();
  //   ipcEvent.sender.send('start-tracking-success', windowData[0]);
  // } catch (e) {
  //   errorMessage = e.message;
  //   return false
  // }
}

export function activityDataSync () {
  return { status: 'success '}
}

export function trackingScriptPath () {
  if (os.platform() === 'win32') {
    return `${SCRIPTS_PATH}/${WINDOWS_EXECUTABLE_PATH}`;
  } else if (os.platform() === 'darwin') {
    return `osascript ${SCRIPTS_PATH}/${MAC_EXECUTABLE_PATH}`;
  } else {
    throw(`Unsupported platform ${os.platform()}`);
  }
}

// Function for executing platform specific code to collect data.
// returns an array of data points.
export async function execActivityDataTracking() {
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

export async function collectData() {
  try {
    const dataEntry = await execActivityDataTracking();
    return dataEntry;
  } catch (e) {
    console.log(e.message);
  }
}

export function storeDataEntry (dataEntry) {
  store.set(dataEntry.timestamp, JSON.stringify(dataEntry));
  dataEntries.push(dataEntry);
}

export async function syncDataWithServer () {
  try {
    await postDataEntries(dataEntries);
    dataEntries = [];
  } catch (e) {
    console.log(e.message);
  }
}

// Function triggers data collection and posts it the API.
export async function captureActivityData () {
  const isConnected = await isOnline();
  const dataEntry = await collectData();

  storeDataEntry(dataEntry);

  if (isConnected) {
    syncDataWithServer();
  }
}
