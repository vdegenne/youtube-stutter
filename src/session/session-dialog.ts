import type {MdDialog} from '@material/web/all.js';
import {customElement} from 'custom-element-decorator';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import {bindInput} from 'relit';
import styles from './session-dialog.css?inline';
import {type Session} from './session.js';

declare global {
	interface Window {
		sessionDialog: SessionDialog;
	}
	interface HTMLElementTagNameMap {
		'session-dialog': SessionDialog;
	}
}

type ResolveValue = Session;

@customElement({name: 'session-dialog', inject: true})
@withStyles(styles)
export class SessionDialog extends LitElement {
	@state() open = false;
	@state() source!: ResolveValue;
	@state() youtubeVideoId = '';
	@state() name = undefined;

	@query('md-dialog') dialog!: MdDialog;

	canSubmit() {
		return (
			this.youtubeVideoId &&
			this.youtubeVideoId !== this.source.youtubeVideoId &&
			/^[_a-zA-Z0-9]+$/.test(this.youtubeVideoId)
		);
	}

	render() {
		// const nameAlreadyExists = store.collections.some(
		// 	(col) => col.name === this.name,
		// );

		return html`<!-- -->
			<md-dialog
				?open="${this.open}"
				@opened=${() => {
					this.renderRoot.querySelector<HTMLElement>('[autofocus]')?.focus();
				}}
				@close="${() => {
					const returnValue = this.dialog.returnValue;
					if (!returnValue || returnValue === 'cancel') {
						this.#submitReject();
					} else {
						this.#submitResolve({
							youtubeVideoId: this.youtubeVideoId,
							name: this.name,
						} as Session);
					}
				}}"
				@closed=${this.remove}
			>
				<header slot="headline">Session</header>

				<form slot="content" method="dialog" id="form">
					<div class="flex flex-col gap-4">
						<md-filled-text-field
							autofocus
							required
							label="YouTube ID"
							${bindInput(this, 'youtubeVideoId')}
						></md-filled-text-field>
						<div>
							<md-suggestion-chip
								elevated
								@click=${() => {
									this.youtubeVideoId = '_vhf0RZg0fg';
								}}
								>_vhf0RZg0fg</md-suggestion-chip
							>
						</div>
						<md-filled-text-field
							label="name (optional)"
							${bindInput(this, 'name')}
						></md-filled-text-field>
					</div>
				</form>

				<div slot="actions">
					<md-text-button @click=${() => this.close('cancel')}>
						Cancel
					</md-text-button>
					<md-filled-button
						form="form"
						value="accept"
						?disabled=${!this.canSubmit()}
					>
						Accept
					</md-filled-button>
				</div>
			</md-dialog>
			<!-- -->`;
	}

	#submitPromise: Promise<ResolveValue>;
	#submitResolve: (value: ResolveValue) => void;
	#submitReject: (reason?: any) => void;

	/**
	 * The source is not duplicated but will never be modified so you don't need to clone it before
	 * feeding it into this function.
	 */
	async show(source: ResolveValue) {
		this.source = source;
		this.youtubeVideoId = this.source.youtubeVideoId;
		this.name = this.source.name;
		this.open = true;
		const {promise, resolve, reject} = Promise.withResolvers<ResolveValue>();
		this.#submitPromise = promise;
		this.#submitResolve = resolve;
		this.#submitReject = reject;
		return promise;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}
