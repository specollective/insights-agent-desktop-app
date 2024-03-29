import path from 'path'
import fs from 'fs'
import ObjectsToCsv from 'objects-to-csv'
import jsonexport from 'jsonexport';

import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  shell,
} from 'electron'

import serialNumber from 'serial-number'
import * as Sentry from '@sentry/electron'

import {
  confirmAccessCode,
  confirmSerialNumber,
  sendAccessCode,
} from 'services/authentication'

import {
  startCron,
  startTracking,
  stopTracking,
} from 'services/activity-data'

import { DEVELOPMENT_MODE, DEBUG_MODE } from 'constants/environments'

import {
  DAILY_DATA_ENTRIES,
  DATA_ENTRIES,
  ONBOARDING_STEP,
  ONBOARDING_STEPS,
} from 'constants/configs'

import { log } from 'utils/logging'

// import makeMockAPI from './mock-api';
import Store from 'electron-store'

import i18next from 'i18next'
import translations from './translations'
import isOnline from 'is-online'

import { emitEvent } from './utils/sentry'

import {
  CONFIRM_ACCESS_CODE,
  CONFIRM_SERIAL_NUMBER,
  DOWNLOAD_DATA_SUCCESS,
  DOWNLOAD_DATA,
  EXIT_SURVEY,
  LOAD_STATE_SUCCESS,
  LOAD_STATE,
  MAIN_NAVIGATION,
  SEND_ACCESS_CODE,
  START_TRACKING,
  STOP_TRACKING,
  HIDE_APP,
} from './constants/events'

// TODO: Convert to ES6 syntax
require('update-electron-app')({ updateInterval: '5 minutes' })
require('dotenv').config()

// Initial Sentry for error reporting.
Sentry.init({
  dsn: process.env.SENTRY_URL,
  transportOptions: {
    // The maximum number of days to keep an event in the queue.
    maxQueueAgeDays: 30,
    // The maximum number of events to keep in the queue.
    maxQueueCount: 30,
    // Called every time the number of requests in the queue changes.
    queuedLengthChanged: (length) => {},
    // Called before attempting to send an event to Sentry. Used to override queuing behavior.
    //
    // Return 'send' to attempt to send the event.
    // Return 'queue' to queue and persist the event for sending later.
    // Return 'drop' to drop the event.
    beforeSend: async (request) => await isOnline() ? 'send' : 'queue'
  }
})

// Initialize an instance electron store.
const store = new Store()

// These are the only global variables we should have.
let appIcon, contextMenu, mainWindow, forceQuit

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit()
}

if (!DEVELOPMENT_MODE && !DEBUG_MODE) {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  })
}

const createWindow = async () => {
  const locale = app.getLocale()

  await i18next.init({
    lng: locale,
    debug: true,
    resources: translations,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // alwaysOnTop: true,
    // kiosk: true,
    autoHideMenuBar: true,
    fullscreenable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      preload: path.join(__dirname, '../renderer/preload.js'),
    },
  })

  mainWindow.removeMenu()

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  if (DEBUG_MODE) {
    mainWindow.webContents.openDevTools()
  }

  // Initial data entries store
  if (!store.get(DATA_ENTRIES)) {
    store.set(DATA_ENTRIES, [])
  }

  if (!store.get(DAILY_DATA_ENTRIES)) {
    store.set(DAILY_DATA_ENTRIES, [])
  }
  
  store.set('DATA_PATH', app.getPath('userData'))

  // Log your config path.
  log('APP_PATH', app.getPath('userData'))

  // Read the device's serial number
  serialNumber((error, value) => {
    log('SERIAL_NUMBER', value)

    store.set('SERIAL_NUMBER', value)
  })

  if (store.get(ONBOARDING_STEP) === ONBOARDING_STEPS.DASHBOARD) {
    startCron()
  }

  // Override minimize default functionality.
  mainWindow.on('minimize', function (windowEvent) {
    windowEvent.preventDefault()
    mainWindow.hide()
  });

  // Override close default functionality.
  mainWindow.on('close', function (windowEvent) {
    log('mainWindow.close')

    if (forceQuit) return true

    windowEvent.preventDefault()
    mainWindow.hide()

    return false
  })

  createTrayMenu()
}

const createTrayMenu = () => {
  appIcon = new Tray(path.join(__dirname, '../assets/icons/16x16.png'))
  const id = store.get('SERIAL_NUMBER')

  const menuActions = [
    {
      label: i18next.t('menu.open'),
      click() {
        mainWindow.show()
      },
    },
    {
      label: i18next.t('menu.quit'),
      click() {
        log('Quit app')

        if (mainWindow.isVisible()) {
          mainWindow.webContents.send(MAIN_NAVIGATION, '/exit')
        } else {
          mainWindow.show()
          mainWindow.webContents.send(MAIN_NAVIGATION, '/exit')
        }
      },
    },
  ]

  if (DEBUG_MODE) {
    menuActions.push({
      label: i18next.t('menu.clear'),
      click() {
        forceQuit = true
        store.clear()
        app.quit()
      },
    })
  }

  contextMenu = Menu.buildFromTemplate(menuActions)

  appIcon.setToolTip('Insights Agent')
  appIcon.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows and
// the tray menu. Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// TODO: Document whenReady
// app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', (event) => {
  log('before-quit');
})

async function downloadData(ipcEvent, options) {
  try {
    const dataEntries = store.get(DAILY_DATA_ENTRIES)
    const downloadPath = `${app.getPath('downloads')}/data.csv`
    
    try {
      const csv = await jsonexport(dataEntries, { rowDelimiter: ',' })
      fs.writeFileSync(downloadPath, csv)
    } catch (err) {
        console.error(err)
    }
    shell.openPath(downloadPath)
    ipcEvent.sender.send(DOWNLOAD_DATA_SUCCESS, true)
  } catch (error) {
    log(error)
    ipcEvent.sender.send('DOWNLOAD_DATA_ERROR', false)
  }
}

function loadState(ipcEvent) {
  ipcEvent.sender.send(LOAD_STATE_SUCCESS, {
    ONBOARDING_STEP: store.get(ONBOARDING_STEP),
  })
}

function exitSurvey(ipcEvent) {
  emitEvent(`User exited the survey ${store.get('SERIAL_NUMBER')}`)
  forceQuit = true
  stopTracking()
  store.clear()
  app.quit()
}

ipcMain.on(CONFIRM_SERIAL_NUMBER, (ipcEvent, options) => confirmSerialNumber(ipcEvent, options))
ipcMain.on(START_TRACKING, ipcEvent => startTracking(ipcEvent))
ipcMain.on(SEND_ACCESS_CODE, (ipcEvent, phoneNumber) => sendAccessCode(phoneNumber, ipcEvent))
ipcMain.on(CONFIRM_ACCESS_CODE, (ipcEvent, accessCode) => confirmAccessCode(accessCode, ipcEvent))
ipcMain.on(DOWNLOAD_DATA, (ipcEvent, options) => downloadData(ipcEvent, options))
ipcMain.on(HIDE_APP, () => mainWindow.hide())
ipcMain.on(LOAD_STATE, (ipcEvent) => loadState(ipcEvent))
ipcMain.on(EXIT_SURVEY, (ipcEvent) => exitSurvey(ipcEvent))
