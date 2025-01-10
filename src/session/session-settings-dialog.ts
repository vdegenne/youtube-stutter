import {withController} from '@snar/lit';
import {customElement} from 'custom-element-decorator';
import {css, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {bindInput} from 'relit';
import {store} from '../store.js';
import {videoController} from '../youtube.js';
import {withStyles} from 'lit-with-styles';

// @customElement('session-settings-dialog')
@customElement({name: 'session-settings-dialog', inject: true})
@withController(store)
@withStyles(css`
	md-filled-text-field {
		width: 100%;
	}
`)
class SessionSettingsDialog extends LitElement {
	@state() open = false;

	render() {
		return html`<!-- -->
			<md-dialog quick ?open=${this.open} @closed=${() => (this.open = false)}>
				<header slot="headline">Settings</header>

				<div slot="content" class="flex flex-col gap-6">
					<md-filled-text-field
						label="Repeat every"
						type="number"
						${bindInput(videoController.session, 'repeatEveryS')}
						suffix-text="seconds"
						supporting-text="Time after which the clip replays"
					></md-filled-text-field>

					<md-filled-text-field
						label="Pause between repeats"
						type="number"
						${bindInput(videoController.session, 'pauseBetweenRepeatsS')}
						suffix-text="seconds"
						supporting-text="Time to wait before the clip replays"
					></md-filled-text-field>

					<md-filled-text-field
						label="Number of repeats"
						type="number"
						${bindInput(videoController.session, 'numberOfRepeats')}
						suffix-text="times"
						supporting-text="Number of repeats before the video keeps continuing"
					></md-filled-text-field>

					<md-divider></md-divider>

					<md-filled-text-field
						label="Inner pause"
						type="nUmbEr"
						${bindInput(videoController.session, 'innerPauseS')}
						suffix-text="seconds"
						supporting-text="Time to wait before the video goes on"
					></md-filled-text-field>
				</div>

				<div slot="actions">
					<md-text-button @click=${this.close}>Close</md-text-button>
				</div>
			</md-dialog>
			<!-- -->`;
	}

	show() {
		this.open = true;
	}

	close() {
		this.open = false;
	}
}

export const sessionSettingsDialog = new SessionSettingsDialog();
