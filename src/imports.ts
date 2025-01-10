export async function getThemeStore() {
	const {themeStore} = await import('./styles/styles.js');
	return themeStore;
}

export async function getSettingsDialog() {
	const {settingsDialog} = await import('./settings/settings-dialog.js');
	return settingsDialog;
}

export async function getSessionDialog() {
	const {SessionDialog} = await import('./session/session-dialog.js');
	return {SessionDialog};
}

export async function getSessionSettingsDialog() {
	return (await import('./session/session-settings-dialog.js'))
		.sessionSettingsDialog;
}

export async function getRouter() {
	return (await import('./router.js')).router;
}
