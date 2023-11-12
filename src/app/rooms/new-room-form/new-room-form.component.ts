import { Component, HostBinding, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";

@Component({
	selector: "app-new-room-form",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatInputModule,
	],
	templateUrl: "./new-room-form.component.html",
	styleUrl: "./new-room-form.component.scss",
})
export class NewRoomFormComponent {
	formGroup = new FormGroup({
		id: new FormControl("", [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]),
		isPrivate: new FormControl(false),
		roomPassword: new FormControl(""),
	});

	private formChanges: Subscription | undefined;

	@HostBinding("class.new-room-form") hostClass = true;
	constructor(public dialogRef: MatDialogRef<NewRoomFormComponent>) {}

	ngOnInit(): void {
		this.formChanges = this.formGroup.valueChanges.subscribe((value) => {
			if (value.isPrivate) {
				this.formGroup.get("roomPassword")?.setValidators([Validators.required]);
			} else {
				this.formGroup.get("roomPassword")?.setValidators([]);
			}
		});
	}

	ngOnDestroy(): void {
		this.formChanges?.unsubscribe();
	}

	onSubmit(): void {
		if (this.formGroup.valid) {
			this.dialogRef.close(this.formGroup.value);
			this.formGroup.reset();
		}
	}
}
