module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: '.',
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react', 'import', 'jsx-a11y', 'react-hooks', '@typescript-eslint', '@babel'],
    settings: {
        react: {
            version: 'detect'
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'off'
    }
};
