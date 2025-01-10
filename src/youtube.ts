import {ReactiveController, withController} from '@snar/lit';
import {html, LitElement, PropertyValues} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {state} from 'snar';
import {type Session} from './session/session.js';
import toast from 'toastit';

declare global {
	interface Window {
		onYouTubeIframeAPIReady: Function;
		YouTubeIframeAPIReady: Promise<void>;
	}
}

let scriptWasInjected = false;

const {promise, resolve} = Promise.withResolvers<void>();
window.YouTubeIframeAPIReady = promise;
window.onYouTubeIframeAPIReady =
	/**
	 * This function is called when the iframe API is ready
	 */
	function () {
		resolve();
	};

export enum PlayerState {
	UNLOADED = -2,
	UNSTARTED = -1, // YT.PlayerState.UNSTARTED,
	ENDED = 0, // YT.PlayerState.ENDED,
	PLAYING = 1, // YT.PlayerState.PLAYING,
	PAUSED = 2, // YT.PlayerState.PAUSED,
	BUFFERING = 3, // YT.PlayerState.BUFFERING,
	CUED = 5, // YT.PlayerState.CUED,
}

class VideoController extends ReactiveController {
	@state() session: Session | undefined = undefined;
	@state() state: PlayerState = PlayerState.UNLOADED;
}
export const videoController = new VideoController();

@customElement('youtube-video')
@withController(videoController)
export class YouTubeVideo extends LitElement {
	/**
	 * Id of the YouTube video.
	 */
	@state() videoId: string | undefined = undefined;

	#player: YT.Player;
	@query('#player') playerElement!: HTMLDivElement;

	protected update(changedProperties: PropertyValues): void {
		this.videoId = videoController.session.youtubeVideoId;
		super.update(changedProperties);
	}

	async updated(changed: PropertyValues<this>) {
		if (changed.has('videoId') && this.videoId !== undefined) {
			if (!scriptWasInjected) {
				const s = document.createElement('script');
				s.src = 'https://www.youtube.com/iframe_api';
				// this.renderRoot.appendChild(s);
				document.head.appendChild(s);
			}
			await window.YouTubeIframeAPIReady;
			this.resetPlayerWrapper();
			this.#player = new YT.Player(this.playerElement, {
				// height: '390',
				// width: '640',
				height: '100%',
				width: '100%',
				videoId: this.videoId,
				playerVars: {
					playsinline: 0,
				},
				events: {
					onReady: () => {
						videoController.state = YT.PlayerState.UNSTARTED;
					},
					onStateChange: (event) => {
						toast(event.data, {leading: true});
						videoController.state = event.data;
					},
				},
			});
		}
	}

	play() {
		this.#player.playVideo();
	}
	pause() {
		this.#player.pauseVideo();
	}
	toggle() {
		if (
			videoController.state === PlayerState.UNSTARTED ||
			videoController.state === PlayerState.PAUSED ||
			videoController.state === PlayerState.ENDED
		) {
			return this.play();
		}
		if (videoController.state === PlayerState.PLAYING) {
			return this.pause();
		}
	}

	get currentTime() {
		return this.#player.getCurrentTime();
	}
	set currentTime(seconds: number) {
		this.#player.seekTo(seconds, true);
	}

	render() {
		return html`<!-- -->
			<div id="player-wrapper" style="height:100%;">
				<div id="player"></div>
			</div>
			<!-- -->`;
	}

	resetPlayerWrapper() {
		this.renderRoot.querySelector<HTMLElement>('#player-wrapper').innerHTML =
			'<div id=player></div>';
	}
}

export const youtubeVideo = new YouTubeVideo();
