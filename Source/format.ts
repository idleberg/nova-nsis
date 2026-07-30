interface LspPosition {
	line: number;
	character: number;
}

interface LspTextEdit {
	range: {
		start: LspPosition;
		end: LspPosition;
	};
	newText: string;
}

function getLineStarts(text: string): number[] {
	const starts = [0];

	for (let index = 0; index < text.length; index++) {
		if (text[index] === '\n') starts.push(index + 1);
	}

	return starts;
}

function toOffset(lineStarts: number[], position: LspPosition, length: number): number {
	// A range ending past the last line means "to the end of the document".
	if (position.line >= lineStarts.length) return length;

	return Math.min(lineStarts[position.line] + position.character, length);
}

export class NsisFormatter {
	private listeners: Disposable[] = [];
	private editorListener: Disposable | null = null;

	constructor(private readonly getClient: () => LanguageClient | null) {}

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

	// Formatting is the language server's job; without it, saving is a no-op.
	private async formatEditor(editor: TextEditor): Promise<void> {
		if (editor.document.length === 0) return;

		const client = this.getClient();
		if (!client) return;

		try {
			const edits = (await client.sendRequest('textDocument/formatting', {
				textDocument: { uri: editor.document.uri },
				options: {
					tabSize: editor.tabLength,
					insertSpaces: editor.softTabs,
				},
			})) as LspTextEdit[] | null;

			if (edits?.length) await this.applyEdits(editor, edits);
		} catch (err) {
			console.error('[NSIS] Formatting failed:', err);
		}
	}

	private async applyEdits(editor: TextEditor, edits: LspTextEdit[]): Promise<void> {
		const document = editor.document;
		const length = document.length;
		const lineStarts = getLineStarts(document.getTextInRange(new Range(0, length)));

		const ranges = edits
			.map((edit) => ({
				range: new Range(toOffset(lineStarts, edit.range.start, length), toOffset(lineStarts, edit.range.end, length)),
				newText: edit.newText,
			}))
			// Later edits are applied first so earlier offsets stay valid.
			// oxlint-disable-next-line unicorn/no-array-sort -- sorting the array created above, and toSorted needs ES2023
			.sort((a, b) => b.range.start - a.range.start)
			.filter(({ range, newText }) => editor.getTextInRange(range) !== newText);

		if (ranges.length === 0) return;

		await editor.edit((edit) => {
			for (const { range, newText } of ranges) {
				edit.replace(range, newText);
			}
		});
	}
}
