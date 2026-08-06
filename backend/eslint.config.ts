import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'build/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
