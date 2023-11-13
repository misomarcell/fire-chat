import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { tap } from "rxjs";

import { ChatRoom } from "../models/ChatRoom.model";
import { RoomService } from "../rooms/room.service";

@Component({
	selector: "app-menu",
	standalone: true,
	imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
	templateUrl: "./menu.component.html",
	styleUrl: "./menu.component.scss",
})
export class MenuComponent {
	chatRooms: ChatRoom[] = [];

	constructor(
		private roomService: RoomService,
		private destroyRef: DestroyRef,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.roomService.onRoomChange$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap((chatRoom) => {
					this.chatRooms.unshift(chatRoom);
					this.changeDetectorRef.detectChanges();
				})
			)
			.subscribe();
	}

	onCreateNewRoomClick(): void {
		this.roomService.openRoomCreateDialog();
	}
}
