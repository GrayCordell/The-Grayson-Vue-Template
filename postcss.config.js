/** @type {import('postcss-load-config').Config} */
import autoprefixer from 'autoprefixer'
import nested from 'postcss-nested'
import simpleVars from 'postcss-simple-vars'

const config = {
  plugins: [
    autoprefixer,
    nested,
    simpleVars,
  ],
}
export default config
