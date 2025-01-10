import {ReactiveController, state} from '@snar/lit';
import {videoController, youtubeVideo} from './youtube.js';
import {sleep} from './utils.js';

export enum ControllerState {
	WAITING_RESUME = 'WAITING_RESUME',
	WAITING_PAUSE = 'WAITING_PAUSE',
	WAITING_REPEAT = 'WAITING_REPEAT',
}

class LoopController extends ReactiveController {
	@state() state: ControllerState = ControllerState.WAITING_RESUME;

	#repeatCount = 0;
	#pauseAt: number | undefined = undefined;
	#resumeAt: number | undefined = undefined;

	get resumeAt() {
		return this.#resumeAt;
	}
	get pauseAt() {
		return this.#pauseAt;
	}

	@state() isRunning = false;
	#frameRequest = null;

	resetState() {
		this.state = ControllerState.WAITING_RESUME;
		this.#repeatCount = 0;
	}

	async updateState() {
		switch (this.state) {
			case ControllerState.WAITING_RESUME:
				this.state = ControllerState.WAITING_PAUSE; // We wait for a pause after resume
				this.#pauseAt =
					youtubeVideo.currentTime + videoController.session.repeatEveryS;
				youtubeVideo.play();
				break;

			case ControllerState.WAITING_PAUSE:
				youtubeVideo.pause();
				this.#repeatCount++;
				if (this.#repeatCount !== videoController.session.numberOfRepeats) {
					this.state = ControllerState.WAITING_REPEAT;
					this.#resumeAt =
						Date.now() + videoController.session.pauseBetweenRepeatsS * 1000;
				} else {
					// TODO: if innerPauseS is equal to 0, we should probably avoid
					// to pause the video and jump directly onto the next state.
					this.#resumeAt =
						Date.now() + videoController.session.innerPauseS * 1000;
					// We made a complete loop, reset state
					this.resetState();
				}
				break;

			case ControllerState.WAITING_REPEAT:
				this.state = ControllerState.WAITING_PAUSE;
				youtubeVideo.currentTime -= videoController.session.repeatEveryS;
				// That's a trick to make sure the video seeking process terminates
				// before heading back into the loop that could potentially retrigger
				// an update.
				await sleep(100);
				youtubeVideo.play();
				break;
		}
	}

	start() {
		if (this.isRunning) return;
		this.isRunning = true;

		this.resetState();
		this.updateState();

		const loop = async () => {
			if (!this.isRunning) return;

			switch (this.state) {
				case ControllerState.WAITING_RESUME:
				case ControllerState.WAITING_REPEAT:
					if (Date.now() >= this.#resumeAt) {
						await this.updateState();
					}
					break;

				case ControllerState.WAITING_PAUSE:
					if (youtubeVideo.currentTime >= this.#pauseAt) {
						youtubeVideo.currentTime = this.#pauseAt;
						await this.updateState();
					}
					break;
			}

			// console.clear();
			// console.log(`state: ${this.state}`);
			// console.log(`repeat count: ${this.#repeatCount}`);
			// console.log(`current video time: ${youtubeVideo.currentTime}`);
			// console.log(`Date.now(): `, Date.now());
			// console.log(`resume at: ${this.#resumeAt}`);
			// console.log(`pause at: ${this.#pauseAt}`);

			await sleep(10);

			this.#frameRequest = requestAnimationFrame(loop);
		};

		this.#frameRequest = requestAnimationFrame(loop);
	}

	stop() {
		this.isRunning = false;
		if (this.#frameRequest) {
			cancelAnimationFrame(this.#frameRequest);
			this.#frameRequest = null;
		}
		youtubeVideo.pause();
	}

	toggle() {
		if (!this.isRunning) {
			this.start();
		} else {
			this.stop();
		}
	}
}
export const loopController = new LoopController();
