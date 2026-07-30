const SERVER_COMMAND = 'nsis-lsp';
const SERVER_HOMEPAGE = 'https://github.com/idleberg/nsis-lsp';
const NOTIFIED_KEY = 'nsis.languageServer.notified';
const RESOLVE_TIMEOUT = 5000;

type PreprocessMode = 'none' | 'ppo' | 'safeppo';

interface InitializationOptions {
	diagnostics: {
		preprocess_mode: PreprocessMode;
		enabled_on_save: boolean;
	};
	makensis: {
		path: string;
	};
	formatter: {
		end_of_line?: string;
		print_width?: number;
		single_quote?: boolean;
		trim_empty_lines?: boolean;
	};
}

export function isLanguageServerEnabled(): boolean {
	return nova.config.get('nsis.languageServer.enabled') !== false;
}

// Nova's extension host does not inherit the user's PATH, so a bare command
// name never resolves — ask a login shell where the binary lives instead.
function which(command: string): Promise<string | null> {
	return new Promise((resolve) => {
		const shell = nova.environment.SHELL ?? '/bin/sh';
		let stdout = '';
		let settled = false;

		const finish = (result: string | null) => {
			if (settled) return;

			settled = true;
			resolve(result);
		};

		try {
			const process = new Process(shell, {
				args: ['-l', '-c', `command -v ${command}`],
			});

			process.onStdout((line) => {
				stdout += line;
			});

			process.onDidExit(() => {
				// Login shells may print unrelated output, so take the last path.
				const path = stdout
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line.startsWith('/'))
					.pop();

				finish(path ?? null);
			});

			process.start();
			setTimeout(() => finish(null), RESOLVE_TIMEOUT);
		} catch (err) {
			console.error(`[NSIS] Could not look up ${command}:`, err);
			finish(null);
		}
	});
}

async function notifyMissingServer(): Promise<void> {
	if (nova.config.get(NOTIFIED_KEY) === true) return;

	nova.config.set(NOTIFIED_KEY, true);

	const request = new NotificationRequest('nsis-language-server-missing');

	request.title = nova.localize('NSIS language server not found');
	request.body = nova.localize(
		`Install ${SERVER_COMMAND} for completions, documentation, definitions, diagnostics and formatting. Until then, only syntax highlighting and the build task are available.`,
	);
	request.actions = [nova.localize('Learn More'), nova.localize('Dismiss')];

	try {
		const response = await nova.notifications.add(request);

		if (response.actionIdx === 0) nova.openURL(SERVER_HOMEPAGE);
	} catch (err) {
		console.error('[NSIS] Could not show notification:', err);
	}
}

async function resolveServerPath(): Promise<string | null> {
	const configured = (nova.config.get('nsis.languageServer.path') as string | null)?.trim();

	if (configured?.length) return configured;

	const resolved = await which(SERVER_COMMAND);

	if (!resolved) {
		console.info(`[NSIS] ${SERVER_COMMAND} not found in PATH, diagnostics and formatting are unavailable`);
		await notifyMissingServer();
	}

	return resolved;
}

function getPreprocessMode(): PreprocessMode {
	const mode = nova.config.get('nsis.preprocessMode');

	return mode === 'ppo' || mode === 'safeppo' ? mode : 'none';
}

// Only options nsis-lsp accepts belong here; unknown keys are ignored silently,
// so a typo fails quietly. Indentation is left out — it travels per request in
// textDocument/formatting, taken from the editor's tab settings.
function getFormatterOptions(): InitializationOptions['formatter'] {
	const options: InitializationOptions['formatter'] = {};

	const printWidth = nova.config.get('nsis.format.printWidth');
	if (typeof printWidth === 'number' && printWidth > 0) options.print_width = printWidth;

	const singleQuote = nova.config.get('nsis.format.singleQuote');
	if (typeof singleQuote === 'boolean') options.single_quote = singleQuote;

	const trimEmptyLines = nova.config.get('nsis.format.trimEmptyLines');
	if (typeof trimEmptyLines === 'boolean') options.trim_empty_lines = trimEmptyLines;

	// 'auto' (the default) is omitted, letting the server detect from the file
	const endOfLine = nova.config.get('nsis.format.endOfLine');
	if (endOfLine === 'lf' || endOfLine === 'crlf') options.end_of_line = endOfLine;

	return options;
}

function getInitializationOptions(): InitializationOptions {
	const makensis = nova.config.get('nsis.pathToMakensis') as string | null;

	return {
		diagnostics: {
			preprocess_mode: getPreprocessMode(),
			enabled_on_save: (nova.config.get('nsis.validate') as string | null) !== 'off',
		},
		makensis: {
			path: makensis?.length ? makensis : '',
		},
		formatter: getFormatterOptions(),
	};
}

export class NsisLanguageServer {
	private languageClient: LanguageClient | null = null;
	private stopListener: Disposable | null = null;
	private isActive = false;

	// While this is false the extension provides no diagnostics and no
	// formatting — both come from the server, there are no built-in fallbacks.
	get active(): boolean {
		return this.isActive;
	}

	get client(): LanguageClient | null {
		return this.isActive ? this.languageClient : null;
	}

	async start(): Promise<boolean> {
		this.stop();

		if (!isLanguageServerEnabled()) return false;

		const path = await resolveServerPath();
		if (!path) return false;

		// nsis-lsp only reads its settings from the initialize request, so any
		// config change has to go through a restart.
		const client = new LanguageClient(
			'nsis-lsp',
			'NSIS Language Server',
			{
				path,
				type: 'stdio',
			},
			{
				syntaxes: ['nsis'],
				initializationOptions: getInitializationOptions(),
				debug: nova.inDevMode(),
			},
		);

		this.stopListener = client.onDidStop((error) => {
			if (!this.isActive) return;

			console.error(`[NSIS] Language server at ${path} stopped:`, error?.message ?? 'unknown reason');

			this.isActive = false;
		});

		this.languageClient = client;
		this.isActive = true;

		try {
			client.start();
		} catch (err) {
			console.error('[NSIS] Could not start language server:', err);
			this.stop();

			return false;
		}

		// onDidStop may already have fired if the server died on launch.
		return this.isActive;
	}

	stop(): void {
		this.isActive = false;

		if (this.stopListener) {
			this.stopListener.dispose();
			this.stopListener = null;
		}

		if (this.languageClient) {
			this.languageClient.stop();
			this.languageClient = null;
		}
	}
}
