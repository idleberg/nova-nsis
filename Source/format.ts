import { createFormatter } from '@nsis/dent';
import type { DentOptions } from '@nsis/dent';

function getOptions(): DentOptions {
	const options: DentOptions = {};

	const useTabs = nova.config.get('nsis.format.useTabs');
	if (typeof useTabs === 'boolean') options.useTabs = useTabs;

	const indentSize = nova.config.get('nsis.format.indentSize');
	if (typeof indentSize === 'number' && indentSize > 0) options.indentSize = indentSize;

	const printWidth = nova.config.get('nsis.format.printWidth');
	if (typeof printWidth === 'number' && printWidth > 0) options.printWidth = printWidth;

	const singleQuote = nova.config.get('nsis.format.singleQuote');
	if (typeof singleQuote === 'boolean') options.singleQuote = singleQuote;

	const trimEmptyLines = nova.config.get('nsis.format.trimEmptyLines');
	if (typeof trimEmptyLines === 'boolean') options.trimEmptyLines = trimEmptyLines;

	const endOfLine = nova.config.get('nsis.format.endOfLine');
	if (endOfLine === 'lf' || endOfLine === 'crlf') options.endOfLine = endOfLine;
	// 'auto' (default) omits endOfLine, letting dent detect from the file

	return options;
}

export class NsisFormatter {
	private listeners: Disposable[] = [];
	private editorListener: Disposable | null = null;

	start(): void {
		this.editorListener = nova.workspace.onDidAddTextEditor((editor) => {
			if (editor.document.syntax !== 'nsis') return;

			const listener = editor.onWillSave(this.formatEditor.bind(this));
			this.listeners.push(listener);

			const destroyListener = editor.onDidDestroy(() => {
				const idx = this.listeners.indexOf(listener);

				if (idx !== -1) this.listeners.splice(idx, 1);

				listener.dispose();
				destroyListener.dispose();
			});
			this.listeners.push(destroyListener);
		});
	}

	stop(): void {
		for (const listener of this.listeners) {
			listener.dispose();
		}
		this.listeners = [];

		if (this.editorListener) {
			this.editorListener.dispose();
			this.editorListener = null;
		}
	}

	private formatEditor(editor: TextEditor): void {
		const document = editor.document;
		const length = document.length;

		if (length === 0) return;

		const fullRange = new Range(0, length);
		const text = editor.getTextInRange(fullRange);

		try {
			const { format } = createFormatter(getOptions());
			const formatted = format(text);

			if (formatted !== text) {
				editor.edit((edit) => {
					edit.replace(fullRange, formatted);
				});
			}
		} catch (err) {
			console.error('[NSIS] Formatting failed:', err);
		}
	}
}
