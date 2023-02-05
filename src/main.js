import path from 'path'

import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
} from 'electron'

import serialNumber from 'serial-number'

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

import { DEVELOPMENT_MODE } from 'constants/environments'

import {
  DATA_ENTRIES,
  ONBOARDING_STEP,
  ONBOARDING_STEPS,
} from 'constants/configs'

import { log } from 'utils/logging'

// import makeMockAPI from './mock-api';
import Store from 'electron-store'

import i18next from 'i18next'
import translations from './translations';

import {
  SEND_ACCESS_CODE,
  CONFIRM_ACCESS_CODE,
  CONFIRM_SERIAL_NUMBER,
  START_TRACKING,
  STOP_TRACKING,
} from './constants/events'

// TODO: Convert to ES6 syntax
require('update-electron-app')({ updateInterval: '5 minutes' })
require('dotenv').config()

// NOTE: Depending on the environment you are running in, you may need to
// change comment out these lines for manual testing.
// const useMockApi = process.env.USE_MOCK_API === 'true';
// if (useMockApi && isDevelopment) {
//   makeMockAPI({ environment: 'development' });
// }

const store = new Store()

// These are the only global variables we should have.
let appIcon, contextMenu, mainWindow, forceQuit

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit()
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
    autoHideMenuBar: true,
    fullscreenable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  if (DEVELOPMENT_MODE) {
    mainWindow.webContents.openDevTools()
  }

  // Initial data entries store
  store.set(DATA_ENTRIES, []);

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
    windowEvent.preventDefault();
    mainWindow.hide();
  });

  // Override close default functionality.
  mainWindow.on('close', function (windowEvent) {
    if (forceQuit) return true;

    windowEvent.preventDefault();
    mainWindow.hide();

    return false;
  });
};

const createTrayMenu = () => {
  appIcon = new Tray(path.join(__dirname, '/assets/icons/buildJUSTLYicon.png'));

  const menuActions = [
    {
      label: i18next.t('menu.dashboard'),
      click() {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }

        mainWindow.show();
      },
    },
    {
      label: i18next.t('menu.quit'),
      click() {
        forceQuit = true
        stopTracking()
        app.quit()
      },
    },
    {
      label: i18next.t('menu.clear'),
      click() {
        forceQuit = true
        store.clear()
        app.quit()
      },
    },
  ]

  contextMenu = Menu.buildFromTemplate(menuActions)

  appIcon.setToolTip('Insights Agent')
  appIcon.setContextMenu(contextMenu)
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// TODO: Document whenReady
app.whenReady().then(createTrayMenu);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// app.on('before-quit', (event) => {
//   stopTracking();
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on(SEND_ACCESS_CODE, (ipcEvent, phoneNumber) => {
  sendAccessCode(phoneNumber, ipcEvent)
})

ipcMain.on(CONFIRM_ACCESS_CODE, (ipcEvent, accessCode) => {
  confirmAccessCode(accessCode, ipcEvent)
})

ipcMain.on(START_TRACKING, ipcEvent => {
  startTracking(ipcEvent)
})

ipcMain.on(STOP_TRACKING, ipcEvent => {
  stopTracking(ipcEvent)
  forceQuit = true
  app.quit()
})

ipcMain.on(CONFIRM_SERIAL_NUMBER, (ipcEvent, options) => {
  confirmSerialNumber(ipcEvent, options);
})
