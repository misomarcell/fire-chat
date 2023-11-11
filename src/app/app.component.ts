import { CommonModule } from "@angular/common";
import { Component, HostBinding, inject } from "@angular/core";
import {
	Database,
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
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";

interface Message {
	id: string;
	message: string;
	name: string;
}

@Component({
	selector: "app-root",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterOutlet,
		MatSidenavModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatRippleModule,
	],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	entries: Message[] = [];
	database: Database = inject(Database);

	form: FormGroup = new FormGroup({
		message: new FormControl(""),
	});

	private messagesRef = ref(this.database, "messages");

	@HostBinding("class.app-component") hostClass = true;
	constructor() {}

	async ngOnInit() {
		const q = query(this.messagesRef);
		onChildAdded(q, (snapshot) => {
			this.entries.unshift(snapshot.val());
		});
	}

	async onSubmit() {
		if (this.form.invalid) return;

		const newMessage = {
			message: this.form.value.message,
			name: this.getName(),
		} as Message;
		await push(this.messagesRef, newMessage);
		this.form.reset();
	}

	private getName(): string {
		const localStorageName = localStorage.getItem("name");
		if (localStorageName) return localStorageName;

		const name = Math.random().toString(36).substring(7);
		localStorage.setItem("name", name);

		return name;
	}
}
