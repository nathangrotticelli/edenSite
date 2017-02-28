
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
 * The orientation controls module.
 *
 * @module axis/controls/orientation
 * @type {Function}
 */

void module.exports

/**
 * Local dependencies.
 * @private
 */

import AxisController from './controller'

/**
 * Converts degrees to radians
 *
 * @private
 * @param {Number} degrees
 */

function dtor (degrees) {
  return typeof degrees === 'number' && !isNaN(degrees)
    ? (Math.PI / 180) * degrees
    : 0
}

/**
 * OrientationController constructor
 *
 * @public
 * @constructor
 * @class OrientationController
 * @extends AxisController
 * @see {@link module:axis/controls/controller~AxisController}
 * @param {Axis} scope - The axis instance
 */

export default class OrientationController extends AxisController {
  constructor (scope) {
    super(scope)

     /**
      * The current device orientation angle in
      * degrees.
      *
      * @public
      * @name state.deviceOrientation
      * @type {Number}
      */

    this.state.define('deviceOrientation', function () {
      let angle = 0
      let type = null
      const orientation = (
         window.screen.ourOrientation || // our injected orientation
         window.screen.orientation || // webkit orientation
         window.screen.mozOrientation || // firefox orientation
         window.screen.msOrientation || // internet explorer orientation
         null // unable to determine orientation object
       )

      if (orientation && orientation.type) {
        type = orientation.type
      }

      if (orientation && orientation.angle) {
        angle = orientation.angle
      }

       // attempt to polyfil angle falling back to 0
      switch (type) {
        case 'landscape-primary': return angle || 90
        case 'landscape-secondary': return angle || -90
        case 'portrait-secondary': return angle || 180
        case 'portrait-primary': return angle || 0
        default: return angle || window.orientation || 0
      }
    })

     /**
      * The current alpha angle rotation
      *
      * @public
      * @name state.alpha
      * @type {Number}
      */

    this.state.alpha = 0

     /**
      * The current beta angle rotation
      *
      * @public
      * @name state.beta
      * @type {Number}
      */

    this.state.beta = 0

     /**
      * The current gamma angle rotation
      *
      * @public
      * @name state.gamma
      * @type {Number}
      */

    this.state.gamma = 0

     // Initialize event delegation
    this.events.bind('deviceorientation')
  }

  /**
   * Handle 'ondeviceorientation' event.
   *
   * @private
   * @param {Event} e
   */

  ondeviceorientation (e) {
    this.state.alpha = e.alpha
    this.state.beta = e.beta
    this.state.gamma = e.gamma
  }

  /**
   * Update orientation controller state.
   *
   * @public
   */

  update () {
    const interpolationFactor = this.scope.state.interpolationFactor
    const alpha = dtor(this.state.alpha)
    const beta = dtor(this.state.beta)
    const gamma = dtor(this.state.gamma)

    if (alpha !== 0 && beta !== 0 && gamma !== 0) {
      this.state.eulers.device.set(beta, alpha, -gamma, 'YXZ')
      this.state.quaternions.direction.setFromEuler(
        this.state.eulers.device
      )

      if (this.scope.controls.touch) {
        this.state.quaternions.direction.multiply(
          this.scope.controls.touch.state.quaternions.touch
        )
      }
      this.state.target.quaternion.slerp(this.state.quaternions.direction,
                                         interpolationFactor)
    }
    return this
  }
 }
