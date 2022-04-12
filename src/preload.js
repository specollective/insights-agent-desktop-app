const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('test-button').onclick = () => {
    ipcRenderer.send('status-check-request', 'example message');
    document.getElementById('status').innerText = 'Waiting..';
  }

  // Receive reply from elecron
  // See file main.js on line 37
  ipcRenderer.on('status-check-reply', (event, response) => {
    document.getElementById('status').innerText = response
  });
})
