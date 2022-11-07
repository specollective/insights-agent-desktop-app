const { app } = require('electron');
const path = require('path');
const escape = require('escape-path-with-spaces');

const processPath = escape(process.cwd());

const SCRIPTS_PATH = app.isPackaged
    ? process.resourcesPath
    : `${processPath}/scripts`

const WINDOWS_EXECUTABLE_PATH = app.isPackaged
? 'build/windows-data-tracker.exe'
: 'windows-data-tracker/build/windows-data-tracker.exe';

const MAC_EXECUTABLE_PATH = app.isPackaged
  ? 'program.scpt'
  : 'mac-data-tracker/program.scpt';

module.exports = {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
}
