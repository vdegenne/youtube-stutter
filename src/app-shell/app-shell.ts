import {withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {Page, router} from '../router.js';
import styles from './app-shell.css?inline';
import {type HomePage} from '../pages/home-page.js';
import {type SessionPage} from '../pages/session-page.js';

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
@withController(router)
export class AppShell extends LitElement {
	@query('home-page') homePage!: HomePage;
	@query('session-page') sessionPage!: SessionPage;
	// @query('[active]') activePage!: HomePage | SessionPage;

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`<!-- -->
			<home-page ?active=${router.page === Page.HOME}></home-page>
			<session-page ?active=${router.page === Page.SESSION}></session-page>
			<!-- -->`;
	}
}

export const app = (window.app = new AppShell());
