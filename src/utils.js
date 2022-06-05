// // NodeJS Standard library depedencies
// const os = require('os');
// const { execSync } = require('child_process');
//
// // Third party depedencies
// const cron = require('node-cron');
// const fetch = require('electron-fetch').default;
// const Store = require('electron-store');
//
// // Application dependencies
// const { getActivityData } = require('./services/activity-data');
// const { postDataEntry } = require('./services/data-entries');
// const { BASE_URL, DEFAULT_OPTIONS } = require('./constants/urls');
//
// // Initialization
// const store = new Store();
//
//
// const trackingCron = cron.schedule('*/5 * * * * *', () => {
//   captureActivityData();
// }, { scheduled: false });
//
// function startTracking () {
//   trackingCron.start();
//
//   return true;
// }
//
// function stopTracking () {
//   trackingCron.stop();
// }
//
//
// module.exports = {
//   sendAccessCode,
//   confirmAccessCode,
//   startTracking,
//   stopTracking,
// }
