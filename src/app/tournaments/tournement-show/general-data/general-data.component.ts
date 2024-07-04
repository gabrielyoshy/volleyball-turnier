import { Component, computed, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '../../../store/tournament.store';
import { TournamentType } from '../../interfaces';
import { getAuth } from '@angular/fire/auth';

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
  auth = getAuth();

  tournamentTypes = Object.values(TournamentType);
  selectedTypeIndex = 0;
  numberOfPlayOffsOptions = [4, 8, 16, 32];
  selectedNumberOfPlayOffsIndex = 0;
  RibbonTournamentNumberOptions = [1, 2, 3];
  selectedRibbonTournamentNumberIndex = 0;
  numberOfAvailableFieldsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumberOfAvailableFieldsIndex = 0;

  recomendedNumberOfRounds = computed(() =>
    Math.ceil(Math.log2(this.store.numberOfTeams()))
  );

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

  changePlayOffRoundsToLeft() {
    if (this.selectedNumberOfPlayOffsIndex > 0) {
      this.selectedNumberOfPlayOffsIndex--;
    } else {
      this.selectedNumberOfPlayOffsIndex =
        this.numberOfPlayOffsOptions.length - 1;
    }
    this.store.setNumberOfPlayOffs(
      this.numberOfPlayOffsOptions[this.selectedNumberOfPlayOffsIndex]
    );
  }

  changePlayOffRoundsToRight() {
    if (
      this.selectedNumberOfPlayOffsIndex <
      this.numberOfPlayOffsOptions.length - 1
    ) {
      this.selectedNumberOfPlayOffsIndex++;
    } else {
      this.selectedNumberOfPlayOffsIndex = 0;
    }
    this.store.setNumberOfPlayOffs(
      this.numberOfPlayOffsOptions[this.selectedNumberOfPlayOffsIndex]
    );
  }

  changeRibbonTournamentNumberToLeft() {
    if (this.selectedRibbonTournamentNumberIndex > 0) {
      this.selectedRibbonTournamentNumberIndex--;
    } else {
      this.selectedRibbonTournamentNumberIndex =
        this.RibbonTournamentNumberOptions.length - 1;
    }
    this.store.setNumberOfRibbonTournament(
      this.RibbonTournamentNumberOptions[
        this.selectedRibbonTournamentNumberIndex
      ]
    );
  }

  changeRibbonTournamentNumberToRight() {
    if (
      this.selectedRibbonTournamentNumberIndex <
      this.RibbonTournamentNumberOptions.length - 1
    ) {
      this.selectedRibbonTournamentNumberIndex++;
    } else {
      this.selectedRibbonTournamentNumberIndex = 0;
    }
    this.store.setNumberOfRibbonTournament(
      this.RibbonTournamentNumberOptions[
        this.selectedRibbonTournamentNumberIndex
      ]
    );
  }

  changeNumberOfAvailableFieldsToLeft() {
    if (this.selectedNumberOfAvailableFieldsIndex > 0) {
      this.selectedNumberOfAvailableFieldsIndex--;
    } else {
      this.selectedNumberOfAvailableFieldsIndex =
        this.numberOfAvailableFieldsOptions.length - 1;
    }
    this.store.setNumberOfAvailableFields(
      this.numberOfAvailableFieldsOptions[
        this.selectedNumberOfAvailableFieldsIndex
      ]
    );
  }

  changeNumberOfAvailableFieldsToRight() {
    if (
      this.selectedNumberOfAvailableFieldsIndex <
      this.numberOfAvailableFieldsOptions.length - 1
    ) {
      this.selectedNumberOfAvailableFieldsIndex++;
    } else {
      this.selectedNumberOfAvailableFieldsIndex = 0;
    }
    this.store.setNumberOfAvailableFields(
      this.numberOfAvailableFieldsOptions[
        this.selectedNumberOfAvailableFieldsIndex
      ]
    );
  }
}
