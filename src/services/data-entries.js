const fetch = require('electron-fetch').default
const { BASE_URL } = require('../constants/urls')

function postDataEntry (eventData) {
  return fetch(`${BASE_URL}/api/data_entries/`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

module.exports = {
  postDataEntry,
}
