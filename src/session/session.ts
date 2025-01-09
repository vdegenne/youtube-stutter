import {ReactiveController} from '@snar/lit';
import {state} from 'lit/decorators.js';

export interface SessionInterface {
	youtubeVideoId: string;
	name: string;
	innerPauseS: number;
	repeatEveryS: number;
	numberOfRepeats: number;
	pauseBetweenRepeatsS: number;
}

export class Session
	extends ReactiveController<SessionInterface>
	implements SessionInterface
{
	id: number | undefined = undefined;
	@state() youtubeVideoId = '';
	@state() name = '';
	@state() innerPauseS = 4;
	@state() repeatEveryS = 3;
	@state() numberOfRepeats = 2;
	@state() pauseBetweenRepeatsS = 3;

	updated() {
		// TODO: when something changes we should save to the store.
	}
}
