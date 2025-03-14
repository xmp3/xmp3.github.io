export function URL(path = '/') {
  return 'https://raw.githubusercontent.com/xmp3' + path
}

export function imageURL(image) {
  return image.startsWith('https://') ? image : URL('/images/' + image)
}

export function audioURL(audio) {
  return audio.startsWith('https://') ? audio : URL('/tracks/' + audio)
}

export function currentIndex() {
  return window.location.hash.slice(1) - 1 || 0
}

export function convertTo12HourFormat(time) {
  const convertToTwoDigits = number => ('0' + Math.floor(number)).slice(-2)
  return convertToTwoDigits(time / 60) + ':' + convertToTwoDigits(time % 60)
}

export function generateFilename(filename, ...names) {
  const extension = path => path.split('.').pop()
  return names.join(' - ') + '.' + extension(filename)
}
