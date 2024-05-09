import { Component, OnInit, inject } from '@angular/core';
import {
  Firestore,
  getDoc,
  DocumentReference,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from '../interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tournement-show',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './tournement-show.component.html',
  styleUrl: './tournement-show.component.scss',
})
export class TournementShowComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);
  id = this.activatedRoute.snapshot.paramMap.get('id');

  tournament?: Tournament;

  async ngOnInit() {
    if (!this.id) {
      return;
    }
    const docRef = doc(this.firestore, 'tournaments', this.id);
    this.tournament = (await getDoc(docRef)).data() as Tournament | undefined;
  }

  async deleteTournament() {
    if (!this.id) {
      return;
    }

    await deleteDoc(doc(this.firestore, 'tournaments', this.id));
    this.router.navigate(['tournaments', 'list']);
  }
}
