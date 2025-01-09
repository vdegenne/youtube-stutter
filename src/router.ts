import {ReactiveController, state} from '@snar/lit';
import {installRouter} from 'pwa-helpers';
import {toast} from 'toastit';
import {SessionInterface} from './session/session.js';
import {store} from './store.js';
import {app} from './app-shell/app-shell.js';

export enum Page {
	HOME,
	SESSION,
}

class Router extends ReactiveController {
	@state() page: Page = Page.HOME;

	@state() id: number | undefined = undefined;
	// @state() youtubeURI: string | undefined = undefined;
	// @state() name: string | undefined = undefined;
	// @state() innerPauseS: number | undefined = undefined;
	// @state() repeatEveryS: number | undefined = undefined;
	// @state() numberOfRepeats: number | undefined = undefined;
	// @state() pauseBetweenRepeatsS: number | undefined = undefined;

	navigateComplete = Promise.resolve();

	goToHome() {
		location.hash = '';
	}
	goToSession(id: number) {
		window.location.hash = `id=${id}`;
	}

	constructor() {
		super();
		installRouter((location) => {
			this.navigateComplete = new Promise<void>(async (resolve) => {
				const hash = location.hash.slice(1);
				if (hash) {
					const params = new URLSearchParams(hash);
					if (!params.has('id')) {
						return this.goToHome();
					} else {
						this.id = parseInt(params.get('id'));
						if (!store.getSessionWithId(this.id)) {
							// The session doesn't exist or were deleted.
							return this.goToHome();
						}
					}
					this.page = Page.SESSION;
					await import('./pages/session-page.js');
					// await app.sessionPage.updateComplete
					app.sessionPage.loadSession(store.getSessionWithId(this.id));
				} else {
					this.page = Page.HOME;
					import('./pages/home-page.js');
				}
				resolve();
			});
		});
	}
}

export const router = new Router();
