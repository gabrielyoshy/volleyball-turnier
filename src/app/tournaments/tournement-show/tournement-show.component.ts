import { Component, inject } from '@angular/core';
import {
  Firestore,
  doc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
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
export class TournementShowComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);
  store = inject(Store);

  loading = true;

  async ngOnInit() {
    const tournamentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!tournamentId) {
      this.loading = false;
      throw new Error('No tournament selected');
    }

    const docRef = doc(this.firestore, 'tournaments', tournamentId);
    const tournament = (await getDoc(docRef)).data() as Tournament | undefined;

    if (tournament) {
      this.store.selectTournament({ ...tournament, id: tournamentId });
      this.loading = false;
    }
  }
}
