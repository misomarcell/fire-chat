import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
	Database,
	get,
	onChildAdded,
	push,
	query,
	ref,
} from "@angular/fire/database";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { RouterOutlet } from "@angular/router";

interface Message {
	id: string;
	message: string;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	entries: Message[] = [];
	database: Database = inject(Database);

	form: FormGroup = new FormGroup({
		message: new FormControl(""),
	});

	private messagesRef = ref(this.database, `messages`);

	constructor() {}

	async ngOnInit() {
		const q = query(this.messagesRef);
		const messages = await get(q);

		const fetchedMessages = messages.val();
		for (let i in fetchedMessages) {
			this.entries.push(fetchedMessages[i]);
		}

		onChildAdded(q, (snapshot) => {
			this.entries.push(snapshot.val());
		});
	}

	async onSubmit() {
		const newMessage = { message: this.form.value.message } as Message;
		await push(this.messagesRef, newMessage);
		this.form.reset();
	}
}
