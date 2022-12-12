# Insights Agent Desktop App

The Build justly Project has partnered to launch and execute a technology study. The study will endeavor to not only to better understand the barriers/frictions and interests/needs to technology of Hispanic small business owners in the state of Georgia but will also work to develop specific ways to bring down the barriers to technology competency.  This study, will be measuring efforts through both opt-in telemetry collection alongside on-going qualitative interviews and surveys which will be shared publicly. The insights-agent-web-app contains code for the online survey for participant signup and the insights-agent-desktop-app repo contains the code for the desktop app that monitors participant activity. 


🚧 This code is actively under development and should be considered unstable. 🚧

This repository contains the code for the Insights Agent desktop application. It is designed to be used by individuals who have signed up and are selected to participate in research studies where participants download the app and enable data collection of the following data points.

- device type / operating system
- application names
- tab names (scrubbed for PII)
- domain names
- connectivity (connected to wifi or not)
- device type
- timestamps


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
