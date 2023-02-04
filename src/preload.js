// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const path = require('path');
const { readFileSync } = require('fs');
const { ipcRenderer, contextBridge } = require('electron');
const Store = require('electron-store');

// Initialization
const store = new Store();
const sendMessage = (id, data) => ipcRenderer.send(id, data);
const onMessage = (id, callback) => ipcRenderer.on(id, callback);

const mapIpcOnMessageToCallback = (message, callback) =>
  onMessage(message, (ipcEvent, data) => callback(data));

// Set up context bridge exposing it to the window.api.
contextBridge.exposeInMainWorld(
  'api',
  {
    surveyToken: store.get('SURVEY_TOKEN'),
    onboardingStep: store.get('ONBOARDING_STEP') || 'SEND_ACCESS_CODE',
    sendAccessCode: (phoneNumber) => {
      sendMessage('send-access-code', phoneNumber)
    },
    onSendAccessCodeSuccess: (callback) => {
      mapIpcOnMessageToCallback('send-access-code-success', callback);
    },
    onSendAccessCodeError: (callback) => {
      mapIpcOnMessageToCallback('send-access-code-error', callback);
    },
    confirmAccessCode: (accessCode) => {
      sendMessage('check-access-code', accessCode)
    },
    onConfirmAccessCodeSuccess: (callback) => {
      mapIpcOnMessageToCallback('check-access-code-success', callback);
    },
    onConfirmAccessCodeError: (callback) => {
      mapIpcOnMessageToCallback('check-access-code-error', callback);
    },
    startActivityTracking: (callback) => {
      sendMessage('start-tracking');
    },
    cancelActivityTracking: (callback) => {
      sendMessage('stop-tracking');
    },
    onStartActivityTrackingSuccess: (callback) => {
      mapIpcOnMessageToCallback('start-tracking-success', callback);
    },
    onStartActivityTrackingError: (callback) => {
      mapIpcOnMessageToCallback('start-tracking-error', callback);
    },
    confirmSerialNumber: () => {
      sendMessage('confirm-serial-number', {})
    },
    onConfirmSerialNumberSuccess: (callback) => {
      mapIpcOnMessageToCallback('confirm-serial-number-success', callback);
    },
    onConfirmSerialNumberError: (callback) => {
      mapIpcOnMessageToCallback('confirm-serial-number-error', callback);
    },
    removeAllListeners: () => ipcRenderer.removeAllListeners()
  }
);
