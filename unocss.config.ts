import {
  defineConfig,
  presetTypography,
} from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'
import presetMini from '@unocss/preset-mini'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetMini(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
