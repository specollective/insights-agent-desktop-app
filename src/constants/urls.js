const { app } = require('electron')

// TODO: Use process.env['BACKEND_API_URL']
const BASE_URL = 'https://insights-agent-api.specollective.org'

const DEFAULT_OPTIONS = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
}

module.exports = {
  DEFAULT_OPTIONS,
  BASE_URL,
}
