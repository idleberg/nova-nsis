const WARNING_PATTERN = /warning: (?<message>.*) \((?<file>.*?):(?<line>\d+)\)/u;
const ERROR_PATTERN = /(?<message>.*)\r?\n.*rror in script:? "(?<file>.*)" on line (?<line>\d+)/u;

function getMakensisPath(): string {
	const configured = nova.config.get('nsis.pathToMakensis') as string | null;

	return configured?.length ? configured : 'makensis';
}

function getPreprocessArgs(): string[] {
	const mode = nova.config.get('nsis.preprocessMode') as string | null;

	switch (mode) {
		case 'ppo':
			return ['-PPO'];
		case 'safeppo':
			return ['-SAFEPPO'];
		default:
			return [];
	}
}

function createIssue(message: string, line: number, severity: IssueSeverity): Issue {
	const issue = new Issue();

	issue.message = message;
	issue.severity = severity;
	issue.line = line;
	issue.source = 'makensis';

	return issue;
}

function parseWarnings(stdout: string): Issue[] {
	const issues: Issue[] = [];

	for (const line of stdout.split('\n')) {
		const match = WARNING_PATTERN.exec(line);

		if (match?.groups) {
			issues.push(createIssue(match.groups.message, Number(match.groups.line), IssueSeverity.Warning));
		}
	}
	return issues;
}

function parseError(stderr: string): Issue | null {
	const match = ERROR_PATTERN.exec(stderr);

	if (!match?.groups) return null;

	return createIssue(match.groups.message, Number(match.groups.line), IssueSeverity.Error);
}

export class NsisIssueAssistant {
	provideIssues(editor: TextEditor): Promise<Issue[]> {
		return new Promise((resolve) => {
			const scriptPath = editor.document.path;

			if (!scriptPath) {
				resolve([]);
				return;
			}

			const args = ['-V2', ...getPreprocessArgs(), '-XOutFile /dev/null', scriptPath];
			let stdout = '';
			let stderr = '';

			try {
				const process = new Process(getMakensisPath(), {
					args,
				});

				process.onStdout((line) => {
					stdout += line;
				});
				process.onStderr((line) => {
					stderr += line;
				});

				process.onDidExit((code) => {
					console.log(`[NSIS] makensis exited with code ${code}, parsed ${stdout.length + stderr.length} chars`);

					const issues = parseWarnings(stdout);
					const error = parseError(stderr);

					if (error) issues.push(error);

					resolve(issues);
				});

				process.start();
			} catch (err) {
				console.error('Could not start makensis:', err);
				resolve([]);
			}
		});
	}
}
