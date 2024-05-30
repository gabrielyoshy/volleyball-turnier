import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Firestore,
  doc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  collectionData,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '../../store/tournament.store';
import { GeneralDataComponent } from './general-data/general-data.component';
import { PositionsComponent } from './positions/positions.component';
import { RoundsComponent } from './rounds/rounds.component';
import { TeamsComponent } from './teams/teams.component';
import { Team, Tournament } from '../interfaces';
import { LoadingComponent } from '../../share/loading/loading.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tournement-show',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    GeneralDataComponent,
    PositionsComponent,
    RoundsComponent,
    TeamsComponent,
    LoadingComponent,
  ],
  templateUrl: './tournement-show.component.html',
  styleUrl: './tournement-show.component.scss',
})
export class TournementShowComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);
  store = inject(Store);
  storeSub = new Subscription();

  async ngOnInit() {
    const tournamentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!tournamentId) {
      throw new Error('No tournament selected');
    }

    const aCollection = collection(this.firestore, 'tournaments');
    const tournaments$ = collectionData(aCollection, {
      idField: 'id',
    }) as Observable<Tournament[]>;

    this.storeSub.add(
      tournaments$.subscribe(tournaments => {
        if (tournamentId) {
          const tournament = tournaments.find(t => t.id === tournamentId);
          if (tournament) {
            this.store.selectTournament(tournament);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
