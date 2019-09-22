// The MIT License (MIT)
//
// Copyright (c) Rich Tibbett
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { webm, mp4 } from './media.js'

// Detect iOS browsers < version 10
const oldIOS = typeof navigator !== 'undefined' && parseFloat(
  ('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
    .replace('undefined', '3_2').replace('_', '.').replace('_', '')
) < 10 && !window.MSStream

export default class NoSleep {
  constructor () {
    if (oldIOS) {
      this.noSleepTimer = null
    } else {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement('video')

      this.noSleepVideo.setAttribute('muted', '')
      this.noSleepVideo.setAttribute('title', 'No Sleep')
      this.noSleepVideo.setAttribute('playsinline', '')

      this._addSourceToVideo(this.noSleepVideo, 'webm', webm)
      this._addSourceToVideo(this.noSleepVideo, 'mp4', mp4)

      this.noSleepVideo.addEventListener('loadedmetadata', () => {
        if (this.noSleepVideo.duration <= 1) { // webm source
          this.noSleepVideo.setAttribute('loop', '')
        } else { // mp4 source
          this.noSleepVideo.addEventListener('timeupdate', () => {
            if (this.noSleepVideo.currentTime > 0.5) {
              this.noSleepVideo.currentTime = Math.random()
            }
          })
        }
      })
    }
  }

  _addSourceToVideo (element, type, dataURI) {
    var source = document.createElement('source')
    source.src = dataURI
    source.type = `video/${type}`
    element.appendChild(source)
  }

  enable () {
    if (oldIOS) {
      this.disable()
      console.warn(`
        NoSleep enabled for older iOS devices. This can interrupt
        active or long-running network requests from completing successfully.
        See https://github.com/richtr/NoSleep.js/issues/15 for more details.
      `)
      this.noSleepTimer = window.setInterval(() => {
        if (!document.hidden) {
          window.location.href = window.location.href.split('#')[0]
          window.setTimeout(window.stop, 0)
        }
      }, 15000)
    } else {
      this.noSleepVideo.play()
    }
  }

  disable () {
    if (oldIOS) {
      if (this.noSleepTimer) {
        console.warn(`
          NoSleep now disabled for older iOS devices.
        `)
        window.clearInterval(this.noSleepTimer)
        this.noSleepTimer = null
      }
    } else {
      this.noSleepVideo.pause()
    }
  }
};
