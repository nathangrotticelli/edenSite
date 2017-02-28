
'use strict'

/**
 * @license
 * Copyright Little Star Media Inc. and other contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * The fisheye projection mode.
 *
 * @public
 * @module scope/projection/fisheye
 * @type {Function}
 */

 /**
  * Module dependencies
  * @private
  */

import Debug from 'debug'

const debug = new Debug('axis:projection:fisheye')

/**
 * Fisheye projection constraints.
 *
 * @public
 * @type {Object}
 */

fisheye.constraints = {}

/**
 * Applies a fisheye projection to scope frame
 *
 * @api public
 * @param {Axis} scope
 */

export default function fisheye (scope) {
  // this projection requires an already initialized
  // camera on the `scope' instance
  const { camera } = scope

  // bail if camera not initialized
  if (camera == null) { return false }

  // bail if not ready
  if (!this.isReady()) { return false }

  // bail if geometry is a cylinder because fisheye
  // projection is only supported in a spherical geometry
  if (scope.geometry() === 'cylinder') { return false }

  // max Z and fov
  const maxZ = (scope.height() / 100) | 0
  const current = this.current

  scope.fov(scope.state.originalfov + 20)
  this.constraints = {}

  if (scope.geometry() === 'cylinder') {
    scope.orientation.x = 0
    this.constraints.y = true
    this.constraints.x = false
  }

  // begin animation
  debug('animate: FISHEYE begin')
  this.animate(() => {
    scope.camera.position.z = maxZ

    if (current === 'tinyplanet') {
      scope.orientation.x = 0
      scope.lookAt(0, 0, 0)
    } else if (current !== 'equilinear') {
      scope.orientation.x = (Math.PI / 180)
    }

    this.cancel()
  })
}
