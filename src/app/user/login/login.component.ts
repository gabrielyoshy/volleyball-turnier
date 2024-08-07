import { Component, inject } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  router = inject(Router);

  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    signInWithEmailAndPassword(
      this.auth,
      this.form.controls.email.value,
      this.form.controls.password.value
    )
      .then(userCredential => {
        this.router.navigate(['/tournaments']);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
}
