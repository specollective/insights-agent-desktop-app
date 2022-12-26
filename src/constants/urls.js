const { app } = require('electron');

const BASE_URL = process.env.DEVELOPMENT === 'true'
  ? 'http://localhost:3333'
  : 'https://insights-agent-api.specollective.org';


const BASE_INGESTION_URL = process.env.INGESTION_URL || 'http://localhost:6000';

const DEFAULT_OPTIONS = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
}

module.exports = {
  DEFAULT_OPTIONS,
  BASE_URL,
  BASE_INGESTION_URL
}
