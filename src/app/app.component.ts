import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";

import { MenuComponent } from "./menu/menu.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, RouterOutlet, MatButtonModule, MatSidenavModule, MenuComponent, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	isHandset = false;

	@ViewChild("drawer") sidenav: MatDrawer | undefined;
	@HostBinding("class.app-component") hostClass = true;
	constructor(private breakpointObserver: BreakpointObserver, private changeDetectorRef: ChangeDetectorRef) {
		this.breakpointObserver.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
			this.isHandset = result.matches;

			if (!result.matches) {
				this.sidenav?.open();
			} else {
				this.sidenav?.close();
			}

			this.changeDetectorRef.markForCheck();
		});
	}
}
