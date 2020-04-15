import { bindCallback } from '/web_modules/rxjs.js'
import { audit } from '/web_modules/rxjs/operators.js'

// Emit on animation frame.
// Drop any old values occuring while waiting on the callback.
export const animationFrame = () =>
  audit(bindCallback((x, callback) => window.requestAnimationFrame(callback)))
