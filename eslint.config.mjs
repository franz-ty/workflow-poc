import { defineConfig, globalIgnores } from 'eslint/config'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const webFilePatterns = ['apps/web/**/*.{js,jsx,mjs,ts,tsx,mts,cts}']

const webConfigs = [...nextVitals, ...nextTs].map((config) => ({
  ...config,
  ...(config.files
    ? {
        files: config.files.map((pattern) => `apps/web/${pattern}`),
      }
    : config.ignores
      ? {}
      : {
          files: webFilePatterns,
        }),
  ...(config.ignores
    ? {
        ignores: config.ignores.map((pattern) => `apps/web/${pattern}`),
      }
    : {}),
  settings: {
    ...config.settings,
    next: {
      ...config.settings?.next,
      rootDir: ['apps/web'],
    },
  },
}))

const eslintConfig = defineConfig([
  ...webConfigs,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/.turbo/**',
    '**/build/**',
    '**/coverage/**',
    '**/dist/**',
    '**/next-env.d.ts',
    '**/node_modules/**',
    '**/out/**',
  ]),
])

export default eslintConfig
