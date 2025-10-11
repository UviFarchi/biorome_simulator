import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'public/**', '.vscode/**', '.idea/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      camelcase: ['error', { properties: 'never' }],
      'eol-last': ['error', 'always'],
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['/src/*'],
              message: 'Use the @ alias instead of /src/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['tests/**/*.{js,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.vitest,
      },
    },
  },
  {
    files: [
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      'vite.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  eslintConfigPrettier,
];
