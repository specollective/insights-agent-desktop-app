// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

window.api = {
  sendAccessCode: jest.fn(),
  onSendAccessCodeSuccess: jest.fn(),
  onSendAccessCodeError: jest.fn(),
  removeAllListeners: jest.fn(),
  confirmAccessCode: jest.fn(),
  onConfirmAccessCodeSuccess: jest.fn(),
  onConfirmAccessCodeError: jest.fn(),
  onStartActivityTrackingSuccess: jest.fn(),
  onStartActivityTrackingError: jest.fn(),
}
