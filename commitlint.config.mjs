export default {
  extends: ['@commitlint/config-conventional'],
  defaultIgnores: true,
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\(([A-Z][A-Z0-9]*-\d+)\))?!?: (.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'scope-empty': [2, 'never'],
  },
}
