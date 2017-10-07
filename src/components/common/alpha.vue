<template>
  <div class="k-alpha">
    <div class="k-checkboard-wrap">
      <checkboard></checkboard>
    </div>
    <div class="k-alpha-gradient" :style="{background: gradientColor}"></div>
    <div class="k-alpha-container" ref="container" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
      <div class="k-alpha-pointer" :style="{left: colors.a * 100 + '%'}">
        <div class="k-alpha-picker"></div>
      </div>
    </div>
  </div>
</template>

<script>
import checkboard from './checkboard.vue'
export default {
  name: 'Alpha',
  props: {
    value: Object,
    onChange: Function
  },
  components: {
    checkboard
  },
  computed: {
    colors() {
      return this.value
    },
    gradientColor() {
      var rgba = this.colors.rgba
      var rgbStr = [rgba.r, rgba.g, rgba.b].join(',')
      return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)'
    }
  },
  methods: {
    handleChange(e, skip) {
      !skip && e.preventDefault()
      var container = this.$refs.container
      var containerWidth = container.clientWidth
      var xOffset = container.getBoundingClientRect().left + window.pageXOffset
      var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
      var left = pageX - xOffset
      var a
      if (left < 0) {
        a = 0
      } else if (left > containerWidth) {
        a = 1
      } else {
        a = Math.round(left * 100 / containerWidth) / 100
      }
      if (this.colors.a !== a) {
        this.$emit('change', {
          h: this.colors.hsl.h,
          s: this.colors.hsl.s,
          l: this.colors.hsl.l,
          a: a,
          source: 'rgba'
        })
      }
    },
    handleMouseDown(e) {
      this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp() {
      this.unbindEventListeners()
    },
    unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>
