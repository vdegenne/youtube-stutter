import {ReactiveController, state} from '@snar/lit';
import {Session} from './session/session.js';
import toast from 'toastit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {type PropertyValues} from 'lit';

declare global {
	interface Window {
		store: AppStore;
	}
}

@saveToLocalStorage('youtube-stutter:store')
export class AppStore extends ReactiveController {
	@state() sessions: Session[] = [];

	update(changed: PropertyValues<this>) {
		if (this.sessions.length > 0 && !(this.sessions[0] instanceof Session)) {
			this.sessions = this.sessions.map(
				(session) => new Session(null, session),
			);
		}
	}

	getSessionWithId(id: number) {
		return this.sessions.find((s) => s.id === id);
	}

	getNextId() {
		if (this.sessions.length === 0) {
			return 0;
		}
		const ids = this.sessions.map((s) => s.id);
		ids.sort();
		return ids.pop() + 1;
	}

	addSession(session: Session) {
		if (session.id === null) {
			session.id = this.getNextId();
		}
		if (this.getSessionWithId(session.id)) {
			toast('This session already exists.');
			return; // can't add a session that exist
		}
		this.sessions = [...this.sessions, session];
		return session;
	}
	removeSession(session: Session) {
		const s = this.getSessionWithId(session.id);
		if (!s) {
			toast("Can't find the session");
			return;
		}
		this.sessions.splice(this.sessions.indexOf(s), 1);
		this.sessions = [...this.sessions];
	}
}

export const store = (window.store = new AppStore());
