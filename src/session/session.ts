import {ReactiveController} from '@snar/lit';
import {state} from 'lit/decorators.js';
import {store} from '../store.js';
import {type PropertyValues} from 'snar';

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
	@state() id: number | null = null;
	@state() youtubeVideoId = '';
	@state() name = '';
	@state() innerPauseS = 4;
	@state() repeatEveryS = 3;
	@state() numberOfRepeats = 2;
	@state() pauseBetweenRepeatsS = 3;

	updated() {
		store.requestUpdate();
	}
}
