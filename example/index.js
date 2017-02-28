
/**
 * Module dependencies.
 */

const { createAxisFrame } = require('../src')

/**
 * Debugging.
 */

// window.DEBUG = true

/**
 * DOM refs.
 */

const fullscreen = document.getElementById('go-fullscreen')
const vrToggle = document.getElementById('toggle-vr-mode')
const enableLock = document.getElementById('enable-pointer-lock')
const mouseToggle = document.getElementById('toggle-mouse-movement-control')
const player = document.getElementById('player')
// const preview = document.getElementById('preview')

/**
 * State.
 */

let isMouseMovementEnabled = false
let isVREnabled = false

/**
 * Create player.
 */

const frame = createAxisFrame(player, {
  crossorigin: true,
  resizable: false,
  preload: true,
  autoplay: true,
  width: window.innerWidth,
  height: window.innerHeight,
  loop: true,
  allowWheel: false,
  muted: true,
  src: '/backgroundReel.mp4' // budo magic. this is actually /public/assets/paramotor.mp4
})

frame.render()

frame.on('vrhmdavailable', function (e) {
  console.log(e)
})

frame.once('ready', function () {
  frame.focus()
  frame.rotate('x', {value: -.04})
  // adjusts logo and start position
  // frame.rotate('y', {value: 0.005, every: 100})
  // updatePreview()
  // setInterval(updatePreview, 2000)
  //
  // function updatePreview () {
  //   frame.toImage(preview)
  // }
})

fullscreen.addEventListener('click', function () {
  frame.fullscreen(frame.el)
})

vrToggle.addEventListener('click', function () {
  if (isVREnabled) {
    frame.disableVRMode()
  } else {
    frame.enableVRMode()
  }
  isVREnabled = !isVREnabled
})

enableLock.addEventListener('click', function () {
  frame.initializeControllers({ pointer: true })
  const pointer = frame.controls.pointer
  pointer.enable()
  pointer.request()
})

mouseToggle.addEventListener('click', function () {
  if (isMouseMovementEnabled) {
    frame.controls.movement.disable()
    frame.controls.mouse.enable()
  } else {
    frame.controls.movement.enable()
    frame.controls.mouse.disable()
  }
  isMouseMovementEnabled = !isMouseMovementEnabled
})
