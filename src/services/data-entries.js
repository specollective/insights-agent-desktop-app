const fetch = require('electron-fetch').default;
const { BASE_URL } = require('../constants/urls');
const Store = require('electron-store');

export const store = new Store();

export function postDataEntries (dataEntries) {
  const endpoint = `${BASE_URL}/api/data_entries/`

  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(dataEntries),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function buildDataEntryFromWindowData(windowData) {
  const { appName, tabName, url, isConnected } = windowData;

  return {
    application_name: appName,
    tab_name: tabName,
    url: url,
    internet_connection: isConnected ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
    token: store.get('SURVEY_TOKEN'),
  }
}

export function sanitizeUrl(rawUrl) {
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
