import * as Sentry from '@sentry/electron'
import { DEVELOPMENT_MODE, DEBUG_MODE } from 'constants/environments'

export function emitEvent(metric) {
  if (DEVELOPMENT_MODE && !DEBUG_MODE) return

  Sentry.captureMessage(metric)
}