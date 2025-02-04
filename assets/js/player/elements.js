import * as utils from './utils.js'

export default {
  get() {
    this.cover = document.querySelector('#cover')
    this.title = document.querySelector('#title')
    this.artist = document.querySelector('#artist')
    this.playPauseButton = document.querySelector('#play-pause')
    this.nextButton = document.querySelector('#next')
    this.previousButton = document.querySelector('#previous')
    this.volumeButton = document.querySelector('#volume')
    this.volumeControl = document.querySelector('#volume-control')
    this.seekbar = document.querySelector('#seekbar')
    this.currentDuration = document.querySelector('#current-duration')
    this.totalDuration = document.querySelector('#total-duration')
    this.downloadButton = document.querySelector('#download')
    this.collection = document.querySelectorAll('.listitem')
    this.playIcon = '<svg viewBox="0 0 16 16" class="size-5"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>'
    this.pauseIcon = '<svg viewBox="0 0 16 16" class="size-5"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>'
    this.mutedIcon = '<svg viewBox="0 0 16 16" class="size-5"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>'
    this.soundIcon = '<svg viewBox="0 0 16 16" class="size-5"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>'
  },

  createAudioElement(audio) {
    this.audio = new Audio(audio)
  },

  actions() {
    this.playPauseButton.onclick = () => this.togglePlayPause()
    this.audio.onended = () => this.next()

    this.volumeButton.onclick = () => this.toggleMute()
    this.volumeControl.onchange = () => this.setVolume(this.volumeControl.value)

    this.seekbar.onchange = () => this.setSeekbar(this.seekbar.value)

    this.seekbar.max = this.audio.duration
    this.totalDuration.innerText = utils.convertTo12HourFormat(this.audio.duration)

    this.audio.ontimeupdate = () => this.timeUpdate()

    this.nextButton.onclick = () => this.next()
    this.previousButton.onclick = () => this.back()

    this.collection.forEach(
      (track, index) => track.onclick = () => this.swap(index)
    )

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlayPause())
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next())
      navigator.mediaSession.setActionHandler('previoustrack', () => this.back())
      navigator.mediaSession.setActionHandler('seekto', (event) => {
        if (event.seekTime && typeof event.seekTime === 'number') {
          this.setSeekbar(event.seekTime)
        }
      })
    }
  },
}
