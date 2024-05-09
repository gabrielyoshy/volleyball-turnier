import { Component, computed, inject } from '@angular/core';
import { Firestore, deleteDoc, doc } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentState } from '../../../store/tournament.store';

@Component({
  selector: 'app-general-data',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './general-data.component.html',
  styleUrl: './general-data.component.scss',
})
export class GeneralDataComponent {
  store = inject(TournamentState);
  router = inject(Router);
  firestore: Firestore = inject(Firestore);

  tournament = computed(() => this.store.selectedTournament());
  tournamentTypes = ['swiss', 'playoffs', 'combined'];
  selectedTypeIndex = 0;
  numberOfRounds = 5;

  async deleteTournament() {
    const tournamentId = this.store.selectedTournament()?.id;
    if (!tournamentId) {
      return;
    }

    await deleteDoc(doc(this.firestore, 'tournaments', tournamentId));
    this.router.navigate(['tournaments', 'list']);
  }

  changeTypeToLeft() {
    if (this.selectedTypeIndex > 0) {
      this.selectedTypeIndex--;
    } else {
      this.selectedTypeIndex = this.tournamentTypes.length - 1;
    }
  }

  changeTypeToRight() {
    if (this.selectedTypeIndex < this.tournamentTypes.length - 1) {
      this.selectedTypeIndex++;
    } else {
      this.selectedTypeIndex = 0;
    }
  }

  removeRound() {
    if (this.numberOfRounds > 1) {
      this.numberOfRounds--;
    }
  }

  addRound() {
    if (this.numberOfRounds < 20) {
      this.numberOfRounds++;
    }
  }
}
