<template>
  <div id="app">
    <mp-color-picker :value="'#FFFFFF'"></mp-color-picker>
  </div>
</template>

<script>
import MpColorPicker from './components/color-picker'

export default {
  name: 'app',
  components: {
    MpColorPicker
  }
}
</script>