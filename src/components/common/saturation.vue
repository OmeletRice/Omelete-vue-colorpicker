<template>
  <div class="k-saturation" :style="{background: bgColor}" ref="container" @mousedown="handleMouseDown">
    <div class="k-saturation--white"></div>
    <div class="k-saturation--black"></div>
    <div class="k-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
      <div class="k-saturation-circle"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Saturation',
  props: {
    value: Object,
    showAlpha: Boolean
  },
  computed: {
    colors() {
      return this.value
    },
    bgColor() {
      return `hsl(${this.colors.hsv.h}, 100%, 50%)`
    },
    pointerTop() {
      return (-(this.colors.hsv.v * 100) + 1) + 100 + '%'
    },
    pointerLeft() {
      return this.colors.hsv.s * 100 + '%'
    }
  },
  methods: {
    throttle: _.throttle((fn, data) => {
      fn(data)
    }, 20,
      {
        'leading': true,
        'trailing': false
      }),
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
      if (left < 0) {
        left = 0
      } else if (left > containerWidth) {
        left = containerWidth
      } else if (top < 0) {
        top = 0
      } else if (top > containerHeight) {
        top = containerHeight
      }
      var saturation = left / containerWidth
      var bright = -(top / containerHeight) + 1
      bright = bright > 0 ? bright : 0
      bright = bright > 1 ? 1 : bright
      this.throttle(this.onChange, {
        h: this.colors.hsv.h,
        s: saturation,
        v: bright,
        a: this.colors.hsv.a,
        source: 'hsva'
      })
    },
    onChange(param) {
      if (!this.showAlpha) {
        param.a = 1
      }
      this.$emit('change', param)
    },
    handleMouseDown(e) {
      // this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp(e) {
      this.unbindEventListeners()
      this.$emit('changed')
    },
    unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>
