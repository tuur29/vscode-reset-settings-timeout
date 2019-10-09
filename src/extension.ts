import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// TODO: check if settings are configured -> start timeout
	// TODO: check if timeout has passed during shutdown -> reset settings
	// TODO: show notification on reset if preferred
	// TODO: reset settings in appropriate file: local resetSettings config should clear local, user should clear user

	/*
	
		Settings format:

		{
			settings: {
				...
			},
			timeout: 3600,
			resetOnRestart: true,
			notifyOfReset: false.
		}

	 */

	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// TODO: create command to reset settings manually
		// TODO: create command to reset timer
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	// TODO: cleanup timers
}
