import { app } from 'electron'
import escape from 'escape-path-with-spaces'

const processPath = escape(process.cwd())
const resourcePath = escape(process.resourcesPath)

export const SCRIPTS_PATH = app.isPackaged
    ? resourcePath
    : `${processPath}/scripts`

export const WINDOWS_EXECUTABLE_PATH = app.isPackaged
? 'build/windows-data-tracker.exe'
: 'windows-data-tracker/build/windows-data-tracker.exe'

export const MAC_EXECUTABLE_PATH = app.isPackaged
  ? 'program.scpt'
  : 'mac-data-tracker/program.scpt'
