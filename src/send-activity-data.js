const fetch = require('node-fetch');

const sendActivityData = eventData => {
  return fetch(process.env['BACKEND_API_URL'], {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export default sendActivityData;
