<template>
  <div :class="['k-hue', directionClass]">
    <div class="k-hue-container" ref="container" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
      <div class="k-hue-pointer" :style="{top: pointerTop, left: pointerLeft}">
        <div class="k-hue-picker"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hue',
  props: {
    value: Object,
    direction: {
      type: String,
      // [horizontal | vertical]
      default: 'horizontal'
    }
  },
  data() {
    return {
      oldHue: 0,
      pullDirection: ''
    }
  },
  computed: {
    colors() {
      const h = this.value.hsl.h
      if (h !== 0 && h - this.oldHue > 0) this.pullDirection = 'right'
      if (h !== 0 && h - this.oldHue < 0) this.pullDirection = 'left'
      this.oldHue = h
      return this.value
    },
    directionClass() {
      return {
        'k-hue--horizontal': this.direction === 'horizontal',
        'k-hue--vertical': this.direction === 'vertical'
      }
    },
    pointerTop() {
      if (this.direction === 'vertical') {
        if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return 0
        return -((this.colors.hsl.h * 100) / 360) + 100 + '%'
      } else {
        return 0
      }
    },
    pointerLeft() {
      if (this.direction === 'vertical') {
        return 0
      } else {
        if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return '100%'
        return (this.colors.hsl.h * 100) / 360 + '%'
      }
    }
  },
  methods: {
    handleChange(e, skip) {
      !skip && e.preventDefault()
      var container = this.$refs.container
      var containerWidth = container.clientWidth
      var containerHeight = container.clientHeight
      var xOffset = container.getBoundingClientRect().left + window.pageXOffset
      var yOffset = container.getBoundingClientRect().top + window.pageYOffset
      var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
      var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
      var left = pageX - xOffset
      var top = pageY - yOffset
      var h
      var percent
      if (this.direction === 'vertical') {
        if (top < 0) {
          h = 360
        } else if (top > containerHeight) {
          h = 0
        } else {
          percent = -(top * 100 / containerHeight) + 100
          h = (360 * percent / 100)
        }
        if (this.colors.hsl.h !== h) {
          this.$emit('change', {
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          })
        }
      } else {
        if (left < 0) {
          h = 0
        } else if (left > containerWidth) {
          h = 360
        } else {
          percent = left * 100 / containerWidth
          h = (360 * percent / 100)
        }
        if (this.colors.hsl.h !== h) {
          this.$emit('change', {
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          })
        }
      }
    },
    handleMouseDown(e) {
      this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp(e) {
      this.unbindEventListeners()
      this.$emit('changed')
    },
    unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>
