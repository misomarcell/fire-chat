import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	HostBinding,
	inject,
	ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Database, DatabaseReference, onChildAdded, push, query, ref, serverTimestamp } from "@angular/fire/database";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { filter, tap } from "rxjs";

import { MessageComponent } from "../message/message.component";
import { Message, MessageToSend } from "../models/Message.model";

@Component({
	selector: "app-message-board",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatRippleModule,
		MessageComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./message-board.component.html",
	styleUrl: "./message-board.component.scss",
})
export class MessageBoardComponent {
	messages: Message[] = [];
	database: Database = inject(Database);
	form: FormGroup = new FormGroup({
		message: new FormControl(""),
	});

	private destroyRef = inject(DestroyRef);
	private messagesRef: DatabaseReference | undefined;
	private unsubscribeFromMessages = () => {};

	@ViewChild("messageInput") messageInput: ElementRef<HTMLInputElement> | undefined;
	@HostBinding("class.app-message-board") hostClass = true;
	constructor(private activatedRoute: ActivatedRoute, private changeDetector: ChangeDetectorRef) {
		this.activatedRoute.params
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				filter((params) => !!params["id"]),
				tap((params) => this.initMessages(params["id"]))
			)
			.subscribe();
	}

	initMessages(chatId: string) {
		this.unsubscribeFromMessages();
		this.messagesRef = ref(this.database, `chats/${chatId}/messages`);
		this.messageInput?.nativeElement.focus();
		this.messages = [];

		this.changeDetector.markForCheck();

		const messagesQuery = query(this.messagesRef);
		this.unsubscribeFromMessages = onChildAdded(messagesQuery, (snapshot) => {
			this.addMessage(snapshot.val());
		});
	}

	async onSubmit() {
		if (!this.form.value.message) return;
		if (!this.messagesRef) return;

		const newMessage: MessageToSend = {
			timestamp: serverTimestamp(),
			message: this.form.value.message,
			name: this.getName(),
		};

		await push(this.messagesRef, newMessage);
		this.form.reset();
	}

	private addMessage(message: Message): void {
		this.messages.unshift(message);
		this.changeDetector.markForCheck();
	}

	private getName(): string {
		const localStorageName = localStorage.getItem("name");
		if (localStorageName) return localStorageName;

		const name = Math.random().toString(36).substring(7);
		localStorage.setItem("name", name);

		return name;
	}
}
