const { app } = require('electron')

const BASE_URL = process.env['BACKEND_API_URL']

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
