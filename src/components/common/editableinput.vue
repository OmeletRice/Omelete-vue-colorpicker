<template>
  <div class="k-editable-input">
    <input class="k-editable-input__input" :value="val" @keydown="handleKeyDown" @input="update">
    <span class="k-editable-input__label">{{label}}</span>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'editableInput',
  props: {
    label: String,
    value: [String, Number],
    max: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val() {
      return this.value
    }
  },
  filters: {
    maxFilter: {
      read(val) {
        if (this.max && val > this.max) {
          return this.max
        } else {
          return val
        }
      },
      write(val, oldVal) {
        return val
      }
    }
  },
  methods: {
    update(e) {
      this.handleChange(e.target.value)
    },
    handleChange(newVal) {
      let data = {}
      data[this.label] = newVal
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data)
      } else if (newVal.length > 5) {
        this.$emit('change', data)
      }
    },
    handleBlur(e) {
      // console.log(e)
    },
    handleKeyDown(e) {
      let val = _.cloneDeep(this.val)
      let number = Number(val)
      if (number) {
        let amount = this.arrowOffset || 1
        // Up
        if (e.keyCode === 38) {
          val = number + amount
          this.handleChange(val)
          e.preventDefault()
        }
        // Down
        if (e.keyCode === 40) {
          val = number - amount
          this.handleChange(val)
          e.preventDefault()
        }
      }
    },
    handleDrag(e) {
      // console.log(e)
    },
    handleMouseDown(e) {
      // console.log(e)
    }
  }
}
</script>
