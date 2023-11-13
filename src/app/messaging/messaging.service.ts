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

import { Message, MessageBase, MessageToSend } from "../models/Message.model";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class MessagingService {
	onMessage$: Subject<Message> = new Subject();

	private messagesRef: DatabaseReference | undefined;
	private unsubscribeFromMessages = () => {};

	constructor(private database: Database) {}

	initMessages(chatId: string) {
		this.unsubscribeFromMessages();
		this.messagesRef = ref(this.database, `chats/${chatId}/messages`);

		const messagesQuery = query(this.messagesRef, limitToLast(100));
		this.unsubscribeFromMessages = onChildAdded(messagesQuery, (snapshot) => {
			this.onMessage$.next(snapshot.val());
		});
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
