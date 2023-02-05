// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import path from 'path'
const { readFileSync } = require('fs')
const { ipcRenderer, contextBridge } = require('electron')
const Store = require('electron-store')
import {
  SEND_ACCESS_CODE,
  SEND_ACCESS_CODE_SUCCESS,
  SEND_ACCESS_CODE_ERROR,
  CONFIRM_ACCESS_CODE,
  CONFIRM_ACCESS_CODE_SUCCESS,
  CONFIRM_ACCESS_CODE_ERROR,
  CONFIRM_SERIAL_NUMBER,
  CONFIRM_SERIAL_NUMBER_SUCCESS,
  CONFIRM_SERIAL_NUMBER_ERROR,
  START_TRACKING,
  START_TRACKING_SUCCESS,
  START_TRACKING_ERROR,
  STOP_TRACKING,
} from 'constants/events'

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
    onboardingStep: store.get('ONBOARDING_STEP') || 'LANDING_PAGE',
    sendAccessCode: (phoneNumber) => {
      sendMessage(SEND_ACCESS_CODE, phoneNumber)
    },
    onSendAccessCodeSuccess: (callback) => {
      mapIpcOnMessageToCallback(SEND_ACCESS_CODE_SUCCESS, callback);
    },
    onSendAccessCodeError: (callback) => {
      mapIpcOnMessageToCallback(SEND_ACCESS_CODE_ERROR, callback);
    },
    confirmAccessCode: (accessCode) => {
      sendMessage(CONFIRM_ACCESS_CODE, accessCode)
    },
    onConfirmAccessCodeSuccess: (callback) => {
      mapIpcOnMessageToCallback(CONFIRM_ACCESS_CODE_SUCCESS, callback);
    },
    onConfirmAccessCodeError: (callback) => {
      mapIpcOnMessageToCallback(CONFIRM_ACCESS_CODE_ERROR, callback);
    },
    startActivityTracking: (callback) => {
      sendMessage(START_TRACKING);
    },
    cancelActivityTracking: (callback) => {
      sendMessage(STOP_TRACKING);
    },
    onStartActivityTrackingSuccess: (callback) => {
      mapIpcOnMessageToCallback(START_TRACKING_SUCCESS, callback);
    },
    onStartActivityTrackingError: (callback) => {
      mapIpcOnMessageToCallback(START_TRACKING_ERROR, callback);
    },
    confirmSerialNumber: () => {
      sendMessage(CONFIRM_SERIAL_NUMBER, {})
    },
    onConfirmSerialNumberSuccess: (callback) => {
      mapIpcOnMessageToCallback(CONFIRM_SERIAL_NUMBER_SUCCESS, callback);
    },
    onConfirmSerialNumberError: (callback) => {
      mapIpcOnMessageToCallback(CONFIRM_SERIAL_NUMBER_ERROR, callback);
    },
    removeAllListeners: () => ipcRenderer.removeAllListeners(),
  }
);
