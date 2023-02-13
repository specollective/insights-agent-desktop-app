// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer, contextBridge } = require('electron');

const START_TRACKING = 'start-tracking'
const START_TRACKING_SUCCESS = 'start-tracking-success'
const START_TRACKING_ERROR = 'start-tracking-error'
const STOP_TRACKING = 'stop-tracking'
const SEND_ACCESS_CODE = 'send-access-code'
const CONFIRM_ACCESS_CODE = 'confirm-access-code'
const CONFIRM_SERIAL_NUMBER = 'confirm-serial-number'
const SEND_ACCESS_CODE_SUCCESS = 'send-access-code-success'
const SEND_ACCESS_CODE_ERROR = 'send-access-code-error'
const CONFIRM_ACCESS_CODE_SUCCESS = 'confirm-access-code-success'
const CONFIRM_ACCESS_CODE_ERROR = 'confirm-access-code-success'
const CONFIRM_SERIAL_NUMBER_SUCCESS = 'confirm-serial-number-success'
const CONFIRM_SERIAL_NUMBER_ERROR = 'confirm-serial-number-error'
const EXIT_SURVEY = 'exit-survey'
const DOWNLOAD_DATA = 'download-data'
const DOWNLOAD_DATA_SUCCESS = 'download-data-success'
const MAIN_NAVIGATION = 'main-navigation'
const HIDE_APP = 'hide-app'
const LOAD_STATE = 'load-state'
const LOAD_STATE_SUCCESS = 'load-state-success'

const sendMessage = (id, data) => ipcRenderer.send(id, data)
const onMessageHandler = (id, cb) => ipcRenderer.on(id, cb)
const onMessage = (msg, cb) => onMessageHandler(msg, (evt, data) => cb(data))

// Set up context bridge exposing it to the window.api.
contextBridge.exposeInMainWorld(
  'api',
  {
    // Actions
    cancelActivityTracking: (callback) => sendMessage(STOP_TRACKING),
    confirmAccessCode: (accessCode) => sendMessage(CONFIRM_ACCESS_CODE, accessCode),
    confirmSerialNumber: () => sendMessage(CONFIRM_SERIAL_NUMBER, {}),
    downloadData: (data) => sendMessage(DOWNLOAD_DATA, {}),
    hideApp: () => sendMessage(HIDE_APP, {}),
    exitSurvey: () => sendMessage(EXIT_SURVEY, {}),
    loadState: () => sendMessage(LOAD_STATE),
    removeAllListeners: () => ipcRenderer.removeAllListeners(),
    sendAccessCode: (phoneNumber) => sendMessage(SEND_ACCESS_CODE, phoneNumber),
    startActivityTracking: (callback) => sendMessage(START_TRACKING),
    // Event listeners
    onConfirmAccessCodeError: (callback) => onMessage(CONFIRM_ACCESS_CODE_ERROR, callback),
    onConfirmAccessCodeSuccess: (callback) => onMessage(CONFIRM_ACCESS_CODE_SUCCESS, callback),
    onConfirmSerialNumberError: (callback) => onMessage(CONFIRM_SERIAL_NUMBER_ERROR, callback),
    onConfirmSerialNumberSuccess: (callback) => onMessage(CONFIRM_SERIAL_NUMBER_SUCCESS, callback),
    onDownloadSuccess: (callback) => onMessage(DOWNLOAD_DATA_SUCCESS, callback),
    onLoadStateSuccess: (callback) => onMessage(LOAD_STATE_SUCCESS, callback),
    onMainNavigation: (callback) => onMessage(MAIN_NAVIGATION, callback),
    onSendAccessCodeError: (callback) => onMessage(SEND_ACCESS_CODE_ERROR, callback),
    onSendAccessCodeSuccess: (callback) => onMessage(SEND_ACCESS_CODE_SUCCESS, callback),
    onStartActivityTrackingError: (callback) => onMessage(START_TRACKING_ERROR, callback),
    onStartActivityTrackingSuccess: (callback) => onMessage(START_TRACKING_SUCCESS, callback),
  }
)
