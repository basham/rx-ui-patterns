// Register a service worker that will simulate server responses.
// Force it to update on page load.
// It may be better to not use dynamic imports for components,
// but it's a compromise to get the service worker "server" working
// before the components mount.

const components = 'examples,form,icon,lights,page'

const componentPaths = components.split(',')
  .map((name) => `./components/rui-${name}.js`)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then((reg) => {
      reg.update()

      componentPaths.forEach((path) => import(path))
    })
}
