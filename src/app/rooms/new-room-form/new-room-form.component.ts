import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
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
	changeDetection: ChangeDetectionStrategy.OnPush,
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
			const formattedId = value.id?.toLowerCase().replace(" ", "-");
			if (formattedId && value.id !== formattedId) {
				this.formGroup.get("id")?.setValue(formattedId);
			}

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
