import fetch from 'electron-fetch'
import { INGESTION_URL } from 'constants/urls'
import Store from 'electron-store'

const store = new Store();

export function postDataEntries (dataEntries) {
  return fetch(INGESTION_URL, {
    method: 'POST',
    body: JSON.stringify({ data: dataEntries }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/*
  * This function takes the window data and returns a data entry object.
  * @param {Object} windowData - The window data object.
  * @param {String} windowData.appName - The name of the application.
  * @param {String} windowData.tabName - The name of the tab.
  * @param {String} windowData.url - The url of the tab.
  * @param {Boolean} windowData.isConnected - The internet connection status.
  * @returns {Object} - The data entry object.
*/
export function buildDataEntryFromWindowData(windowData) {
  const { appName, tabName, url, isConnected } = windowData;

  return {
    survey_id: store.get('SURVEY_ID'),
    table_key: store.get('SURVEY_TABLE_KEY'),
    token: store.get('SURVEY_TOKEN'),
    application_name: appName,
    tab_name: tabName,
    url: sanitizeUrl(url),
    internet_connection: isConnected ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
  }
}

export function sanitizeUrl(rawUrl) {
  if (!rawUrl || rawUrl === '') return ''

  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname;
    const protocol = url.protocol;

    return `${protocol}//${hostname}`
  } catch(e) {
    return ''
  }
}
