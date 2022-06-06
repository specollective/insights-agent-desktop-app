/*
  Preloads data and sets up context bridge. See Electron docs about context isolation
  for details. https://www.electronjs.org/docs/latest/tutorial/context-isolation
*/

// Dependencies
const path = require('path');
const { readFileSync } = require('fs');
const { ipcRenderer, contextBridge } = require('electron');
const Store = require('electron-store');

// Initialization
const store = new Store();
const sendMessage = (id, data) => ipcRenderer.send(id, data);
const onMessage = (id, callback) => ipcRenderer.on(id, callback);

// Set up context bridge exposing it to the window.api.
contextBridge.exposeInMainWorld(
  'api',
  {
    sendAccessCode: (phoneNumber) => {
      sendMessage('send-access-code', phoneNumber)
    },
    onSendAccessCodeSuccess: (callback) => {
      onMessage('send-access-code-success', () => {
        callback();
      })
    },
    confirmAccessCode: (accessCode) => {
      sendMessage('check-access-code', accessCode)
    },
    onConfirmAccessCodeSuccess: (callback) => {
      onMessage('check-access-code-success', () => {
        callback();
      })
    },
    startActivityTracking: (callback) => {
      sendMessage('start-tracking')
    },
    onStartActivityTrackingSuccess: (callback) => {
      onMessage('start-tracking-success', () => {
        callback();
      })
    },
    surveyToken: store.get('SURVEY_TOKEN'),
  }
);
