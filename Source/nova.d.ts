declare const nova: {
	config: Configuration;
	assistants: {
		registerIssueAssistant(
			selector: string,
			object: { provideIssues(editor: TextEditor): Promise<Issue[]> },
			options: { event: string },
		): Disposable;
		registerTaskAssistant(
			object: { resolveTaskAction(context: TaskActionResolveContext): TaskProcessAction | null },
			options?: { identifier?: string; name?: string },
		): Disposable;
	};
	workspace: {
		activeTextEditor: TextEditor | null;
		config: Configuration;
		onDidAddTextEditor(callback: (editor: TextEditor) => void): Disposable;
	};
	environment: {
		SHELL: string;
	};
	path: {
		join(...components: string[]): string;
	};
};

declare class Process {
	constructor(command: string, options?: { args?: string[]; shell?: string | boolean; cwd?: string });
	onStdout(callback: (line: string) => void): void;
	onStderr(callback: (line: string) => void): void;
	onDidExit(callback: (code: number) => void): void;
	start(): void;
}

declare class Issue {
	constructor();
	message: string;
	severity: IssueSeverity;
	line: number;
	column: number;
	endLine: number;
	endColumn: number;
	source: string;
	code: string;
}

declare const IssueSeverity: {
	Error: IssueSeverity;
	Warning: IssueSeverity;
	Hint: IssueSeverity;
	Info: IssueSeverity;
};

type IssueSeverity = number;

interface Disposable {
	dispose(): void;
}

interface Configuration {
	get(key: string): unknown;
	onDidChange(key: string, callback: (newValue: unknown, oldValue: unknown) => void): Disposable;
}

declare const console: {
	log(...args: unknown[]): void;
	error(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	info(...args: unknown[]): void;
};

declare class Range {
	constructor(start: number, end: number);
	start: number;
	end: number;
	length: number;
}

interface TextEditorEdit {
	replace(range: Range, text: string): void;
	insert(position: number, text: string): void;
	delete(range: Range): void;
}

interface TextEditor {
	document: TextDocument;
	edit(callback: (edit: TextEditorEdit) => void): Promise<void>;
	getTextInRange(range: Range): string;
	onWillSave(callback: (editor: TextEditor) => void): Disposable;
	onDidDestroy(callback: (editor: TextEditor) => void): Disposable;
}

interface TextDocument {
	path: string;
	length: number;
	syntax: string | null;
}

interface TaskActionResolveContext {
	readonly action: number;
	readonly config: Configuration | undefined;
	readonly data: unknown;
}

declare class TaskProcessAction {
	constructor(
		command: string,
		options?: {
			args?: string[];
			env?: Record<string, string>;
			cwd?: string;
			shell?: boolean | string;
			matchers?: string[];
		},
	);
	readonly command: string;
	readonly args: string[];
	readonly cwd: string;
	readonly env: Record<string, string>;
}
