import { DEVELOPMENT_MODE, DEBUG_MODE } from 'constants/environments'

export function log(...args) {
  if (DEVELOPMENT_MODE || DEBUG_MODE) {
    console.log(...args)
  }
}
