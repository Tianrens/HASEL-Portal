module.exports = {
    plugins: ['jest', 'prettier'],
    env: {
        browser: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: ['airbnb', 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    ignorePatterns: ['**/dist/**', '**/node_modules/**/*'],
    rules: {
        'linebreak-style': 0,
        'import/prefer-default-export': 0,
        'no-console': 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        'prettier/prettier': 0,
        quotes: [2, 'single', { avoidEscape: true }],
        semi: [2, 'always'],
        'no-underscore-dangle': 'off',
        'eol-last': ['error', 'always'],
    },
};
