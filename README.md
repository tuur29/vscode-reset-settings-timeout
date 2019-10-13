# VSCode: Reset Settings after Timeout

## Features

This extension allows you to define a list of commands (and soon settings) that get run every x seconds.

Possible use case: Automatically enabling your linter for when you forget to turn it on again after manually disabling it.

## Extension Settings

```js
// An array of commands to execute after timeout (see keybindings for commands)
"reset-settings-timeout.commands": [],

// A list of settings with the preferred 'default' value
"reset-settings-timeout.settings": {}, // currently not supported yet!

// Timeout in seconds (less than 60 is never)
"reset-settings-timeout.timeout": 3600,

// Always reset settings when VSCode starts
"reset-settings-timeout.resetOnRestart": true,

// Show a message when a reset happens
"reset-settings-timeout.notifyOfReset": false,

// Enable debug mode
"reset-settings-timeout.debug": false,
```

## Known Issues

- Settings can't be reset yet, only executing commands works for now

## Release Notes

### 0.0.1

Initial release
