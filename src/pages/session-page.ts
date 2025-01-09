import {css, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query, state} from 'lit/decorators.js';
import {PageElement} from './PageElement.js';
import {type Session} from '../session/session.js';
import '../youtube.ts';
import {withController} from '@snar/lit';
import {PlayerState, videoController, YouTubeVideo} from '../youtube.js';

@customElement('session-page')
@withStyles(css`
	md-fab[inert] {
		opacity: 0.5;
	}
`)
@withController(videoController)
export class SessionPage extends PageElement {
	@state() session: Session | undefined = undefined;

	@query('youtube-video') youtubeVideo!: YouTubeVideo;

	loadSession(session: Session) {
		this.session = session;
	}

	shouldUpdate() {
		return !!this.session;
	}

	render() {
		const disabledActions =
			videoController.state === PlayerState.UNLOADED ||
			videoController.state === PlayerState.BUFFERING;

		console.log(window.YT, videoController.state);

		return html`<!-- -->
			<div class="w-full flex flex-col">
				<youtube-video
					class="flex-1"
					.videoId=${this.session.youtubeVideoId}
				></youtube-video>

				<div id="actions" class="flex justify-between items-center m-4">
					<md-fab ?inert=${disabledActions}>
						<md-icon slot="icon">fast_rewind</md-icon>
					</md-fab>
					<md-fab
						?inert=${disabledActions}
						style="--md-fab-icon-size:38px"
						@click=${() => this.youtubeVideo.toggle()}
					>
						${window.YT === undefined
							? html`<!-- -->
									<md-circular-progress
										indeterminate
										slot="icon"
									></md-circular-progress>
									<!-- -->`
							: videoController.state === PlayerState.UNSTARTED ||
								  videoController.state === PlayerState.PAUSED
								? html`<!-- -->
										<md-icon slot="icon">play_arrow</md-icon>
										<!-- -->`
								: html`<!-- -->
										<md-icon slot="icon">pause</md-icon>
										<!-- -->`}
						}
					</md-fab>
					<md-fab ?inert=${disabledActions}>
						<md-icon slot="icon">fast_forward</md-icon>
					</md-fab>
				</div>
			</div>
			<!-- -->`;
	}
}
