export default class {
  constructor(progressbar) {
    this.progressbar = progressbar
    this.properties = {}
    this.dragging = false
    this.defineAttributes()
    this.defineProperties()
    this.addEventListeners()
  }

  defineAttributes() {
    this.attributes = {
      min: 0,
      max: 1,
      step: .1,
      value: 0,
    }

    Object.keys(this.attributes).forEach(
      attribute => this[attribute] =
        +this.progressbar.getAttribute('attr-' + attribute) || this.attributes[attribute]
    )
  }

  defineProperties() {
    this.properties.dragging = {
      get: () => this.dragging,
    }

    this.properties.min = {
      get: () => this.min,
      set: min => this.min = +min,
    }

    this.properties.max = {
      get: () => this.max,
      set: max => this.max = +max,
    }

    this.properties.step = {
      get: () => this.step,
      set: step => this.step = +step,
    }

    this.properties.value = {
      get: () => this.value,
      set: value => this.update(value),
    }

    this.properties.onchange = {
      set: onchange => this.onchange = onchange,
    }

    Object.keys(this.properties).forEach(property =>
      Object.defineProperty(this.progressbar, property, this.properties[property])
    )
  }

  addEventListeners() {
    this.progressbar.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.progressbar.addEventListener('touchstart', this.onTouchStart.bind(this))
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
    document.addEventListener('mouseleave', this.onMouseUp.bind(this))
    document.addEventListener('touchmove', this.onTouchMove.bind(this))
    document.addEventListener('touchend', this.onTouchEnd.bind(this))
    document.addEventListener('touchcancel', this.onTouchEnd.bind(this))
  }

  eventHandler(event) {
    if (typeof this[event] === 'function') {
      this[event]()
    }
  }

  eventChange(clientX) {
    const rect = this.progressbar.getBoundingClientRect()
    let offsetX = clientX - rect.left
    offsetX = Math.max(0, Math.min(offsetX, rect.width))
    let v = (offsetX / rect.width) * (this.max - this.min) + this.min
    this.progressbar.value = Math.round(v / this.step) * this.step
    this.eventHandler('onchange')
  }

  onMouseDown(event) {
    this.dragging = true
    this.eventChange(event.clientX)
  }

  onMouseMove(event) {
    if (this.dragging) {
      this.eventChange(event.clientX)
    }
  }

  onMouseUp() {
    this.dragging = false
  }

  onTouchStart(event) {
    this.dragging = true
    this.eventChange(event.touches[0].clientX)
  }

  onTouchMove(event) {
    if (this.dragging) {
      this.eventChange(event.touches[0].clientX)
    }
  }

  onTouchEnd() {
    this.dragging = false
  }

  update(value) {
    this.value = +value
    const percentage = (this.value / this.max) * 100
    this.progressbar.style.setProperty('--progressbar-transform', percentage + '%')
  }
}
