import { Component, HostBinding, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Message } from "../../models/Message.model";

@Component({
	selector: "app-message",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./message.component.html",
	styleUrl: "./message.component.scss",
})
export class MessageComponent {
	@Input() message: Message | undefined;
	@HostBinding("class.app-message") hostClass = true;
	constructor() {}

	stringHashToColor(str: string): string {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}

		const c = (hash & 0x00ffffff).toString(16).toUpperCase();

		return "#" + "00000".substring(0, 6 - c.length) + c;
	}
}
