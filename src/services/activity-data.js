const os = require('os');
const { execSync } = require('child_process');
const {
  SCRIPTS_PATH,
  WINDOWS_EXECUTABLE_PATH,
  MAC_EXECUTABLE_PATH,
} = require('../constants/scripts');

function getActivityData() {
  if (os.platform() === 'win32') {
    const stdout = execSync(`${SCRIPTS_PATH}/${WINDOWS_EXECUTABLE_PATH}`, {
      windowsHide: true,
    });
    return stdout.toString('utf8').split('\n');
  } else if (os.platform() === 'darwin') {
    const stdout = execSync(`osascript ${SCRIPTS_PATH}/${MAC_EXECUTABLE_PATH}`);
    return stdout.toString('utf8').split('\n');
  } {
    throw('Unsupported platform')
  }
}

module.exports = {
  getActivityData,
}
