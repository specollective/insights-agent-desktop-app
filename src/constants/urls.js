const { app } = require('electron')
const path = require('path')

const SCRIPTS_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts')
    : path.join(__dirname, '../../scripts')

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
  SCRIPTS_PATH,
}
