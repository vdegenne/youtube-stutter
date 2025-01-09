import {css, LitElement, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

export class PageElement extends LitElement {
	@property({type: Boolean, reflect: true}) active = false;

	static styles = css`
		:host {
			display: flex;
			position: absolute;
			inset: 0;
		}
		:host(:not([active])) {
			display: none;
			pointer-events: none;
		}
	`;

	protected shouldUpdate(_changedProperties: PropertyValues): boolean {
		return this.active;
	}
}
