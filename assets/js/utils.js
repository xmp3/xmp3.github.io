export function title(text) {
  return text + ' | xmp3'
}

export function URL(path = '/') {
  return 'https://xmp3.github.io' + path
}

export function imageURL(image) {
  return image.startsWith('https://') ? image : URL('/image/' + image)
}

export function audioURL(audio) {
  return audio.startsWith('https://') ? audio : URL('/audio/' + audio)
}

export function download(file, ...names) {
  return names.join(' - ') + '.' + extension(file)
}

const extension = file => file.split('.').pop()

export function formatTime(time) {
  return formatNumber(time / 60) + ':' + formatNumber(time % 60)
}

const formatNumber = number => ('0' + Math.floor(number)).slice(-2)

export function currentIndex() {
  return Number(window.location.hash.slice(1)) - 1 || 0
}

export function updateSelected(hash) {
  const setTrue = (item) => item.setAttribute('data-selected', 'true')
  const setFalse = (item) => item.setAttribute('data-selected', 'false')
  document.querySelectorAll('.listitem[data-selected=true]').forEach(setFalse)
  document.querySelectorAll('.listitem[href="' + hash + '"]').forEach(setTrue)
}
