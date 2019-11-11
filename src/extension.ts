import { commands, workspace, window, ExtensionContext } from "vscode";

let timer: NodeJS.Timeout | null = null;

//#region LIFECYCLE

export function activate(context: ExtensionContext) {

    // setup
    const settings = getSettings();
    debug("activate extension with settings", settings);
    if (settings.resetOnRestart) {
        resetSettings(true);
    }

    setupTimer();
    workspace.onDidChangeConfiguration(() => {
        debug("timer: reset on config change");
        clearTimer();
        setupTimer();
    });

    // register commands
    const resetNow = commands.registerCommand("reset-settings-timeout.resetNow", () => {
        debug("command: resetNow");
        clearTimer();
        resetSettings();
        setupTimer();
    });
    context.subscriptions.push(resetNow);

    const restartTimer = commands.registerCommand("reset-settings-timeout.restartTimer", () => {
        debug("command: restartTimer");
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

    // run configured commands
    if (settings.commands.length) {
        debug("reset: execute commands");
        settings.commands.forEach(command => {
            commands.executeCommand(command);
        });
    }

    // reset configured settings
    if (Object.keys(settings.settings).length) {
        debug("reset: settings");
        Object.entries(settings.settings).forEach(([setting, value]) => {
            updateCorrectSettingsFile(setting, value);
        });
    }

    if (settings.notifyOfReset && !silent) {
        debug("reset: show notification");
        window.showInformationMessage("Settings have been reset!");
    }
}

function setupTimer() {
    const settings = getSettings();

    if (
        (Object.entries(settings.settings).length > 0 || settings.commands.length) > 0 &&
        settings.timeout >= (settings.debug ? 5 : 60)
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

/**
 * Returns whether setting was changed in workspace or not
 */
async function updateCorrectSettingsFile(key: string, value: any): Promise<boolean> {
    const settings = getSettings();
    const config = workspace.getConfiguration("");
    try {
        return await config.update(key, value).then(() => false);
    } catch (e) {
        debug("reset: workspace update failed, trying user config instead");
        if (settings.allowUserWorkspaceChanges) {
            return await config.update(key, value, true).then(() => true);
        }
    }
    return false;
}

function debug(...args: any[]) {
    const settings = getSettings();
    if (settings.debug) {
        console.log("vscode-reset-settings-timeout: ", ...args);
    }
}

function getSettings() {
    // defined in package.json
    const settings = workspace.getConfiguration("reset-settings-timeout");

    return {
        commands: [], // a list of string commands
        settings: {}, // contains {key: value} from settings.json
        timeout: 3600,
        resetOnRestart: true,
        notifyOfReset: false,
        allowUserWorkspaceChanges: false,
        debug: false,
        ...settings,
    };
}

//#endregion
