# Insights Agent Desktop App

🚧 This repository is actively under development and should be consider unstable. 🚧

This repository houses the code for the Insights Agent desktop application. This application is designed to be used by individuals who have signed up and are selected to participate in a research studies where participants download the desktop app and enable data collection of the following data points.

- device type / operating system
- application names
- tab names (scrubbed for PII)
- domain names
- connectivity (connected to wifi or not)
- device type
- timestamps

Raw data is anonymized and only persisted for a short period of time before it is aggregated and destroyed. The code is setup to be hosted open source on Github in order to leverage the free service [update.electronjs.org](https://github.com/electron/update.electronjs.org) for auto-updating production applications.

## Software Architecture

The bulk of the source code for the app exists in the `src` folder.
```
├── LICENSE
├── README.md
├── add-osx-cert.sh
├── assets
│   ├── entitlements.mac.plist
│   ├── icon.icns
│   ├── icon.ico
│   ├── icon.png
│   ├── icon.svg
│   └── icons
├── babel.config.js
├── entitlements.plist
├── forge.config.js
├── package-lock.json
├── package.json
├── scripts
│   ├── mac-data-tracker
│   └── windows-data-tracker
├── src
│   ├── __tests__
│   ├── assets
│   ├── constants
│   ├── index.css
│   ├── index.html
│   ├── main.js
│   ├── preload.js
│   ├── react-test-helpers.jsx
│   ├── renderer
│   ├── renderer.js
│   ├── services
│   └── setupTests.js
├── webpack.main.config.js
├── webpack.renderer.config.js
└── webpack.rules.js
```

The `scripts` directory contains the platform specific code for collecting usage data.

```
scripts
├── mac-data-tracker
│   └── program.scpt
└── windows-data-tracker
    ├── Program.cs
    ├── README.md
    ├── windows-data-tracker.csproj
    ├── windows-data-tracker.deps.json
    ├── windows-data-tracker.dll
    ├── windows-data-tracker.exe
    └── windows-data-tracker.runtimeconfig.json
```

## Dependencies
- electron
- electron-forge
- update-electron-app
- electron-squirrel-startup
- electron-forge
- electron-winstaller

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

4. Run unit tests
```
npm test
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
CSR_PASS=[CSR_PASS]
DEVELOPMENT=true
GITHUB_TOKEN=[GITHUB_TOKEN]
BACKEND_API_URL=https://example.com
```

## Distribution

🚧 This section us under construction and is considered incomplete. 🚧

### MS Windows

The Insights Agent desktop application has initially been developed to study usage of Microsoft Windows computers. The application uses Electron Forge to sign the software with an Extended Validation (EV) token. Currently, this requires building the application on a computer with a thumb-drive with the EV token client.

**Manual code signing process**

This section assumes you have the EV token device and credentials stored in a password manager.

Perform dry run
```
npm run publish:dry-run
```

Sign executables

Manual process using EV Certificate with device access.

Sign C# executable
```
node_modules\electron-winstaller\vendor\signtool.exe sign /a "scripts\windows-data-tracker\bin\Debug\net6.0\win-x64\windows-data-tracker.exe"
```

Sign Setup.exe script
```
node_modules\electron-winstaller\vendor\signtool.exe sign /a ".\out\make\squirrel.windows\x64\insights-agent-desktop-app-0.1.2-alpha Setup.exe"
```

Publish from dry-run
```
npm run publish:from-dry-run
```

### MacOSX

The application can run on OSX. This flow is setup to automatically build and sign the app as part of CI.
