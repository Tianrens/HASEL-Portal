module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    plugins: ['react', 'prettier'],
    extends: ['react-app', 'react-app/jest', 'airbnb', 'prettier'],
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    rules: {
        quotes: [2, 'single', { avoidEscape: true }],
        'react/prop-types': 0,
        'react/jsx-filename-extension': 0,
        'prettier/prettier': 0,
        'linebreak-style': 0,
        'import/prefer-default-export': 0,
        'no-console': 'off',
        indent: ['error', 4],
        semi: [2, 'always'],
        'eol-last': ['error', 'always'],
    },
};
