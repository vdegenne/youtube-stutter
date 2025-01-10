import {withController} from '@snar/lit';
import {css, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {PlayerState, videoController, youtubeVideo} from '../youtube.js';
import {PageElement} from './PageElement.js';
import {loopController} from '../loop-controller.js';
import {getSessionSettingsDialog} from '../imports.js';
import {loopUIComponent} from '../loop-ui-component.js';

@customElement('session-page')
@withStyles(css`
	md-fab[inert] {
		opacity: 0.3;
	}
`)
@withController(videoController)
@withController(loopController)
export class SessionPage extends PageElement {
	render() {
		const disabledActions =
			videoController.state === PlayerState.UNLOADED ||
			videoController.state === PlayerState.BUFFERING;

		return html`<!-- -->
			<div
				class="flex-1 ${loopController.isRunning ? 'pointer-events-none' : ''}"
			>
				${youtubeVideo}
			</div>
			<div id="actions" class="flex justify-between items-center m-4">
				<md-fab ?inert=${false} invisible>
					<md-icon slot="icon">fast_rewind</md-icon>
				</md-fab>
				<div class="flex items-center gap-3">
					${loopUIComponent}
					<md-fab
						?inert=${!window.YT}
						style="--md-fab-icon-size:38px"
						@click=${() => loopController.toggle()}
					>
						${window.YT === undefined
							? html`<!-- -->
									<md-circular-progress
										indeterminate
										slot="icon"
									></md-circular-progress>
									<!-- -->`
							: !loopController.isRunning
								? html`<!-- -->
										<md-icon slot="icon">play_arrow</md-icon>
										<!-- -->`
								: html`<!-- -->
										<!-- <md-icon slot="icon">stop_circle</md-icon> -->
										<md-icon slot="icon">pause</md-icon>
										<!-- -->`}
						}
					</md-fab>
					<md-fab
						?inert=${loopController.isRunning}
						@click=${async () => (await getSessionSettingsDialog()).show()}
					>
						<md-icon slot="icon">settings</md-icon>
					</md-fab>
				</div>
				<md-fab ?inert=${false} invisible>
					<md-icon slot="icon">fast_forward</md-icon>
				</md-fab>
			</div>
			<!-- -->`;
	}
}
