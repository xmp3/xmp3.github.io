import ProgressBar from './progressbar.js'

document.addEventListener('DOMContentLoaded', () => {
  const progressbars = document.querySelectorAll('.progressbar-container')
  progressbars.forEach(progressbar => new ProgressBar(progressbar))
})
