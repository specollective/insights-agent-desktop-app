# Insights Agent Desktop App

The code is setup for be hosted open source on Github in order to leverage the free service [update.electronjs.org](https://github.com/electron/update.electronjs.org) for auto-updating production applications.

The boilerplate provided here is designed for rapid prototyping and is actively being developed.

## Dependencies
- electron
- electron-forge
- update-electron-app
- electron-squirrel-startup

## Development

1. Close repo
```
git clone git@github.com:specollective/insights-agent-desktop-app.git
```

2. Install dependencies
```
npm install
```

3. Start development app
```
npm start
```

## Deployment

Testing builds locally

Create a .env file.
```
touch .env
```

Add the following environment variables with your developer credentials.
```
APPLE_ID=[YOUR APPLE ID]
APPLE_ID_PASS=[YOUR APP SPECIFIC PASSWORD]
APPLE_IDENTITY=Developer ID Application: [YOUR NAME] ([YOUR DEVELOPER ID])
CSR_PASS=[S=CSR_PASS]
DEVELOPMENT=true
GITHUB_TOKEN=[GITHUB_TOKEN]
```

Test building the application for your target platform (in this case OSX).
```
npm run make
```

C:\Users\jtorreggiani\Documents\projects\build-justly\insights-agent-desktop-app\node_modules\electron-winstaller\vendor\signtool.exe sign /a /f "C:\Users\jtorreggiani\Documents\projects\build-justly\insights-agent-desktop-app\ev-cert.pfx" /p "E7hBlMexMi" "C:\Users\jtorreggiani\Documents\projects\build-justly\insights-agent-desktop-app\out\insights-agent-desktop-app-win32-x64\insights-agent-desktop-app.exe"
