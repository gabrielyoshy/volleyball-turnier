import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '../../../store/tournament.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Match, RoundStatus, TournamentType } from '../../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { EditResultComponent } from './edit-result/edit-result.component';
import { CommonModule } from '@angular/common';
import { getAuth } from '@angular/fire/auth';
import { EditTimesComponent } from './edit-times/edit-result.component';
import { MatchComponent } from './match/match.component';

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatchComponent,
  ],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent {
  store = inject(Store);
  dialog = inject(MatDialog);
  selectedRoundIndex = signal(0);
  auth = getAuth();
  selectedRound = computed(() => {
    const rounds = this.store.rounds();
    const selectedRoundIndex = this.selectedRoundIndex();
    if (rounds.length > 0) {
      const teams = this.store.teams();

      return {
        ...rounds[selectedRoundIndex],
        matches: rounds[selectedRoundIndex].matches.map(match => {
          const teams1 = teams.filter(team => match.team1Ids.includes(team.id));
          const teams2 = teams.filter(team => match.team2Ids.includes(team.id));
          const referee = teams.find(team => team.id === match.refereeId);

          return { ...match, teams1, teams2, referee };
        }),
      };
    }
    return null;
  });

  changeRoundToLeft() {
    this.selectedRoundIndex.update(index => {
      if (index > 0) {
        return index - 1;
      }
      return index;
    });
  }

  changeRoundToRight() {
    this.selectedRoundIndex.update(index => {
      if (index < this.store.rounds().length - 1) {
        return index + 1;
      }
      return index;
    });
  }

  startRound() {
    console.log('startRound');
    const round = this.selectedRound();
    if (!round) {
      return;
    }

    if (this.store.type() === TournamentType.Swiss) {
      //sort first Points, then games, then goals
      const sortedTeams = this.store.teamsSortedByPoints();

      const availableFields = this.store.numberOfAvailableFields();
      const matches: Match[] = [];
      const numberOfTeamsInMatch = this.store.ribbonTournamentNumber();
      const durationInMinutes = new Date(Number(round.duration)).getMinutes();
      const pauseInMinutes = new Date(Number(round.pause)).getMinutes();
      let startTime = new Date(Number(round.start));

      for (let i = 0; i < sortedTeams.length; i += numberOfTeamsInMatch * 2) {
        const team1Ids = [];
        const team2Ids = [];
        const fieldNumber = (matches.length % availableFields) + 1;

        for (let j = 0; j < numberOfTeamsInMatch; j++) {
          if (i + j < sortedTeams.length) {
            team1Ids.push(sortedTeams[i + j].id);
          }
          if (i + j + numberOfTeamsInMatch < sortedTeams.length) {
            team2Ids.push(sortedTeams[i + j + numberOfTeamsInMatch].id);
          }
        }
        matches.push({
          id: Math.random().toString(),
          fieldNumber: fieldNumber,
          start: startTime.toString(),
          team1Ids,
          team2Ids,
          score1: 0,
          score2: 0,
          winnerIds: [],
          loserIds: [],
          refereeId: '',
        });

        if (fieldNumber === availableFields) {
          startTime = new Date(
            startTime.getTime() +
              durationInMinutes * 60000 +
              pauseInMinutes * 60000
          );
        }
      }
      const teams = this.store.teams();

      matches.forEach(match => {
        const matchesSameTime = matches.filter(m => m.start === match.start);

        const availableReferees = teams
          .filter(team =>
            matchesSameTime.every(
              m =>
                !m.team1Ids.includes(team.id) && !m.team2Ids.includes(team.id)
            )
          )
          .sort((a, b) => a.numberOfReferees - b.numberOfReferees);

        match.refereeId = availableReferees[0].id;

        const referee = teams.find(team => team.id === match.refereeId);
        if (match.refereeId && referee) {
          referee.numberOfReferees++;
          this.store.incrementRefereeCount(match.refereeId);
        }
      });

      const roundId = round.id;
      this.store.startRound(roundId, matches);
    }
  }

  changeResult(match: Match) {
    if (!this.auth.currentUser) {
      return;
    }

    this.dialog.open(EditResultComponent, {
      data: match,
    });
  }

  changeTimes() {
    const round = this.selectedRound();
    if (!round || !this.auth.currentUser) {
      return;
    }

    const dialogObs$ = this.dialog.open(EditTimesComponent, {
      data: round,
    });

    dialogObs$.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.startRound();
      }
    });
  }

  print() {
    window.print();
  }
}
