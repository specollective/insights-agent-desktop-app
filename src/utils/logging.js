import { DEVELOPMENT_MODE } from 'constants/environments'

export function log(...args) {
  if (DEVELOPMENT_MODE) {
    console.log(...args)
  }
}