import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**'
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      'src/**/*.ts'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: [
      'eslint.config.mjs'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
);
