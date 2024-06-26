const data = Array.from(document.querySelectorAll('.listitem'))
.map(track => ({
  title: track.getAttribute('data-title'),
  artist: track.getAttribute('data-artist'),
  cover: track.getAttribute('data-cover'),
  file: track.getAttribute('data-file')
}))
export default data
