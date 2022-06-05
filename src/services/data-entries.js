const fetch = require('electron-fetch').default;

function postDataEntry (eventData) {
  return fetch(`${process.env['BACKEND_API_URL']}/api/data_entries/`, {
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
