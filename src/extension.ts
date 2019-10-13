import * as vscode from 'vscode';

let timer: NodeJS.Timeout | null = null;

//#region LIFECYCLE

export function activate(context: vscode.ExtensionContext) {
	debug("activate extension");
	const settings = getSettings();
	if (settings.resetOnRestart) {
		resetSettings(true);
	}

	setupTimer();

	vscode.workspace.onDidChangeConfiguration(() => {
		clearTimer();
		setupTimer();
	});

	// TODO: check if timeout has passed during shutdown -> reset settings
	
	// define commands
	const resetNow = vscode.commands.registerCommand('reset-settings-timeout.resetNow', () => {
		debug("command: resetNow");
		clearTimer();
		resetSettings();
		setupTimer();

	});
	context.subscriptions.push(resetNow);

	const restartTimer = vscode.commands.registerCommand('reset-settings-timeout.restartTimer', () => {
		debug("Ccommand: restartTimer");
		clearTimer();
		setupTimer();
	});
	context.subscriptions.push(restartTimer);
}

export function deactivate() {
	debug("deactivate extension");
	clearTimer();
}

//#endregion

//#region ACTIONS

function resetSettings(silent = false) {
	const settings = getSettings();

	debug("reset: execute commands");
	settings.commands.forEach(command => {
		vscode.commands.executeCommand(command);
	});

	// debug("reset: settings");
	// TODO: reset settings in appropriate file: local resetSettings config should clear local, user should clear user
	// Object.entries((setting: string, value: any) => {
	// });

	if (settings.notifyOfReset && !silent) {
		debug("reset: show notification");
		vscode.window.showInformationMessage('Settings have been reset!');
	}
}

function setupTimer() {
	const settings = getSettings();

	if (
		(Object.entries(settings.settings).length > 0 || Object.entries(settings.commands).length) > 0
		&& settings.timeout > 10 // TODO: change min timeout to 60
	) {
		debug("timer: start");
		timer = setTimeout(() => {
			debug("timer: execute");
			resetSettings();
			setupTimer();
		}, settings.timeout * 1000);
	}
}

function clearTimer() {
	if (timer) {
		debug("timer: clear");
		clearTimeout(timer);
	}
}

//#endregion

//#region HELPERS

function getSettings() {
	// defined in package.json
	const settings = vscode.workspace.getConfiguration('reset-settings-timeout');

	return {
		commands: [], // a list of string commands
		settings: {}, // contains {key: value} from settings.json
		timeout: 3600,
		resetOnRestart: true,
		notifyOfReset: false,
		debug: false,
		...settings,
	};
}

function debug(...args: any[]) {
	const settings = getSettings();
	if (settings.debug) {
		console.log("vscode-reset-settings-timeout: ", ...args);
	}
}

//#endregion
