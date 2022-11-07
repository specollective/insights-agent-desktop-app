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

1. Clone repo
```
git clone git@github.com:specollective/insights-agent-desktop-app.git
```

2. Install dependencies
```
npm install
```

3. Start desktop app with fake backend
```
npm run start:dev
```

4. Run unit tests
```
npm test
```

## Deployment

Deployments are automated with Github Actions and Github Releases. See the `.github` directory for more details about the build configuration.