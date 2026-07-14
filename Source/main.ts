import { NsisBuildAssistant } from './build';
import { NsisFormatter } from './format';
import { NsisIssueAssistant } from './issues';

let assistant: Disposable | null = null;
let taskAssistant: Disposable | null = null;
const formatter = new NsisFormatter();

function registerAssistant(): void {
	if (assistant) {
		assistant.dispose();
		assistant = null;
	}

	const event = (nova.config.get('nsis.validate') as string | null) ?? 'onSave';
	if (event === 'off') {
		return;
	}

	assistant = nova.assistants.registerIssueAssistant('nsis', new NsisIssueAssistant(), { event });
}

function registerFormatter(): void {
	formatter.stop();

	const mode = (nova.config.get('nsis.format') as string | null) ?? 'off';
	if (mode === 'onSave') {
		formatter.start();
	}
}

export function activate(): void {
	registerAssistant();
	registerFormatter();

	taskAssistant = nova.assistants.registerTaskAssistant(new NsisBuildAssistant(), {
		identifier: 'nsis',
		name: 'NSIS',
	});

	nova.config.onDidChange('nsis.validate', () => registerAssistant());
	nova.config.onDidChange('nsis.pathToMakensis', () => registerAssistant());
	nova.config.onDidChange('nsis.preprocessMode', () => registerAssistant());

	nova.config.onDidChange('nsis.format', () => registerFormatter());
	nova.config.onDidChange('nsis.format.useTabs', () => registerFormatter());
	nova.config.onDidChange('nsis.format.indentSize', () => registerFormatter());
	nova.config.onDidChange('nsis.format.printWidth', () => registerFormatter());
	nova.config.onDidChange('nsis.format.singleQuote', () => registerFormatter());
	nova.config.onDidChange('nsis.format.trimEmptyLines', () => registerFormatter());
	nova.config.onDidChange('nsis.format.endOfLine', () => registerFormatter());
}

export function deactivate(): void {
	if (assistant) {
		assistant.dispose();
		assistant = null;
	}

	if (taskAssistant) {
		taskAssistant.dispose();
		taskAssistant = null;
	}

	formatter.stop();
}
