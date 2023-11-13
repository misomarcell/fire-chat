import { DestroyRef, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
	Database,
	get,
	limitToLast,
	onChildAdded,
	orderByChild,
	query,
	ref,
	serverTimestamp,
	set,
} from "@angular/fire/database";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { filter, Subject, switchMap, tap } from "rxjs";

import { ChatRoom, CreateChatRoom } from "../models/ChatRoom.model";
import { NewRoomFormComponent } from "./new-room-form/new-room-form.component";

@Injectable({
	providedIn: "root",
})
export class RoomService {
	onRoomChange$ = new Subject<ChatRoom>();

	private chatsRef = ref(this.database, "chats");

	constructor(
		private database: Database,
		private destroyRef: DestroyRef,
		private router: Router,
		private dialog: MatDialog
	) {
		const chatRoomsQuery = query(this.chatsRef, limitToLast(25), orderByChild("timestamp"));
		onChildAdded(chatRoomsQuery, (snapshot) => {
			this.onRoomChange$.next(snapshot.val());
		});
	}

	openRoomCreateDialog() {
		const dialogInstance = this.dialog.open(NewRoomFormComponent, { width: "500px" });

		dialogInstance
			.afterClosed()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				filter((chatRoom: CreateChatRoom) => !!chatRoom),
				switchMap((chatRoom: CreateChatRoom) => this.crateNewRoom(chatRoom).then(() => chatRoom)),
				tap((chatRoom: CreateChatRoom) => this.router.navigate(["/chat", chatRoom.id]))
			)
			.subscribe();
	}

	async crateNewRoom(chatRoom: CreateChatRoom): Promise<void> {
		const roomRef = ref(this.database, `chats/${chatRoom.id}`);

		await get(roomRef).then((snapshot) => snapshot.exists() && Promise.reject("Room already exists"));
		await set(roomRef, { ...chatRoom, timestamp: serverTimestamp() });
	}
}
