import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();

  @ViewChild(MatDrawer, { static: true }) drawer!: MatDrawer;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Bornheim Turnier');
  }

  logout() {
    this.auth.signOut();
    this.drawer.close();
  }
}
