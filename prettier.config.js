module.exports = {
    arrowParens: 'avoid',
    bracketSpacing: false,
    importOrder: [
        '^react$',
        '^react',
        '<THIRD_PARTY_MODULES>',
        '^@/components/(.*)$',
        '^@/hooks/(.*)$',
        '^@/pages/(.*)$',
        '^@/types/(.*)$',
        '^@/utils/(.*)$',
        '^@./(.*)$',
        '^./(.*)$'
    ],
    importOrderSortSpecifiers: true,
    plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    printWidth: 100,
    proseWrap: 'preserve',
    requirePragma: false,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    tailwindFunctions: ['clsx'],
    trailingComma: 'none',
    useTabs: false
};
