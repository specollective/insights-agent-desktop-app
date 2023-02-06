import { DEVELOPMENT_MODE } from 'constants/environments'

export function log(...args) {
  if (DEVELOPMENT_MODE || process.env.DEBUG === 'true') {
    console.log(...args)
  }
}