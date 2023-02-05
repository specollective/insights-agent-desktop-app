import { DEVELOPMENT_MODE } from './environments';

export const BASE_URL = DEVELOPMENT_MODE
  ? 'https://localhost:8000'
  : process.env.BACKEND_API_URL;
 
export const BASE_INGESTION_URL = DEVELOPMENT_MODE
  ? 'https://localhost:8000'
  : process.env.INGESTION_URL;

export const INGESTION_URL = `${BASE_INGESTION_URL}/agent-data-ingestion`

export const DEFAULT_OPTIONS = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
}

