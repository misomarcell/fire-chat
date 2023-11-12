import { Injectable } from "@angular/core";
import { Database, push, ref, serverTimestamp, set } from "@angular/fire/database";
import { MatDialog } from "@angular/material/dialog";

import { CreateChatRoom } from "../models/ChatRoom.model";
import { NewRoomFormComponent } from "./new-room-form/new-room-form.component";
import { Subscription, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class RoomService {
	private subscriptions = new Subscription();

	constructor(private database: Database, private router: Router, private dialog: MatDialog) {}

	ngOnDestroy(): void {
		this.subscriptions?.unsubscribe();
	}

	openRoomCreateDialog() {
		const dialogInstance = this.dialog.open(NewRoomFormComponent, { width: "500px" });

		const dialogResult = dialogInstance
			.afterClosed()
			.pipe(
				switchMap((chatRoom: CreateChatRoom) => this.crateNewRoom(chatRoom).then(() => chatRoom)),
				tap((chatRoom: CreateChatRoom) => this.router.navigate(["/chat", chatRoom.id]))
			)
			.subscribe();

		this.subscriptions.add(dialogResult);
	}

	async crateNewRoom(chatRoom: CreateChatRoom): Promise<void> {
		const chatsRef = ref(this.database, `chats/${chatRoom.id}`);
		await set(chatsRef, chatRoom);
	}
}
