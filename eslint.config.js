// @ts-check
import antfu from '@antfu/eslint-config'
import { scopedConstructPlugin } from 'eslint-plugin-scoped-construct'


export default antfu(
  {
    unocss: false, // its technically used, but we don't currently use the utility css part right now. Enable if you do.
    formatters: true,
    test: true,
    lessOpinionated: false,
    toml: false,
    svelte: false,
    solid: false,
    astro: false,
    jsx: false,
    markdown: false,
    regexp: false,
    react: false,
    jsonc: false,
    yaml: false,

    // https://eslint.org/
    javascript: {
      overrides: {},
    },
    vue: {
      overrides: {
        'vue/no-unused-vars': 'warn',
        'vue/first-attribute-linebreak': 'off',
        'vue/no-console': 'off',
        'vue/html-closing-bracket-newline': 'off',
      },
    },

    // https://typescript-eslint.io/
    typescript: {
      overrides: {
        'ts/strict-boolean-expressions': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unsafe-argument': 'off',
        'ts/no-unsafe-return': 'off',
        'ts/no-unsafe-member-access': 'off',
        'ts/no-var-requires': 'off',
      },
    },
    stylistic: {
      overrides: {
        'style/no-multiple-empty-lines': 'warn',
      },
    },
    // General/Applied everywhere
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'antfu/top-level-function': 'off',
      'node/prefer-global/console': 'off',
      'vue/no-console': 'off',

      'prefer-promise-reject-errors': 'warn',
      'import/order': 'off',
      'style/eol-last': 'warn',
      'no-prototype-builtins': 'warn',
      'jsdoc/require-returns-description': 'off',
      'unused-imports/no-unused-vars': 'off', // already warned via no-unused-vars
      'perfectionist/sort-imports': 'off',
      'no-undef': 'error',
    },
    ignores: [
      '**/README.md',
      '**/build',
      '**/dbschema',
      '**/dist',
      '**/public',
      '**/built',
      '**/assets',
      './src/assets',
      '**/dumps/*.json',
      '**/.nuxt',
      '**/.turbo',
      'node_modules',
      'dist',
      'build',
      'public',
      '**/docs',
    ],
  },
  {
    plugins: {
      scoped: scopedConstructPlugin,
    },
  },
)
