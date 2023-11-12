import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Database, ref, set } from "@angular/fire/database";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { switchMap, tap } from "rxjs";

import { CreateChatRoom } from "../models/ChatRoom.model";
import { NewRoomFormComponent } from "./new-room-form/new-room-form.component";

@Injectable({
	providedIn: "root",
})
export class RoomService {
	private destriyRef = inject(DestroyRef);

	constructor(private database: Database, private router: Router, private dialog: MatDialog) {}

	openRoomCreateDialog() {
		const dialogInstance = this.dialog.open(NewRoomFormComponent, { width: "500px" });

		dialogInstance
			.afterClosed()
			.pipe(
				takeUntilDestroyed(this.destriyRef),
				switchMap((chatRoom: CreateChatRoom) => this.crateNewRoom(chatRoom).then(() => chatRoom)),
				tap((chatRoom: CreateChatRoom) => this.router.navigate(["/chat", chatRoom.id]))
			)
			.subscribe();
	}

	async crateNewRoom(chatRoom: CreateChatRoom): Promise<void> {
		const chatsRef = ref(this.database, `chats/${chatRoom.id}`);
		await set(chatsRef, chatRoom);
	}
}
