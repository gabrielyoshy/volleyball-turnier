import { Component, computed, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '../../../store/tournament.store';
import { TournamentType } from '../../interfaces';

@Component({
  selector: 'app-general-data',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss',
})
export class GeneralDataComponent {
  store = inject(Store);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);

  tournamentTypes = Object.values(TournamentType);
  selectedTypeIndex = 0;

  recomendedNumberOfRounds = computed(() =>
    Math.ceil(Math.log2(this.store.numberOfTeams()))
  );

  deleteTournament() {
    this.store.deleteTournament();
  }

  changeTypeToLeft() {
    if (this.selectedTypeIndex > 0) {
      this.selectedTypeIndex--;
    } else {
      this.selectedTypeIndex = this.tournamentTypes.length - 1;
    }
    this.store.setTournamentType(this.tournamentTypes[this.selectedTypeIndex]);
  }

  changeTypeToRight() {
    if (this.selectedTypeIndex < this.tournamentTypes.length - 1) {
      this.selectedTypeIndex++;
    } else {
      this.selectedTypeIndex = 0;
    }
    this.store.setTournamentType(this.tournamentTypes[this.selectedTypeIndex]);
  }

  removeRound() {
    const numberOfRounds = this.store.rounds().length;
    if (numberOfRounds > 0) {
      this.store.deletelastRound();
    }
  }

  addRound() {
    this.store.addNewRound();
  }
}
