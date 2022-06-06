const path = require('path')

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
} = require('electron')

const {
  confirmAccessCode,
  sendAccessCode,
} = require('./services/authentication')

const {
  startTracking,
  stopTracking,
} = require('./services/activity-data')

const Store = require('electron-store');

require('update-electron-app')({
  updateInterval: '5 minutes'
});

// Invoke dotenv to be able to read environment variables from .env file
require('dotenv').config()

const store = new Store()

let appIcon, contextMenu, mainWindow, forceQuit

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    fullscreenable: false,
    // icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  if (process.env['DEVELOPMENT']) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.on('minimize', function (windowEvent) {
  //   windowEvent.preventDefault();
  //   mainWindow.hide();
  // });

  mainWindow.on('close', function (windowEvent) {
    if (process.env['DEVELOPMENT']) return true;
    if (forceQuit) return true;

    windowEvent.preventDefault();
    mainWindow.hide();

    return false;
  });

  app.dock.hide();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.whenReady().then(() => {
  appIcon = new Tray(path.join(__dirname, '/24x24.png'));
  contextMenu = Menu.buildFromTemplate([
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
  ]);

  appIcon.setToolTip('Insights Agent');
  appIcon.setContextMenu(contextMenu);

  if (store.get('SURVEY_TOKEN')) {
    startTracking();
  }
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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

  ipcEvent.sender.send('start-tracking-success', '');
});

ipcMain.on('stop-tracking', ipcEvent => {
  stopTracking();

  event.sender.send('stop-tracking-success', '');
});
