import {LitElement, PropertyValues, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {type Router} from '../router.js';
import styles from './app-shell.css?inline';
import {type HomePage} from '../pages/home-page.js';
import {type SessionPage} from '../pages/session-page.js';
import {getRouter} from '../imports.js';
import {Page} from '../pages/index.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
// @withController(router)
export class AppShell extends LitElement {
	@query('home-page') homePage!: HomePage;
	@query('session-page') sessionPage!: SessionPage;
	// @query('[active]') activePage!: HomePage | SessionPage;

	#router: Router;
	constructor() {
		super();
		getRouter().then((router) => {
			this.#router = router;
			this.#router.bind(this);
			this.requestUpdate();
		});
	}

	async firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	protected shouldUpdate(_changedProperties: PropertyValues): boolean {
		return !!this.#router;
	}

	render() {
		return html`<!-- -->
			<home-page ?active=${this.#router.page === Page.HOME}></home-page>
			<session-page
				?active=${this.#router.page === Page.SESSION}
			></session-page>
			<!-- -->`;
	}
}

export const app = (window.app = new AppShell());
