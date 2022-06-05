const { app } = require('electron');
const path = require('path');

const SCRIPTS_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'scripts')
    : path.join(__dirname, '../../scripts');

const WINDOWS_EXECUTABLE_PATH =
  'windows-data-tracker/windows-data-tracker.exe';

const MAC_EXECUTABLE_PATH = 'mac-data-tracker/program.scpt';

module.exports = {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
}
