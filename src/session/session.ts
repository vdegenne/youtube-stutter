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
	@state() repeatEveryS = 5;
	@state() pauseBetweenRepeatsS = 3;
	@state() numberOfRepeats = 2;
	@state() innerPauseS = 5;

	updated() {
		store.requestUpdate();
	}
}
