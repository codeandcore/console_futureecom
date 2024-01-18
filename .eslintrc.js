module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    'vue/attributes-order': 'warn',
    'vue/block-lang': ['warn', { script: { lang: 'ts' } }],
    'vue/html-self-closing': 'warn',
    'vue/max-attributes-per-line': 'off',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-properties': ['error', { groups: ['props', 'data', 'computed', 'methods', 'setup'] }],
    'vue/no-unused-vars': 'warn',
    'vue/no-v-html': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/valid-v-slot': ['warn', { allowModifiers: true }],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'warn',
      { ignoreCase: false, ignoreMemberSort: false, memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'] }
    ],
    '@typescript-eslint/ban-types': 'warn',
    'vue/component-api-style': ['warn', ['composition-vue2']]
  },
  extends: [
    'plugin:jest-extended/all',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vuetify/base',
    'eslint:recommended',
    '@vue/typescript'
  ],
  plugins: ['sort-imports-es6-autofix']
}
