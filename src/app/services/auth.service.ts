import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  email: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSignal = signal<User | null>(null);

  constructor(private afAuth: AngularFireAuth) {
    // this.afAuth.authState.subscribe(user => {
    //   // this.userSignal.set(user);
    // });
  }

  get user() {
    return this.userSignal;
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      // map(userCredential => {
      //   this.userSignal.set(userCredential.user);
      //   return userCredential.user;
      // })
      tap(userCredential => {
        console.log('userCredential', userCredential);
      })
    );
  }

  logout() {
    return from(this.afAuth.signOut()).pipe(
      map(() => {
        this.userSignal.set(null);
      })
    );
  }

  // register(email: string, password: string) {
  //   return from(
  //     this.afAuth.createUserWithEmailAndPassword(email, password)
  //   ).pipe(
  //     map(userCredential => {
  //       this.userSignal.set(userCredential.user);
  //       return userCredential.user;
  //     })
  //   );
  // }
}
