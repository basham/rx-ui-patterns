import { bindCallback } from 'rxjs'
import { audit } from 'rxjs/operators'

// Emit on animation frame.
// Drop any old values occuring while waiting on the callback.
export const animationFrame = () =>
  audit(bindCallback((x, callback) => window.requestAnimationFrame(callback)))
