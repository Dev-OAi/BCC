import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        PDFLib: "readonly",
        Tesseract: "readonly",
        pdfjsLib: "readonly",
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        global: 'readonly',
        process: 'readonly',
      },
    },
  },
  pluginJs.configs.recommended,
  configPrettier,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
