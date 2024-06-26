import player from './player.js'
import * as u from './utils.js'

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('hashchange', (event) => {
    u.updateSelected(new URL(event.newURL).hash)
  })
})

window.addEventListener('load', function () {
  player.start()
  u.updateSelected(window.location.hash)
})
