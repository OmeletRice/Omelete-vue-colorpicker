<template>
  <div :class="[ 'om-color-picker', size ? 'om-color-picker--' + size : '' ]">
    <div :class="['om-color-picker__trigger', fc_dropdown.focus ? 'is-show':'']">
      <!-- <i :class="['om-color-picker__icon om-icon om-icon-caret-top', showPicker ? 'is-reverse':'']" @click.stop="handleClick"></i> 别删 -->
      <span class="om-color-picker__color" :class="{ 'is-alpha': showAlpha }" @click="handleClick">
        <span class="om-color-picker__color-inner" :style="bgColorStyle"></span>
      </span>
      <input class="om-color-picker__input" v-model="displayColor" @change.stop="handleInputChange"/>
    </div>
    <picker-dropdown :enter-color="fc_dropdown.enterValue || value" ref="dropdown" v-model="fc_dropdown.focus" class="om-color-picker__panel" :color-list="colorList" :colors="val" :show-alpha="showAlpha" @change="handleColorChange" @changed="handleColorChanged">
    </picker-dropdown>
  </div>
</template>

<script>
import PickerDropdown from './picker-dropdown.vue';
import FocusControl from './utils/FocusControl'
import tinycolor from 'tinycolor2'
import _ from 'lodash'
export default {
  name: 'MpColorPicker',

  props: {
    value: {
      type: [Object, String]
    },
    showAlpha: {
      type: Boolean
    },
    colorList: {
      type: Array
    },
    size: String
  },

  data() {
    const self = this;
    return {
      displayColor: this.value,
      val: this.value,
      oldDisplayColor: this.value,
      fc_dropdown: new FocusControl(
        () => self.$refs.dropdown.$el,
        v => self.$emit('leave', self.displayColor, v)
      )
    }
  },

  watch: {
    value(value) {
      this.displayColor = value
      this.val = value
    }
  },

  methods: {
    handleColorChange(newColor) {
      this.$emit('change', this.formatDisplayColor(newColor))
      this.displayColor = this.formatDisplayColor(newColor)
    },
    handleColorChanged(newColor) {
      this.$emit('changed', this.formatDisplayColor(newColor))
      this.oldDisplayColor = this.displayColor = this.formatDisplayColor(newColor)
    },
    formatDisplayColor(color) {
      const _color = tinycolor(color)
      if (!this.showAlpha) {
        if (_color.getAlpha() === 0) {
          return 'transparent'
        } else {
          return color.hex
        }
      } else {
        return color
      }
    },
    handleInputChange() {
      if (this.isValidColor(this.displayColor)) {
        this.oldDisplayColor = _.cloneDeep(this.displayColor)
        this.$refs.dropdown.$refs.chrome.colorChange(this.displayColor)
        this.val = this.displayColor
        this.$emit('changed', this.formatDisplayColor(this.$refs.dropdown.$refs.chrome.colors))
      } else {
        this.$refs.dropdown.$refs.chrome.colorChange(this.oldDisplayColor)
        this.val = this.oldDisplayColor
      }
    },
    handleClick() {
      if (!this.fc_dropdown.focus) {
        this.fc_dropdown.hook(this.displayColor);
        this.$emit('enter', this.displayColor);
      }
    },
    isValidColor(hex) {
      const color = tinycolor(hex)
      return color.isValid()
    },
    areaElements() {
      return this.fc_dropdown.focus ? [ this.$refs.dropdown.$el ] : [];
    }
  },

  computed: {
    bgColorStyle() {
      const transparentColor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC) left center'
      if (this.displayColor === 'transparent') {
        return `background: ${transparentColor}`
      } else {
        return `background: ${this.displayColor}`
      }
    }
  },

  components: {
    PickerDropdown
  },

  mounted() {
    this.popperElm = this.$refs.dropdown.$el;
  }
};
</script>


<style>
.om-color-picker {
  display: inline-block;
  position: relative;
  line-height: normal;
  cursor: pointer;
  background: #fff
}

.om-color-picker__trigger {
  display: inline-block;
  box-sizing: border-box;
  height: 36px;
  padding: 6px;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  font-size: 0;
  position: relative;
  text-align: left;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  display: block;
  position: relative;
  font-size: 14px;
}

.om-color-picker__trigger:hover {
  border-color: #8391a5
}

.om-color-picker__trigger:focus,
.om-color-picker__trigger.is-show {
  outline: none;
  border-color: #00b2f0
}

.om-color-picker__color {
  position: absolute;
  top: 5px;
  left: 5px;
  bottom: 5px;
}

.om-color-picker__color.is-alpha {
  /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) */
}

.om-color-picker__color-inner {
  width: 24px;
  height: 24px;
  display: inline-block;
  border: 1px solid #dadada;
  border-radius: 2px
}

.om-color-picker__input {
  width: 100%;
  height: 100%;
  border: 0px;
  outline: none;
  background: transparent;
  padding: 0px 20px 0 26px;
  font-size: 14px;
  line-height: 22px;
}

.om-color-picker__icon {
  position: absolute;
  width: 33px;
  height: 100%;
  right: 0;
  text-align: center;
  color: #bfcbd9;
  font-size: 12px;
  transition: transform .3s;
  transform: translateY(-50%) rotate(180deg);
  top: 50%;
  cursor: pointer;
  line-height: 36px;
}

.om-color-picker__icon.om-icon-caret-top.is-reverse {
  transform: translateY(-50%);
}

.om-color-picker__panel {
  position: absolute;
  z-index: 10;
  /* padding: 6px 0px; */
}

.om-color-dropdown__control {
  margin-top: 10px;
  text-align: right;
  vertical-align: bottom
}

.om-color-dropdown__control-more {
  float: left;
  font-size: 13px;
  margin-top: 6px;
  cursor: pointer
}


/* k-color-picker body start */

.k-color-picker {
  background: #fff;
  border-radius: 2px;
  /* box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 4px 8px rgba(0, 0, 0, .3); */
  box-sizing: initial;
  width: 225px;
  font-family: Menlo;
  background-color: #fff;
}

.k-color-picker-body__controls {
  display: flex;
}

.k-color-wrap {
  width: 32px;
}

.k-active-color {
  margin-top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.09);
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC) left center;
}

.k-sliders {
  flex: 1;
}

.k-color-picker-body__fields-wrap {
  display: flex;
  padding-top: 16px;
}

.k-fields {
  display: flex;
  margin-left: -6px;
  flex: 1;
}

.k-field {
  padding-left: 6px;
  width: 100%;
}

.k-toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}

.k-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.k-icon-highlight {
  position: absolute;
  width: 24px;
  height: 28px;
  background: #eee;
  border-radius: 4px;
  top: 10px;
  left: 12px;
}

.k-hue-wrap {
  position: relative;
  height: 10px;
  margin-bottom: 8px;
}

.k-alpha-wrap {
  position: relative;
  height: 10px;
}

.k-hue-wrap .k-hue,
.k-alpha-wrap .gradient {
  border-radius: 2px;
}

.k-hue-wrap .k-hue-picker,
.k-alpha-wrap .k-hue-picker {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transform: translate(-6px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}

.k-color-picker-body {
  padding: 16px 16px 12px;
  background-color: #fff;
  height: 100%
}

.k-saturation-wrap {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}

.k-saturation-wrap .k-saturation-circle {
  width: 12px;
  height: 12px;
}

.k-fields .k-editable-input__input {
  font-size: 11px;
  color: #333;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 1px #dadada;
  height: 21px;
  text-align: center;
}

.k-fields .k-editable-input__label {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}


/* k-color-picker body end  */


/* k-color-picker hue start */

.k-hue {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
}

.k-hue--horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}

.k-hue--vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}

.k-hue-container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}

.k-hue-pointer {
  z-index: 2;
  position: absolute;
}

.k-hue-picker {
  cursor: pointer;
  margin-top: 1px;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  transform: translateX(-2px);
}


/* k-color-picker hue end  */


/* k-color-picker alpha start  */

.k-alpha {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.k-checkboard-wrap {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
}

.k-alpha-gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.k-alpha-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}

.k-alpha-pointer {
  z-index: 2;
  position: absolute;
}

.k-alpha-picker {
  cursor: pointer;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  margin-top: 1px;
  transform: translateX(-2px);
}


/* k-color-picker alpha end  */


/* k-color-picker checkerboard start  */

.k-checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}


/* k-color-picker checkerboard end  */


/* k-color-picker saturation start  */

.k-saturation,
.k-saturation--white,
.k-saturation--black {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.k-saturation--white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

.k-saturation--black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

.k-saturation-pointer {
  cursor: pointer;
  position: absolute;
}

.k-saturation-circle {
  cursor: head;
  width: 4px;
  height: 4px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, .3), 0 0 1px 2px rgba(0, 0, 0, .4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}


/* k-color-picker saturation end  */


/* k-color-picker editableInput start  */

.k-editable-input {
  position: relative;
}

.k-editable-input__input {
  padding: 0;
  border: 0;
  outline: none;
}

.k-editable-input__label {
  text-transform: capitalize;
}


/* k-color-picker editableInput end  */

.om-color-dropdown {
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .3), 0 4px 8px rgba(0, 0, 0, .3);
  background-color: #fff;
  overflow: hidden
}

.om-color-compact {
  width: 236px;
  height: 160px;
  display: inline-block;
  vertical-align: top;
  padding: 10px;
  position: relative;
  overflow: hidden;
  /* margin-right: -5px */
}

.om-color-common {
  vertical-align: top;
  display: inline-block;
  box-shadow: -1px 0px 1px rgba(0, 0, 0, .3)
}

.om-compact-colors {
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.om-compact-color-item {
  list-style: none;
  width: 15px;
  height: 15px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
}

.om-compact-color-item:nth-child(12n) {
  margin-right: 0px
}

.om-compact-color-item--white {
  box-shadow: inset 0 0 0 1px #ddd;
}

.om-compact-color-item--white .om-compact-dot {
  background: #000;
}

.om-compact-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 50%;
  opacity: 1;
  background: #fff;
}

.om-color-compare-color {
  display: flex;
  margin: 5px 0
}

.om-color-compare-color__old-color {
  width: 24px;
  height: 24px;
  margin-right: 5px;
  border: 1px solid #cccccc;
  cursor: pointer;
  border-radius: 50%;
}

.om-color-compare-color__old-color-text {
  font-size: 13px;
  width: 80px;
  margin-right: 10px;
  border: 1px solid #eaeaea;
  text-align: center;
  color: #969696;
  border-radius: 4px;
}

.om-color-compare-color__new-color {
  width: 24px;
  height: 24px;
  border: 1px solid #cccccc;
  cursor: pointer;
  border-radius: 50%;
  margin-right: 5px;
}

.om-color-compare-color__new-color-text {
  font-size: 13px;
  width: 80px;
  border: 1px solid #eaeaea;
  text-align: center;
  color: #969696;
  border-radius: 4px;
}

.om-color-history {
  overflow: hidden;
  padding: 0;
  margin: 5px 0 5px 0;
  height: 55px;
  background: #f3f3f3;
  padding: 5px
}

.om-color-history-item {
  list-style: none;
  width: 25px;
  height: 25px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0px 1px 2px 0px rgba(107, 107, 107, 0.38);
}

.om-color-transparent {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC) left center;
}


.om-color-picker--small .om-color-picker__trigger {
  width: 130px;
  height: 30px;
  padding: 0px
}

.om-color-picker--small .om-color-picker__input {
  padding: 1px 5px 0 30px;
}

.om-color-picker--small .om-color-picker__color {
  top: 4px;
  left: 4px
}

.om-color-picker--small .om-color-picker__color-inner {
  width: 20px;
  height: 20px
}

.om-color-picker--small .om-color-picker__icon {
  line-height: 28px
}

.om-zoom-in-top-enter-active,
.om-zoom-in-top-leave-active {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  opacity: 1;
  transform: scaleY(1);
  transition: transform .3s cubic-bezier(.23, 1, .32, 1) .1s, opacity .3s cubic-bezier(.23, 1, .32, 1) .1s;
  transform-origin: center top;
}

.om-zoom-in-top-enter,
.om-zoom-in-top-leave-active {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  opacity: 0;
  transform: scaleY(0);
}
</style>
