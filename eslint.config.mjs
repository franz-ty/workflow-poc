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

// External SDKs that must be isolated behind infrastructure/ gateways.
// Add each SDK's package name as gateways land (e.g. '@sanity/client', 'stripe').
const EXTERNAL_SDKS = []

const architecturalBoundaries = [
  {
    files: ['apps/web/src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '@/infrastructure/**'],
              message:
                'app/ must not import from infrastructure/ — go through the module BFF (modules/<feature>/server/).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/web/src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/modules/**', '@/modules/**'],
              message:
                'infrastructure/ must not import from modules/ — data flows modules → infrastructure, not the reverse.',
            },
            {
              group: ['next/cache'],
              message: 'Caching belongs in the module BFF layer, not in infrastructure gateways.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/web/src/modules/*/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/modules/*/**', '@/modules/*/**'],
              message:
                "Import from another module's index.ts only (e.g. @/modules/events), never its internal paths. Use relative imports inside the same module.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/apps/**', '@bsava/web/**', '@bsava/native/**'],
              message:
                'packages/ must not depend on apps/ — dependency direction is apps → packages.',
            },
          ],
        },
      ],
    },
  },
  EXTERNAL_SDKS.length > 0 && {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    ignores: ['apps/web/src/infrastructure/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: EXTERNAL_SDKS.map((sdk) => ({
            name: sdk,
            message: `External SDKs must be isolated in infrastructure/<system>/. Import a gateway from infrastructure/ instead of ${sdk} directly.`,
          })),
        },
      ],
    },
  },
].filter(Boolean)

const eslintConfig = defineConfig([
  ...webConfigs,
  ...architecturalBoundaries,
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
