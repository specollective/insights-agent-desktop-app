// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

window.api = {
  confirmAccessCode: jest.fn(),
  downloadData: jest.fn(),
  onConfirmAccessCodeError: jest.fn(),
  onConfirmAccessCodeSuccess: jest.fn(),
  onDownloadSuccess: jest.fn(),
  onMainNavigation: jest.fn(),
  onSendAccessCodeError: jest.fn(),
  onSendAccessCodeSuccess: jest.fn(),
  onStartActivityTrackingError: jest.fn(),
  onStartActivityTrackingSuccess: jest.fn(),
  removeAllListeners: jest.fn(),
  sendAccessCode: jest.fn(),
  startActivityTracking: jest.fn(),
}
