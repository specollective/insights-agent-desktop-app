const fetch = require('electron-fetch').default
const { BASE_URL } = require('../constants/urls')

function postDataEntry (eventData) {
  const endpoint = `${BASE_URL}/api/data_entries/`

  console.log('postDataEntry: ', endpoint);

  return fetch(endpoint, {
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
