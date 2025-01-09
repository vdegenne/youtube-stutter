import {html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import toast from 'toastit';
import {PageElement} from './PageElement.js';
import {store} from '../store.js';
import {Session} from '../session/session.js';
import {router} from '../router.js';

@customElement('home-page')
@withStyles()
export class HomePage extends PageElement {
	render() {
		return html`<!-- -->
			WELCOME
			<md-fab
				size="large"
				class="absolute bottom-12 right-12"
				@click=${this.#addSession}
			>
				<md-icon slot="icon">add</md-icon>
			</md-fab>
			<!-- -->`;
	}

	async #addSession() {
		try {
			const {SessionDialog} = await import('../session/session-dialog.js');
			const dialog = new SessionDialog();
			let sessionObj = new Session();
			const modified = await dialog.show(sessionObj);
			sessionObj.youtubeVideoId = modified.youtubeVideoId;
			sessionObj.name = modified.name;
			store.addSession(sessionObj);
			router.goToSession(sessionObj.id);
		} catch (error) {
			console.log(error);
			toast('canceled');
		}
	}
}
