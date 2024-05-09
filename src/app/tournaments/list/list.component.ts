import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Tournament } from '../interfaces';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    CommonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  router = inject(Router);
  firestore: Firestore = inject(Firestore);
  tournaments$: Observable<Tournament[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'tournaments');
    this.tournaments$ = collectionData(aCollection, {
      idField: 'id',
    }) as Observable<Tournament[]>;

    this.tournaments$.subscribe(tournaments => {
      console.log(tournaments);
    });
  }

  createNewTournament() {
    this.router.navigate(['tournaments', 'add']);
  }

  showTournament(tournament: Tournament) {
    //navigate to the show page with parameter
    this.router.navigate(['tournaments', 'show', tournament.id]);
  }
}
