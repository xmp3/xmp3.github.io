document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.progressbar-container')
  .forEach(progressbar => {
    let dragging = false
    let min = +progressbar.getAttribute('data-min') || 0
    let max = +progressbar.getAttribute('data-max') || 1
    let step = +progressbar.getAttribute('data-step') || 0.1
    let value = +progressbar.getAttribute('data-value') || 0
    let onchange = () => {}

    Object.defineProperty(progressbar, 'min', {
      get: () => min,
      set: (v) => min = Number(v)
    })
    Object.defineProperty(progressbar, 'max', {
      get: () => max,
      set: (v) => max = Number(v)
    })
    Object.defineProperty(progressbar, 'step', {
      get: () => step,
      set: () => step = Number(v)
    })
    Object.defineProperty(progressbar, 'value', {
      get: () => value,
      set: (v) => {
        value = Number(v)
        const percentage = (value / max) * 100
        progressbar.style.setProperty('--progressbar-transform', percentage + '%')
      }
    })
    Object.defineProperty(progressbar, 'dragging', {
      get: () => dragging
    })
    Object.defineProperty(progressbar, 'onchange', {
      set: (f) => onchange = f
    })

    const onChange = (clientX) => {
      const rect = progressbar.getBoundingClientRect()
      let offsetX = clientX - rect.left
      offsetX = Math.max(0, Math.min(offsetX, rect.width))
      let v = (offsetX / rect.width) * (max - min) + min
      progressbar.value = Math.round(v / step) * step
      onchange()
    }

    const onMouseDown = (event) => {
      dragging = true
      onChange(event.clientX)
    }
    const onMouseMove = (event) => {
      if (dragging) {
        onChange(event.clientX)
      }
    }
    const onMouseUp = () => {
      dragging = false
    }

    const onTouchStart = (event) => {
      dragging = true
      onChange(event.touches[0].clientX)
    }
    const onTouchMove = (event) => {
      if (dragging) {
        onChange(event.touches[0].clientX)
      }
    }
    const onTouchEnd = () => {
      dragging = false
    }

    progressbar.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseUp)

    progressbar.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)
    document.addEventListener('touchcancel', onTouchEnd)
  })
})
