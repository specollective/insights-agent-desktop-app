import path from 'path';
import os from 'os';

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
} = require('electron');

const { confirmAccessCode, sendAccessCode } = require('./services/authentication');
const {
  startTracking,
  stopTracking,
  testTracking,
} = require('./services/activity-data');

const Store = require('electron-store');

require('update-electron-app')({ updateInterval: '5 minutes' });
require('dotenv').config();

const store = new Store();

let appIcon, contextMenu, mainWindow, forceQuit;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    fullscreenable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env['DEVELOPMENT']) {
    mainWindow.webContents.openDevTools();
    console.log(app.getPath('userData'));
  }

  mainWindow.on('minimize', function (windowEvent) {
    windowEvent.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (windowEvent) {
    if (forceQuit) return true;

    windowEvent.preventDefault();
    mainWindow.hide();

    return false;
  });
};

const createTrayMenu = () => {
  appIcon = new Tray(path.join(__dirname, '/assets/24x24.png'))

  const pauseMessage = store.get('ACTIVITY_TRACKING_ENABLED')
    ? 'Pause'
    : 'Start'

  const menuActions = [
    {
      label: 'Dashboard',
      click() {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }

        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click() {
        forceQuit = true;

        app.quit();
      },
    },
    {
      label: 'Clear Data',
      click() {
        store.clear();
        mainWindow.hide();
      },
    },
  ]

  contextMenu = Menu.buildFromTemplate(menuActions);

  appIcon.setToolTip('Insights Agent');
  appIcon.setContextMenu(contextMenu);

  const startTrackingOnBoot = store.get('SURVEY_TOKEN') &&
                              store.get('ACTIVITY_TRACKING_ENABLED')

  if (startTrackingOnBoot) {
    startTracking();
  }
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
});

// app.on('before-quit', (event) => {
//   stopTracking();
// });

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('send-access-code', (ipcEvent, phoneNumber) => {
  sendAccessCode(phoneNumber, ipcEvent);
});

ipcMain.on('check-access-code', (ipcEvent, accessCode) => {
  confirmAccessCode(accessCode, ipcEvent);
});

ipcMain.on('start-tracking', ipcEvent => {
  startTracking(ipcEvent);
});

ipcMain.on('stop-tracking', ipcEvent => {
  stopTracking(ipcEvent);
  forceQuit = true;
  app.quit();
});
