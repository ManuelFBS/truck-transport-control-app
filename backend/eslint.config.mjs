// @ts-check
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const prettierConfig = JSON.parse(
        readFileSync(join(import.meta.dirname, '.prettierrc.json'), 'utf-8'),
);

export default tseslint.config(
        {
                ignores: ['eslint.config.mjs', '**/dist/*', '*.config.js'],
        },
        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        eslintConfigPrettier,
        {
                plugins: {
                        prettier: eslintPluginPrettier,
                },
                rules: {
                        '@typescript-eslint/no-explicit-any': 'off',
                        '@typescript-eslint/no-floating-promises': 'warn',
                        '@typescript-eslint/no-unsafe-argument': 'warn',
                        '@typescript-eslint/no-unsafe-return': 'warn',
                        '@typescript-eslint/no-unsafe-member-access': 'warn',
                        '@typescript-eslint/no-unsafe-assignment': 'warn',
                        '@typescript-eslint/no-unsafe-call': 'warn',
                        '@typescript-eslint/no-unused-vars': 'warn',
                        indent: 'off',
                        quotes: 'off',
                        semi: 'off',
                        'comma-dangle': 'off',
                        'arrow-parens': 'off',
                        'object-curly-spacing': 'off',
                        'max-len': 'off',
                        'space-before-function-paren': 'off',
                },
        },
        {
                languageOptions: {
                        globals: { ...globals.node, ...globals.jest },
                        parserOptions: {
                                project: true,
                                tsconfigRootDir: import.meta.dirname,
                        },
                },
        },
);
