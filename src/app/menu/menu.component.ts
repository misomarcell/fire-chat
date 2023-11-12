import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { Database, limitToLast, onChildAdded, query, ref } from "@angular/fire/database";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { ChatRoom } from "../models/ChatRoom.model";
import { RoomService } from "../rooms/room.service";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-menu",
	standalone: true,
	imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
	templateUrl: "./menu.component.html",
	styleUrl: "./menu.component.scss",
})
export class MenuComponent {
	chatRooms: ChatRoom[] = [];

	private database: Database = inject(Database);
	private chatsRef = ref(this.database, "chats");

	constructor(private roomService: RoomService, private changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit(): void {
		const chatRoomsQuery = query(this.chatsRef, limitToLast(10));
		onChildAdded(chatRoomsQuery, (snapshot) => {
			const chatRoom = snapshot.val();
			this.chatRooms.unshift(chatRoom);
			this.changeDetectorRef.detectChanges();
		});
	}

	onCreateNewRoomClick(): void {
		this.roomService.openRoomCreateDialog();
	}
}
