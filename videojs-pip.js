import videojs from 'video.js'
const Component = videojs.getComponent('Component')
const Button = videojs.getComponent('Button')

class PipToggle extends Button {
  constructor(player, options) {
    super(player, options)
  }
  buildCSSClass() {
    return `vjs-pip-control ${super.buildCSSClass()}`
  }
  handleClick() {
    let video = this.player().el().getElementsByTagName('video')[0]
    let mode = video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture"
    video.webkitSetPresentationMode(mode)
  }
}

PipToggle.prototype.controlText_ = 'PIP'
videojs.registerComponent('PipToggle', PipToggle)

const PipButton = function(options) {
  let player = this
  let video = player.el().getElementsByTagName('video')[0]

  if (video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === "function") {
    player.on('loadeddata', function() {
      if (!player.controlBar.childNameIndex_.hasOwnProperty('PipToggle')) {
        var PipToggle = this.controlBar.addChild('PipToggle', options)
        player.controlBar.el().insertBefore(PipToggle.el(), player.controlBar.fullscreenToggle.el())
      }
    })
  }
}

videojs.plugin('pipButton', PipButton)
