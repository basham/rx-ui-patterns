import { COMPONENTS } from './constants.js'

init()

// Register a service worker that will simulate server responses.
// Force it to update on page load, to help development.
// Import components afterward, to guarantee they use the latest worker.
async function init () {
  if (!('serviceWorker' in navigator)) {
    return
  }
  const reg = await navigator.serviceWorker.register('./service-worker.js')
  reg.update()
  COMPONENTS
    .forEach(({ path }) => import(path))
}
