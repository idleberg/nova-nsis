import { defineConfig } from 'oxlint';

export default defineConfig({
	plugins: ['import', 'typescript', 'unicorn'],
	categories: {
		correctness: 'error',
		suspicious: 'warn',
		pedantic: 'warn',
	},
	rules: {
		eqeqeq: 'warn',
		'import/no-cycle': 'error',
	},
	ignorePatterns: ['node_modules/', 'NSIS.novaextension/Scripts/', 'Source/*.d.ts'],
});
