import * as vscode from 'vscode';

let timer: NodeJS.Timeout | null = null;

//#region LIFECYCLE

export function activate(context: vscode.ExtensionContext) {

	setupTimer();

	const settings = getSettings();
	if (settings.resetOnRestart) {
		resetSettings();
	}

	// TODO: check if timeout has passed during shutdown -> reset settings
	
	// define commands
	let resetNow = vscode.commands.registerCommand('reset-settings-timeout.resetNow', () => {
		resetSettings();
	});
	context.subscriptions.push(resetNow);

	let restartTimer = vscode.commands.registerCommand('reset-settings-timeout.restartTimer', () => {
		resetTimer();
		
	});
	context.subscriptions.push(restartTimer);
}

export function deactivate() {
	clearTimer();
}

//#endregion

//#region ACTIONS

function setupTimer() {
	const settings = getSettings();

	if (Object.entries(settings.settings).length > 0) {
		timer = setTimeout(() => {
			
		}, settings.timeout);
	}
}

function resetTimer() {
	// TODO: create command to restart timer
}

function clearTimer() {
	if (timer) {
		clearTimeout(timer);
	}
}

function resetSettings() {
	const settings = getSettings();

	// TODO: reset settings in appropriate file: local resetSettings config should clear local, user should clear user
	// https://code.visualstudio.com/docs/getstarted/settings#_creating-user-and-workspace-settings

	if (settings.notifyOfReset) {
		vscode.window.showInformationMessage('Settings have been reset!');
	}

	resetTimer();
}

//#endregion

//#region HELPERS

function getSettings() {
	// TODO: get settings from json
	return {
		settings: {}, // contains {key: value} from settings.json
		timeout: 1*60*60,
		resetOnRestart: true,
		notifyOfReset: false,
	};
}

//#endregion
