import videojs from 'video.js'
const Component = videojs.getComponent('Component')
const Button = videojs.getComponent('Button')

class PipToggle extends Button {
  constructor(player, options) {
    super(player, options)
    let toggle = this
    let video = player.el().getElementsByTagName('video')[0]
    video.addEventListener('webkitpresentationmodechanged', function(event){
      toggle.updateState(video.webkitPresentationMode)
    })
  }
  buildCSSClass() {
    return `vjs-pip-control ${super.buildCSSClass()}`
  }
  handleClick() {
    let video = this.player().el().getElementsByTagName('video')[0]
    let mode = video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture"
    video.webkitSetPresentationMode(mode)
  }
  updateState(mode) {
    if (mode == "picture-in-picture") {
      this.addClass('active')
      this.inactivityTimeout = this.player_.options_.inactivityTimeout
      this.player_.options_.inactivityTimeout = 0
      this.player_.userActive(true)
    } else {
      this.removeClass('active')
      this.player_.options_.inactivityTimeout = this.inactivityTimeout
    }
  }
}

PipToggle.prototype.controlText_ = 'PIP'
videojs.registerComponent('PipToggle', PipToggle)

const PipButton = function(options) {
  let player = this
  let video = player.el().getElementsByTagName('video')[0]

  if (video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === "function") {
    player.on('loadeddata', function() {
      if (!player.controlBar.childNameIndex_.hasOwnProperty('PipToggle') && !window.navigator.userAgent.match(/iPhone/)) {
        var PipToggle = this.controlBar.addChild('PipToggle', options)
        player.controlBar.el().insertBefore(PipToggle.el(), player.controlBar.fullscreenToggle.el())
      }
    })
  }
}

videojs.plugin('pipButton', PipButton)
