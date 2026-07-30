declare const nova: {
	config: Configuration;
	notifications: {
		add(request: NotificationRequest): Promise<NotificationResponse>;
	};
	localize(key: string): string;
	openURL(url: string): void;
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
	extension: {
		path: string;
	};
	path: {
		join(...components: string[]): string;
	};
	inDevMode(): boolean;
};

declare class LanguageClient {
	constructor(
		identifier: string,
		name: string,
		serverOptions: {
			path: string;
			type?: 'stdio' | 'socket' | 'pipe';
			args?: string[];
			env?: Record<string, string>;
		},
		clientOptions: {
			syntaxes: (string | { syntax: string; languageId?: string })[];
			initializationOptions?: unknown;
			debug?: boolean;
		},
	);
	readonly running: boolean;
	start(): void;
	stop(): Promise<void>;
	onDidStop(callback: (error?: Error) => void): Disposable;
	sendRequest(method: string, params?: unknown): Promise<unknown>;
	sendNotification(method: string, params?: unknown): void;
	onNotification(method: string, callback: (params: unknown) => void): Disposable;
	onRequest(method: string, callback: (params: unknown) => unknown): Disposable;
}

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
	set(key: string, value: unknown): void;
	onDidChange(key: string, callback: (newValue: unknown, oldValue: unknown) => void): Disposable;
}

declare class NotificationRequest {
	constructor(identifier?: string);
	identifier: string;
	title: string;
	body: string;
	actions: string[];
	type?: 'input' | 'secure-input';
}

interface NotificationResponse {
	identifier: string;
	actionIdx: number | null;
	textInputValue?: string;
}

declare function setTimeout(callback: () => void, delay: number): number;
declare function clearTimeout(id: number): void;

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
	tabLength: number;
	softTabs: boolean;
	edit(callback: (edit: TextEditorEdit) => void): Promise<void>;
	getTextInRange(range: Range): string;
	onWillSave(callback: (editor: TextEditor) => void | Promise<void>): Disposable;
	onDidDestroy(callback: (editor: TextEditor) => void): Disposable;
}

interface TextDocument {
	uri: string;
	path: string;
	eol: string;
	length: number;
	syntax: string | null;
	getTextInRange(range: Range): string;
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
