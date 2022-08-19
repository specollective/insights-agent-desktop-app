require('dotenv').config();

module.exports = {
  "packagerConfig": {
    "osxSign": {
      "identity": process.env['APPLE_IDENTITY'],
      "hardenedRuntime": true,
      "gatekeeper-assess": false,
      "entitlements": "entitlements.plist",
      "entitlements-inherit": "entitlements.plist",
      "signature-flags": "library"
    },
    "osxNotarize": {
      "appleId": process.env['APPLE_ID'],
      "appleIdPassword": process.env['APPLE_ID_PASS'],
    },
    "executableName": "insights-agent-desktop-app",
    "extraResource": [
      "./scripts/mac-data-tracker/program.scpt",
      './scripts/windows-data-tracker/bin/Debug/net6.0/win-x64',
    ],
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "insights-agent-desktop-app",
        // NOTE: We are manually signing the executable right now.
        // "certificateFile": process.env['CSC_LINK'],
        // "certificatePassword": process.env['CSC_KEY_PASSWORD']
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "specollective",
          "name": "insights-agent-desktop-app"
        }
      }
    }
  ],
  "plugins": [
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/renderer/index.html",
              "js": "./src/renderer.js",
              "name": "main_window",
              "preload": {
                "js": "./src/preload.js"
              }
            }
          ]
        }
      }
    ]
  ]
}
