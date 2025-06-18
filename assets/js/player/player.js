import audios from './data.js'
import elements from './elements.js'
import * as utils from './utils.js'

export default {
  audioData: audios,
  currentPlaying: utils.currentIndex(),
  currentAudio: {},
  isPlaying: false,
  savedMuted: false,
  savedVolume: 1,

  start() {
    elements.get.call(this)
    this.update()
    this.volumeControl.value = 100
  },

  play() {
    this.isPlaying = true
    this.audio.play()
    this.playPauseButton.innerHTML = this.pauseIcon
  },

  pause() {
    this.isPlaying = false
    this.audio.pause()
    this.playPauseButton.innerHTML = this.playIcon
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  },

  swap(index) {
    this.currentPlaying = index
    this.pause()
    this.update()
    this.play()
  },

  next() {
    let index = this.currentPlaying + 1
    if (index === this.audioData.length) {
      index = 0
    }
    this.swap(index)
  },

  back() {
    let index = this.currentPlaying - 1
    if (index === -1) {
      index = this.audioData.length - 1
    }
    this.swap(index)
  },

  toggleMute() {
    this.audio.muted = !this.audio.muted
    this.savedMuted = this.audio.muted
    this.volumeButton.innerHTML = this.audio.muted ? this.mutedIcon : this.soundIcon
  },

  setVolume(value) {
    this.savedVolume = value / 100
    this.audio.volume = this.savedVolume
  },

  setSeekbar(value) {
    this.audio.muted = true
    this.audio.currentTime = value
  },

  timeUpdate() {
    const currentTime = this.audio.currentTime
    const formattedTime = utils.convertTo12HourFormat(currentTime)

    if (Math.ceil(this.seekbar.value) != Math.ceil(currentTime)) {
      this.seekbar.value = currentTime
    }

    if (this.currentDuration.innerText !== formattedTime) {
      this.currentDuration.innerText = formattedTime
    }

    if (!this.savedMuted && !this.seekbar.dragging) {
      this.audio.muted = false
    }

    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: this.audio.duration || 0,
        playbackRate: this.audio.playbackRate || 1,
        position: this.audio.currentTime || 0,
      })
    }
  },

  update() {
    if (this.currentPlaying < 0 || this.currentPlaying > this.audioData.length) {
      this.currentPlaying = 0
    }

    this.currentAudio = this.audioData[this.currentPlaying]
    this.cover.src = utils.imageURL(this.currentAudio.cover)
    this.title.innerText = this.currentAudio.title
    this.artist.innerText = this.currentAudio.artist

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentAudio.title,
        artist: this.currentAudio.artist,
        artwork: [{ src: this.cover.src, sizes: '512x512', type: 'image/webp' }]
      })
    }

    const audio = utils.audioURL(this.currentAudio.file)
    elements.createAudioElement.call(this, audio)

    this.downloadButton.href = audio
    this.downloadButton.download = utils.generateFilename(
      this.currentAudio.file,
      this.currentAudio.artist,
      this.currentAudio.title
    )

    window.location.hash = this.currentPlaying + 1
    document.title = this.currentAudio.title + ' | ' + this.currentAudio.artist

    this.audio.onloadeddata = () => {
      elements.actions.call(this)
      this.audio.muted = this.savedMuted
      this.audio.volume = this.savedVolume
    }
  },
}
