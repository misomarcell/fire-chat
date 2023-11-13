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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { filter, map, switchMap, tap } from "rxjs";

import { Message, MessageBase } from "../../models/Message.model";
import { MessageComponent } from "../message/message.component";
import { MessagingService } from "../messaging.service";

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
	form: FormGroup = new FormGroup({
		message: new FormControl(""),
	});

	@ViewChild("messageInput") messageInput: ElementRef<HTMLInputElement> | undefined;
	@HostBinding("class.app-message-board") hostClass = true;
	constructor(
		private messagingService: MessagingService,
		private destroyRef: DestroyRef,
		private activatedRoute: ActivatedRoute,
		private changeDetector: ChangeDetectorRef
	) {
		this.activatedRoute.params
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				map((params) => params["id"]),
				filter((chatId) => !!chatId),
				tap((chatId) => {
					this.messageInput?.nativeElement.focus();
					this.messages = [];

					this.messagingService.initMessages(chatId);
					this.changeDetector.markForCheck();
				}),
				switchMap(() => this.messagingService.onMessage$.asObservable()),
				tap((message) => this.displayMessage(message))
			)
			.subscribe();
	}

	async onSubmit() {
		if (!this.form.value.message) return;

		const message: MessageBase = {
			message: this.form.value.message,
			name: this.getName(),
		};

		this.messagingService.sendMessage(message);
		this.form.reset();
	}

	private displayMessage(message: Message): void {
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
