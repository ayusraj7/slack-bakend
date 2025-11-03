import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig({
  files: ['**/*.{js,mjs,cjs}'],
  plugins: {
    'simple-import-sort': simpleImportSort
  },
  extends: [
    js.configs.recommended // correct way to extend built-in JS config
  ],
  languageOptions: {
    globals: globals.node
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  }
});
