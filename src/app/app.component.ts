import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";
import { MenuComponent } from "./menu/menu.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, RouterOutlet, MatSidenavModule, MenuComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	@HostBinding("class.app-component") hostClass = true;
	constructor() {}
}
