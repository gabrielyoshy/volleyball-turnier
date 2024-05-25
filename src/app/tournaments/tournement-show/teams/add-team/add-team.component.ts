import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Store } from '../../../../store/tournament.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-team',
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
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss',
})
export class AddTeamComponent {
  store = inject(Store);
  nameControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<AddTeamComponent>) {}

  addTeam() {
    if (this.nameControl.value) {
      this.store.addNewTeam(this.nameControl.value);
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
