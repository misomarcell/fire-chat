import { Injectable } from "@angular/core";
import {
	Database,
	DatabaseReference,
	limitToLast,
	onChildAdded,
	push,
	query,
	ref,
	serverTimestamp,
} from "@angular/fire/database";
import { ReplaySubject } from "rxjs";

import { Message, MessageBase, MessageToSend } from "../models/Message.model";

@Injectable({
	providedIn: "root",
})
export class MessagingService {
	private messagesRef: DatabaseReference | undefined;
	private unsubscribeFromMessages = () => {};

	constructor(private database: Database) {}

	getMessages$(chatId: string) {
		const onMessage$ = new ReplaySubject<Message>();

		this.unsubscribeFromMessages();
		this.messagesRef = ref(this.database, `chats/${chatId}/messages`);

		const messagesQuery = query(this.messagesRef, limitToLast(100));
		this.unsubscribeFromMessages = onChildAdded(messagesQuery, (snapshot) => {
			onMessage$?.next(snapshot.val());
		});

		return onMessage$;
	}

	async sendMessage(message: MessageBase): Promise<void> {
		if (!this.messagesRef) return;

		const messageToSend: MessageToSend = {
			...message,
			timestamp: serverTimestamp(),
		};

		await push(this.messagesRef, messageToSend);
	}
}
