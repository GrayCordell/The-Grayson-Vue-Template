<script setup lang="ts">
import type { SliderProps } from 'naive-ui'
import { NSlider } from 'naive-ui'
import { defineModel, toRefs } from 'vue'

const props = defineProps<{
  // value: number
  label: string
  markLocations: Record<number, string> // { 0: '', 25: '', 75: '', 100: '' }; the '' is placed under the mark.
}>()
const value = defineModel<number>('value', { required: true })
const { markLocations, label } = toRefs(props)

type SliderThemeOverrides = NonNullable<SliderProps['themeOverrides']>
const NSliderOverrides: SliderThemeOverrides = {
  fillColor: 'var(--accent)',
  fillColorHover: 'var(--accent)',
  dotHeight: '9px',
  dotWidth: '9px',
  dotBorderActive: '2px solid var(--accent)',
  dotBorderRadius: '55%',
  dotColorPopover: 'var(--accent)',
  handleSize: '15px',
}
</script>

<template>
  <div class="slider-group">
    <label for="feedbackClarity">
      {{ label }}
    </label>
    <div class="rangeAndEmoji">
      <span class="emoji">{{ '😔' }}</span>
      <NSlider v-model:value="value" :marks="markLocations"
               :theme-overrides="NSliderOverrides"
               class="custom-slider" :tooltip="false" step="mark" />
      <span class="emoji">{{ '😄' }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-group {
  margin: 3px 0;
}
.slider-group label {
  display: block;
  margin-bottom: 10px;
}
.emoji {
  font-size: 1.5em;
}
.rangeAndEmoji {
  display: flex;
  justify-items: center;
  align-items: baseline;
}

.custom-slider {
  --n-fill-color: blue;
  --n-fill-color-hover: yellow;
}
</style>
