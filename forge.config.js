require('dotenv').config();

module.exports = {
  "packagerConfig": {
    "osxSign": {
      "identity": "Developer ID Application: Joseph Torreggiani (TQ27RR68H8)",
      "hardenedRuntime": true,
      "gatekeeper-assess": false,
      "entitlements": "entitlements.plist",
      "entitlements-inherit": "entitlements.plist",
      "signature-flags": "library"
    },
    "osxNotarize": {
      "appleId": process.env['APPLE_ID'],
      "appleIdPassword": process.env['APPLE_ID_PASS'],
    }
  },
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "electron_skeleton"
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
          "owner": "jtorreggiani",
          "name": "electron-skeleton"
        }
      }
    }
  ]
}