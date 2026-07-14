import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		clean: true,
		entry: ['Source/main.ts'],
		format: 'cjs',
		minify: isProduction,
		deps: { alwaysBundle: ['@nsis/dent', '@nsis/parser', 'detect-newline'] },
		outDir: 'NSIS.novaextension/Scripts',
		target: 'es2020',
	};
});
