export default [...document.querySelectorAll('.listitem')]
  .map(item => ({
    title: item.getAttribute('attr-title'),
    artist: item.getAttribute('attr-artist'),
    cover: item.getAttribute('attr-cover'),
    file: item.getAttribute('attr-file'),
  }))
