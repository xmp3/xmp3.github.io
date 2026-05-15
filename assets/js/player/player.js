import audios from './data.js'
import elements from './elements.js'
import * as utils from './utils.js'

export default {
  audioData: audios,
  currentPlaying: utils.currentIndex(audios),
  currentAudio: {},
  isPlaying: false,
  savedMuted: false,
  savedVolume: 1,
  lyricsLines: [],
  lyricsRenderId: 0,
  lyricsRequestId: 0,
  currentLyricsIndex: -1,

  start() {
    elements.get.call(this)
    window.addEventListener('hashchange', () => {
      const nextPlaying = utils.currentIndex(this.audioData)

      if (nextPlaying !== this.currentPlaying) {
        this.swap(nextPlaying)
      }
    }, { passive: true })
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

  toggleRepeat() {
    const isActive = this.repeatButton.getAttribute('attr-active') === 'true'
    this.repeatButton.setAttribute('attr-active', isActive ? 'false' : 'true')
  },

  handleTrackEnded() {
    if (this.repeatButton.getAttribute('attr-active') === 'true') {
      this.audio.currentTime = 0
      this.play()
      return
    }

    this.next()
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

    this.updateLyrics()
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

    void this.loadLyrics()

    window.location.hash = this.currentAudio.id
    document.title = this.currentAudio.title + ' | ' + this.currentAudio.artist

    this.audio.onloadeddata = () => {
      elements.actions.call(this)
      this.audio.muted = this.savedMuted
      this.audio.volume = this.savedVolume
    }
  },

  hideLyrics() {
    if (!this.lyrics) {
      return
    }

    this.lyricsRenderId += 1
    this.currentLyricsIndex = -1
    this.lyricsLines = []

    const lyricsText = this.lyrics.querySelector('h6')
    if (lyricsText) {
      lyricsText.textContent = ''
      lyricsText.classList.remove('opacity-0', 'blur-sm', 'translate-y-2', '-translate-y-2')
    }

    this.lyrics.classList.add('hidden')
  },

  showLyrics() {
    if (!this.lyrics) {
      return
    }

    this.lyrics.classList.remove('hidden')
  },

  parseLyrics(text) {
    return text
      .trim()
      .split(/\r?\n/)
      .reduce((entries, line) => {
        const timestampPattern = /\[(\d+):(\d+(?:\.\d+)?)\]/g
        const lyricText = line.replace(/\[(\d+):(\d+(?:\.\d+)?)\]/g, '').trim()

        if (!lyricText) {
          return entries
        }

        let timestampMatch
        while ((timestampMatch = timestampPattern.exec(line)) !== null) {
          const [, minutes, seconds] = timestampMatch
          entries.push({
            time: Number(minutes) * 60 + Number(seconds),
            text: lyricText,
          })
        }

        return entries
      }, [])
      .sort((left, right) => left.time - right.time)
  },

  async setLyrics(text) {
    if (!this.lyrics) {
      return
    }

    const lyricsText = this.lyrics.querySelector('h6')
    if (!lyricsText) {
      return
    }

    const renderId = ++this.lyricsRenderId

    lyricsText.classList.add('opacity-0', 'blur-sm', 'translate-y-2')

    await new Promise(resolve => setTimeout(resolve, 180))

    if (renderId !== this.lyricsRenderId) {
      return
    }

    lyricsText.textContent = text
    lyricsText.classList.remove('translate-y-2')
    lyricsText.classList.add('-translate-y-2')

    requestAnimationFrame(() => {
      if (renderId !== this.lyricsRenderId) {
        return
      }

      lyricsText.classList.remove('opacity-0', 'blur-sm', '-translate-y-2')
    })
  },

  async loadLyrics() {
    const requestId = ++this.lyricsRequestId
    const lyricsPath = this.currentAudio.lyrics

    this.lyricsLines = []
    this.currentLyricsIndex = -1

    const lyricsText = this.lyrics.querySelector('h6')
    if (lyricsText) {
      lyricsText.textContent = ''
      lyricsText.classList.remove('opacity-0', 'blur-sm', 'translate-y-2', '-translate-y-2')
    }

    this.showLyrics()

    if (!lyricsPath) {
      this.hideLyrics()
      return
    }

    try {
      const response = await fetch(utils.lyricsURL(lyricsPath))

      if (!response.ok) {
        this.hideLyrics()
        return
      }

      const lyricsText = await response.text()

      if (requestId !== this.lyricsRequestId) {
        return
      }

      const parsedLyrics = this.parseLyrics(lyricsText)

      if (!parsedLyrics.length) {
        this.hideLyrics()
        return
      }

      this.lyricsLines = parsedLyrics
      this.currentLyricsIndex = -1
      this.showLyrics()
      this.updateLyrics()
    } catch {
      if (requestId === this.lyricsRequestId) {
        this.hideLyrics()
      }
    }
  },

  updateLyrics() {
    if (!this.lyrics || !this.lyricsLines.length) {
      return
    }

    const currentTime = this.audio.currentTime

    let currentIndex = -1
    for (let index = this.lyricsLines.length - 1; index >= 0; index -= 1) {
      if (currentTime >= this.lyricsLines[index].time) {
        currentIndex = index
        break
      }
    }

    if (currentIndex === this.currentLyricsIndex) {
      return
    }

    this.currentLyricsIndex = currentIndex

    if (currentIndex === -1) {
      this.setLyrics('')
      return
    }

    this.setLyrics(this.lyricsLines[currentIndex].text)
  },
}
