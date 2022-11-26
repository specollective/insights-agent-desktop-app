# Insights Agent Desktop App

🚧 This code is actively under development and should be considered unstable. 🚧

This repository contains the code for the Insights Agent desktop application. It is designed to be used by individuals who have signed up and are selected to participate in research studies where participants download the app and enable data collection of the following data points.

- device type / operating system
- application names
- tab names (scrubbed for PII)
- domain names
- connectivity (connected to wifi or not)
- device type
- timestamps

Raw data is anonymized and only persisted for a short period of time before being aggregated, analyzed, and destroyed. The code is setup to be hosted open source on Github in order to leverage the free service [update.electronjs.org](https://github.com/electron/update.electronjs.org) for auto-updating production applications.

## Software Architecture

The bulk of the source code for the app exists in the `src` folder.

```
├── assets
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
├── README.md
├── LICENSE
├── package-lock.json
├── package.json
├── add-osx-cert.sh
├── babel.config.js
├── entitlements.plist
├── forge.config.js
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

### 1. Clone repo

```
git clone git@github.com:specollective/insights-agent-desktop-app.git
```

### 2. Install dependencies

```
npm install
```

### 3. Create am environment file

Copy the contents of `.env.example` to a new `.env` file.

```
cp .env.example .env
```

The `.env` file should have the following variagbles set.

```
DEVELOPMENT=true
USE_MOCK_API=true
```

### 4. Start the app in development mode

```
npm start
```

### 5. Run unit tests

```
npm test
```

### 6. Testing against production API

Set the `DEVELOPMENT` variable to false the `.env` file before running `npm start`.

## Deployment

Deployments are automated with Github Actions and Github Releases. See the `.github` directory for more details about the build configuration.
