import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-bottom-toolbar",
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./bottom-toolbar.component.html",
	styleUrl: "./bottom-toolbar.component.scss",
})
export class BottomToolbarComponent {
	@Output() toggleSideNav = new EventEmitter<void>();

	@HostBinding("class.bottom-toolbar") hostClass = true;
	constructor() {}
}
