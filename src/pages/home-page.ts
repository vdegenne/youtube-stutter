import {html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import toast from 'toastit';
import {PageElement} from './PageElement.js';
import {store} from '../store.js';
import {Session} from '../session/session.js';
import {getRouter, getSessionDialog} from '../imports.js';

@customElement('home-page')
@withStyles()
export class HomePage extends PageElement {
	render() {
		return html`<!-- -->
			<md-list
				>${store.sessions.map((session) => {
					return html`<!-- -->
						<md-list-item href="#id=${session.id}">
							<span>${session.youtubeVideoId}</span>
						</md-list-item>
						<!-- -->`;
				})}</md-list
			>
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
			const {SessionDialog} = await getSessionDialog();
			const dialog = new SessionDialog();
			let sessionObj = new Session();
			const modified = await dialog.show(sessionObj);
			sessionObj.youtubeVideoId = modified.youtubeVideoId;
			sessionObj.name = modified.name;
			store.addSession(sessionObj);
			const router = await getRouter();
			router.goToSession(sessionObj.id);
		} catch (error) {
			console.log(error);
			toast('canceled');
		}
	}
}
