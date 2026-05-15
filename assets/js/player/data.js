export default [...document.querySelectorAll('.listitem')]
  .map(item => ({
    id: item.getAttribute('href').split('#').pop(),
    title: item.getAttribute('attr-title'),
    artist: item.getAttribute('attr-artist'),
    cover: item.getAttribute('attr-cover'),
    file: item.getAttribute('attr-file'),
    lyrics: item.getAttribute('attr-lyrics'),
  }))
