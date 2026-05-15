export function URL(path = '/') {
  return 'https://raw.githubusercontent.com/xmp3' + path
}

export function imageURL(image) {
  return image.startsWith('https://') ? image : URL('/images/' + image)
}

export function audioURL(audio) {
  return audio.startsWith('https://') ? audio : URL('/tracks/' + audio)
}

export function lyricsURL(lyrics) {
  return lyrics.startsWith('https://') ? lyrics : URL('/lyrics/' + lyrics)
}

export function currentIndex(audioData = []) {
  const hash = window.location.hash.slice(1)

  if (!hash) {
    return 0
  }

  const hashedIndex = audioData.findIndex(track => track.id === hash)
  if (hashedIndex !== -1) {
    return hashedIndex
  }

  if (/^\d+$/.test(hash)) {
    const legacyIndex = Number(hash) - 1
    if (legacyIndex >= 0 && legacyIndex < audioData.length) {
      return legacyIndex
    }
  }

  return 0
}

export function convertTo12HourFormat(time) {
  const convertToTwoDigits = number => ('0' + Math.floor(number)).slice(-2)
  return convertToTwoDigits(time / 60) + ':' + convertToTwoDigits(time % 60)
}

export function generateFilename(filename, ...names) {
  const extension = path => path.split('.').pop()
  return names.join(' - ') + '.' + extension(filename)
}
