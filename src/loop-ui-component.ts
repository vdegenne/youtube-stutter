import {withController} from '@snar/lit';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query, state} from 'lit/decorators.js';
import {ControllerState, loopController} from './loop-controller.js';
import type {MdCircularProgress} from '@material/web/all.js';
import {videoController, youtubeVideo} from './youtube.js';
import toast from 'toastit';

@customElement('loop-ui-component')
@withStyles()
@withController(loopController)
class LoopUIComponent extends LitElement {
	#progressInterval: number | null = null;
	@state() progress = 0;

	@query('md-circular-progress') circularProgress?: MdCircularProgress;

	updated() {
		if (loopController.isRunning && this.#progressInterval === null) {
			this.#progressInterval = setInterval(() => {
				this.updateCircularProgress();
			}, 500);
		} else if (!loopController.isRunning) {
			clearInterval(this.#progressInterval);
			this.#progressInterval = null;
		}
	}

	updateCircularProgress() {
		let value = 0;
		let progress: number;
		switch (loopController.state) {
			case ControllerState.WAITING_RESUME:
				progress =
					videoController.session.innerPauseS -
					(loopController.resumeAt - Date.now()) / 1000;
				value = progress / videoController.session.innerPauseS;
				break;
			case ControllerState.WAITING_REPEAT:
				progress =
					videoController.session.pauseBetweenRepeatsS -
					(loopController.resumeAt - Date.now()) / 1000;
				value = progress / videoController.session.pauseBetweenRepeatsS;
				break;

			case ControllerState.WAITING_PAUSE:
				const startTime =
					loopController.pauseAt - videoController.session.repeatEveryS;
				// toast(startTime, {leading: true});
				progress =
					videoController.session.repeatEveryS -
					(loopController.pauseAt - youtubeVideo.currentTime);
				value = progress / videoController.session.repeatEveryS;
				break;
		}
		if (value) {
			this.progress = value;
		}
	}

	render() {
		return html`<!-- -->
			<md-filled-tonal-icon-button inert>
				<div class="flex justify-center items-center">
					<md-circular-progress
						value=${this.progress}
						class="absolute"
					></md-circular-progress>
					${loopController.isRunning
						? loopController.state === ControllerState.WAITING_RESUME
							? html`<!-- -->
									<md-icon>resume</md-icon>
									<!-- -->`
							: loopController.state === ControllerState.WAITING_PAUSE
								? html`<!-- -->
										<md-icon>pause</md-icon>
										<!-- -->`
								: loopController.state === ControllerState.WAITING_REPEAT
									? html`<!-- -->

											<md-icon>replay</md-icon>
											<!-- -->`
									: null
						: html`<!-- -->
								<md-icon>pause</md-icon>

								<!-- -->`}
				</div>
			</md-filled-tonal-icon-button>
			<!-- -->`;
	}
}

export const loopUIComponent = new LoopUIComponent();
