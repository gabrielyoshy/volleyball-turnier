import { Component, inject } from '@angular/core';
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

  async deleteTournament() {
    const tournamentId = this.store.selectedTournament()?.id;
    if (!tournamentId) {
      return;
    }

    await deleteDoc(doc(this.firestore, 'tournaments', tournamentId));
    this.router.navigate(['tournaments', 'list']);
  }
}
