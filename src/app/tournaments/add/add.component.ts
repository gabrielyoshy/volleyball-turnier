import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddComponent {
  formBuilder = inject(FormBuilder);
  firestore: Firestore = inject(Firestore);
  router = inject(Router);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    location: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
  });

  async save() {
    if (this.form.valid) {
      await addDoc(collection(this.firestore, 'tournaments'), {
        name: this.form.value.name,
        startDate: this.form.value.startDate?.toString(),
        endDate: this.form.value.endDate?.toString(),
        location: this.form.value.location,
        startTime: this.form.value.startTime,
      });

      this.router.navigate(['/tournaments']);
    }
  }
}
