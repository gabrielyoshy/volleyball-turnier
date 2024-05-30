import { Component, Inject, computed, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Match } from '../../../interfaces';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../../../store/tournament.store';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-result',
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
  templateUrl: './edit-result.component.html',
  styleUrl: './edit-result.component.scss',
})
export class EditResultComponent {
  store = inject(Store);
  formBuilder = new FormBuilder().nonNullable;
  teams1 = computed(() => {
    const teams = this.store.teams();
    return teams.filter(team => this.data.team1Ids.includes(team.id));
  });
  teams2 = computed(() => {
    const teams = this.store.teams();
    return teams.filter(team => this.data.team2Ids.includes(team.id));
  });

  form = this.formBuilder.group({
    team1Score: [5, [Validators.required, Validators.min(0)]],
    team2Score: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private dialogRef: MatDialogRef<EditResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Match
  ) {}

  save() {
    this.store.changeMatchResult(
      this.data,
      Number(this.form.controls.team1Score.value),
      Number(this.form.controls.team2Score.value)
    );

    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
