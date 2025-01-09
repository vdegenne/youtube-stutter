import {ReactiveController, state} from '@snar/lit';
import {type Session} from './session/session.js';
import toast from 'toastit';
// import { saveToLocalStorage } from "snar-save-to-local-storage";

// @saveToLocalStorage('something')
export class AppStore extends ReactiveController {
	@state() sessions: Session[] = [];

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
		if (session.id === undefined) {
			session.id = this.getNextId();
		}
		if (this.getSessionWithId(session.id)) {
			toast('This session already exists.');
			return; // can't add a session that exist
		}
		this.sessions = [...this.sessions, session];
		this.sessions.push(session);
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

export const store = new AppStore();
