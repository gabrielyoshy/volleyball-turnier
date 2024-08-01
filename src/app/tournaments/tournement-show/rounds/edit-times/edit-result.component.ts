import { Component, Inject, computed, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Round } from '../../../interfaces';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../../../store/tournament.store';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-times',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-times.component.html',
  styleUrl: './edit-times.component.scss',
})
export class EditTimesComponent {
  store = inject(Store);
  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    start: [this.getMinutesFormatted(this.round.start), [Validators.required]],
    pause: [this.getMinutesFormatted(this.round.pause), [Validators.required]],
    duration: [
      this.getMinutesFormatted(this.round.duration),
      [Validators.required],
    ],
  });

  constructor(
    private dialogRef: MatDialogRef<EditTimesComponent>,
    @Inject(MAT_DIALOG_DATA) public round: Round
  ) {}

  save() {
    const splettedStart = this.form.value.start!.split(':');
    const splettedPause = this.form.value.pause!.split(':');
    const splettedDuration = this.form.value.duration!.split(':');

    const dateStart = new Date().setHours(
      Number(splettedStart[0]),
      Number(splettedStart[1])
    );

    const datePause = new Date().setHours(
      Number(splettedPause[0]),
      Number(splettedPause[1])
    );

    const dateDuration = new Date().setHours(
      Number(splettedDuration[0]),
      Number(splettedDuration[1])
    );

    this.store.updateTime(
      this.round.id,
      dateStart.toString() || '',
      datePause.toString() || '',
      dateDuration.toString() || ''
    );

    this.dialogRef.close({ result: true });
  }

  close() {
    this.dialogRef.close();
  }

  getMinutesFormatted(dateString: String) {
    const date = new Date(Number(dateString));

    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
