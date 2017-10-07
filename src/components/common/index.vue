<template>
  <div class="k-color-picker">
    <div class="k-saturation-wrap">
      <saturation v-model="colors" @change="childChange" @changed="handleChanged"></saturation>
    </div>
    <div class="k-color-picker-body">
      <div class="k-color-picker-body__controls">
        <div class="k-color-wrap">
          <div class="k-active-color" :style="[{background: activeColor}, { marginTop: showAlpha ? '6px' : '-3px'}]"></div>
        </div>
  
        <div class="k-sliders">
          <div class="k-hue-wrap">
            <hue v-model="colors" @change="childChange" @changed="handleChanged"></hue>
          </div>
          <div class="k-alpha-wrap" v-if="showAlpha">
            <alpha v-model="colors" @change="childChange"></alpha>
          </div>
        </div>
      </div>
      <transition name="mp-zoom-in-top">
        <div class="k-color-picker-body__fields-wrap" v-show="showFields">
          <div class="k-fields" v-show="fieldsIndex === 0">
            <!-- hex -->
            <div class="k-field">
              <ed-in label="hex" v-model="colors.hex" @change="inputChange"></ed-in>
            </div>
          </div>
          <div class="k-fields" v-show="fieldsIndex === 1">
            <!-- rgba -->
            <div class="k-field">
              <ed-in label="r" v-model="colors.rgba.r" @change="inputChange"></ed-in>
            </div>
            <div class="k-field">
              <ed-in label="g" v-model="colors.rgba.g" @change="inputChange"></ed-in>
            </div>
            <div class="k-field">
              <ed-in label="b" v-model="colors.rgba.b" @change="inputChange"></ed-in>
            </div>
              <div class="k-field" v-show="showAlpha">
              <ed-in label="a" v-model="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
            </div>  
          </div>
          <div class="k-fields" v-show="fieldsIndex === 2">
            <!-- hsla -->
            <div class="k-field">
              <ed-in label="h" v-model="colors.hsl.h" @change="inputChange"></ed-in>
            </div>
            <div class="k-field">
              <ed-in label="s" v-model="colors.hsl.s" @change="inputChange"></ed-in>
            </div>
            <div class="k-field">
              <ed-in label="l" v-model="colors.hsl.l" @change="inputChange"></ed-in>
            </div>
              <div class="k-field" v-show="showAlpha">
              <ed-in label="a" v-model="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
            </div>  
          </div>
          <div class="k-toggle-btn" @click="toggleViews">
            <div class="k-icon">
              <svg style="width:24px; height:24px" viewBox="0 0 24 24" @mouseover="showHighlight" @mouseenter="showHighlight" @mouseout="hideHighlight">
                <path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
              </svg>
            </div>
            <div class="k-icon-highlight" v-show="highlight"></div>
          </div>
        </div>
      </transition>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import colorMixin from './color'
import editableInput from './editableinput.vue'
import saturation from './saturation.vue'
import hue from './hue.vue'
import alpha from './alpha.vue'
export default {
  name: 'ColorPicker',
  mixins: [colorMixin],
  props: {
    showFields: {
      type: Boolean,
      default: false
    },
    showAlpha: {
      type: Boolean,
      default: true
    }
  },
  components: {
    saturation,
    hue,
    alpha,
    'ed-in': editableInput
  },
  data() {
    return {
      fields: ['hex', 'rgba', 'hsla'],
      fieldsIndex: 0,
      highlight: false
    }
  },
  computed: {
    activeColor() {
      var rgba = this.colors.rgba
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
    }
  },
  methods: {
    handlePreset(c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      })
    },
    childChange(data) {
      this.colorChange(data)
    },
    inputChange(data) {
      if (!data) {
        return
      }
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: 'hex'
        })
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        })
      }
    },
    toggleViews() {
      if (this.fieldsIndex >= 2) {
        this.fieldsIndex = 0
        return
      }
      this.fieldsIndex++
    },
    showHighlight() {
      this.highlight = true
    },
    hideHighlight() {
      this.highlight = false
    },
    handleChanged() {
      this.$emit('changed', this.colors)
    }
  }
}
</script>
