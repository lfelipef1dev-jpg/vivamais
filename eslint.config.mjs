import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['out/**', 'node_modules/**', 'tests/**'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'no-redeclare': 'warn',
      'no-console': 'off'
    }
  }
];
