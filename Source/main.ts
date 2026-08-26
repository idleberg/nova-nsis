import { NsisBuildAssistant } from './build.ts';
import { NsisFormatter } from './format.ts';
import { NsisLanguageServer } from './lsp.ts';

let taskAssistant: Disposable | null = null;
// Nova invokes onDidChange callbacks once on subscription, which would launch
// the server once per observed key before activate() gets to start it.
let activated = false;
const languageServer = new NsisLanguageServer();
const formatter = new NsisFormatter(() => languageServer.client);

function restartLanguageServer(): void {
	if (activated) languageServer.start();
}

function registerFormatter(): void {
	formatter.stop();

	const mode = (nova.config.get('nsis.format') as string | null) ?? 'off';
	if (mode === 'onSave') {
		formatter.start();
	}
}

export async function activate(): Promise<void> {
	registerFormatter();

	taskAssistant = nova.assistants.registerTaskAssistant(new NsisBuildAssistant(), {
		identifier: 'nsis',
		name: 'NSIS',
	});

	// The server only reads its settings from the initialize request, so every
	// setting it consumes has to go through a restart.
	for (const key of [
		'nsis.languageServer.enabled',
		'nsis.languageServer.path',
		'nsis.validate',
		'nsis.pathToMakensis',
		'nsis.preprocessMode',
		'nsis.format.printWidth',
		'nsis.format.singleQuote',
		'nsis.format.trimEmptyLines',
		'nsis.format.endOfLine',
		'nsis.format.commentStyle',
	]) {
		nova.config.onDidChange(key, restartLanguageServer);
	}

	nova.config.onDidChange('nsis.format', () => {
		if (activated) registerFormatter();
	});

	await languageServer.start();
	activated = true;
}

export function deactivate(): void {
	activated = false;

	if (taskAssistant) {
		taskAssistant.dispose();
		taskAssistant = null;
	}

	languageServer.stop();
	formatter.stop();
}
