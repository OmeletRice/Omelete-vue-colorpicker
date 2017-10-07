<template>
  <transition name="om-zoom-in-top" @after-leave="doDestroy">
    <div class="om-color-dropdown" v-show="showPopper">
      <div class="om-color-compact">

        <ul class="om-compact-colors">
          <li class="om-compact-color-item" v-for="c in defaultColors" :key="c" @mousedown.stop="handlerCompactClick(c)" @mouseup.stop="handleMouseUp" :class="{'om-compact-color-item--white': c === '#FFFFFF' }" :style="{background: c}">
            <div class="om-compact-dot" v-show="c === pick"></div>
          </li>
        </ul>

        <ul class="om-color-history">
          <li class="om-color-transparent om-color-history-item" @mousedown.stop="handlerCompactClick('transparent')" @mouseup.stop="handleMouseUp"></li>
          <li class="om-color-history-item" v-for="(c, idx) in colorList" :key="idx" v-if="idx < 11" @mousedown.stop="handlerCompactClick(c)" @mouseup.stop="handleMouseUp" :class="{'om-compact-color-item--white': c === '#FFFFFF' }" :style="{background: c}">
            <div class="om-compact-dot" v-show="c === pick"></div>
          </li>
        </ul>

        <div class="om-color-compare-color">
          <div class="om-color-compare-color__old-color" :style="{background: colorStyle(enterColor)}" @mousedown.stop="handlerCompactClick(enterColor)" @mouseup.stop="handleMouseUp"></div>
          <input class="om-color-compare-color__old-color-text" type="text" :value="colorText(enterColor)" readonly/>
          <div class="om-color-compare-color__new-color" :style="{background: colorStyle(val.hex || val)}"></div>
          <input class="om-color-compare-color__new-color-text" type="text" :value="colorText(val.hex || val)" readonly/>
        </div>

      </div>
      <div class="om-color-common">
        <k-color-picker ref="chrome" v-model="val" :show-alpha="showAlpha" :show-fields="showFields" @change="handleColorChange" @changed="handleColorChanged">
          <div class="om-color-dropdown__control">
            <div class="om-color-dropdown__control-more" @click.stop="switchFields">
              <span>{{ switchText }}</span>
            </div>
          </div>
        </k-color-picker>
      </div>
    </div>
  </transition>
</template>

<script>
import Popper from './utils/vue-popper';
import KColorPicker from './common/index'

const defaultColors = [
  '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
  '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
  '#333333', '#808080', '#CCCCCC', '#D33115', '#E27300', '#FCC400',
  '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
  '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
]

export default {
  name: 'MpColorPickerDropdown',

  components: {
    KColorPicker
  },

  mixins: [Popper],

  props: {
    colors: {
      required: true
    },
    showAlpha: Boolean,
    showFields: Boolean,
    colorList: Array,
    enterColor: [Object, String]
  },

  data() {
    return {
      isFields: this.showFields,
      changedColor: null,
      val: this.colors,
      defaultColors: defaultColors,
      oldColor: this.colors
    }
  },

  watch: {
    colors(newColor, oldColor) {
      this.oldColor = newColor
    }
  },

  computed: {
    switchText() {
      // return this.isFields ? t('mp.colorPicker.up') : t('mp.colorPicker.more')
    },
    pick() {
      if (!this.changedColor || this.changedColor.a === 0) return
      return this.changedColor.hex
    }
    // historyColorList() {
    //   const preLen = 12
    //   const colorListLen = this.colorList.length
    //   let len = Math.min(preLen, colorListLen)
    //   // let returnList = _.cloneDeep(this.colorList.slice(0, len))
    //   let returnList = _.cloneDeep(this.colorList)
    //   // console.log(returnList)
    //   let list = []
    //   debugger
    //   for (let i = 0; i < len; i++) {
    //     const unshiftVal = returnList.shift()
    //     // let hasColor = false
    //     _.forEach(returnList, (val, idx) => {
    //       if (val === unshiftVal) {
    //         // hasColor = true
    //         // if (idx > len) {
    //         returnList.splice(idx, 1)
    //         // }
    //       }
    //     })
    //     list.push(unshiftVal)
    //   }
    //   return list
    // }
  },

  methods: {
    handleColorChanged(newColor) {
      this.changedColor = newColor
      this.$emit('changed', newColor)
    },
    handleColorChange(newColor) {
      this.$emit('change', newColor)
    },
    switchFields() {
      this.isFields = !this.isFields
    },
    handlerCompactClick(c) {
      this.val = c
    },
    handleMouseUp() {
      const newColor = this.$refs.chrome.colors
      this.changedColor = newColor
      this.$emit('changed', newColor)
    },
    colorStyle(color) {
      const transparentColor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC) left center'
      if (color === 'transparent') {
        return transparentColor
      } else {
        return color
      }
    },
    colorText(color) {
      return color === 'transparent' ? 'transparent' : color
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el;
    this.referenceElm = this.$parent.$el;
  }
}
</script>
