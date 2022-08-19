const { app } = require('electron');
const path = require('path');

const SCRIPTS_PATH = app.isPackaged
    ? process.resourcesPath
    : `${process.cwd()}\\scripts`

const WINDOWS_EXECUTABLE_PATH = app.isPackaged
? 'win-x64/windows-data-tracker.exe'
: 'windows-data-tracker/bin/Debug/net6.0/win-x64/windows-data-tracker.exe';


const MAC_EXECUTABLE_PATH = app.isPackaged
  ? 'program.scpt'
  : 'mac-data-tracker/program.scpt';

module.exports = {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
}
