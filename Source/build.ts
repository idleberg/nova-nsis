function getMakensisPath(): string {
	const configured = nova.config.get('nsis.pathToMakensis') as string | null;
	return configured?.length ? configured : 'makensis';
}

function buildArgs(config: Configuration): string[] {
	const args: string[] = [];

	const verbosity = config.get('nsis.task.verbosity') as string | null;
	args.push(`-V${verbosity ?? '4'}`);

	if (config.get('nsis.task.treatWarningsAsErrors')) {
		args.push('-WX');
	}
	if (config.get('nsis.task.noConfig')) {
		args.push('-NOCONFIG');
	}
	if (config.get('nsis.task.noCD')) {
		args.push('-NOCD');
	}

	const custom = (config.get('nsis.task.customArguments') as string | null)?.trim();

	if (custom?.length) {
		for (const arg of custom.split(/\s+/u)) {
			args.push(arg);
		}
	}

	return args;
}

export class NsisBuildAssistant {
	resolveTaskAction(context: TaskActionResolveContext): TaskProcessAction | null {
		const editor = nova.workspace.activeTextEditor;
		const scriptPath = editor?.document.path;

		if (!scriptPath) {
			console.error('[NSIS] No active document to build');
			return null;
		}

		const args = context.config ? buildArgs(context.config) : ['-V4'];
		args.push(scriptPath);

		return new TaskProcessAction(getMakensisPath(), { args });
	}
}
