module.exports = {
	printWidth: 100,
	// 0 = off, 1 = warn, 2 = error
	// tabWidth: 2,
	useTabs: true,
	quoteProps: 'as-needed',
	singleQuote: true,
	jsxSingleQuote: true,
	// trailingComma: 'none',
	trailingComma: 'es5',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'always',
	// maxLen: ['warn', 140, 2],
	semi: true,
	embeddedLanguageFormatting: 'auto',
	// linebreakStyle: ['off', 'windows'],
	plugins: [
		'prettier-plugin-organize-imports',
		'prettier-plugin-organize-attributes',
		'prettier-plugin-css-order',
		// 'prettier-plugin-tailwindcss'
	],
	organizeImportsSkipDestructiveCodeActions: true,
	// htmlWhitespaceSensitivity: 'css',
	// attributeGroups: ['^class$', '^(id|name)$', '$DEFAULT', '^aria-'],
	// attributeSort: 'ASC',
};
