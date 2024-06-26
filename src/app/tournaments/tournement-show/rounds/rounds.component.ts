import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '../../../store/tournament.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Match, RoundStatus, TournamentType } from '../../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { EditResultComponent } from './edit-result/edit-result.component';

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent {
  store = inject(Store);
  dialog = inject(MatDialog);
  selectedRoundIndex = signal(0);
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

          return { ...match, teams1, teams2 };
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
    const round = this.selectedRound();
    if (!round) {
      return;
    }

    if (this.store.type() === TournamentType.Swiss) {
      //sort first Points, then games, then goals
      const sortedTeams = this.store
        .teams()
        .sort((a, b) => b.points - a.points)
        .sort((a, b) => b.gamesWon - a.gamesWon)
        .sort((a, b) => b.goalsFor - a.goalsFor);

      const availableFields = this.store.numberOfAvailableFields();
      const matches: Match[] = [];
      const numberOfTeamsInMatch = this.store.ribbonTournamentNumber();

      for (let i = 0; i < sortedTeams.length; i += numberOfTeamsInMatch * 2) {
        const team1Ids = [];
        const team2Ids = [];
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
          feldNumber: matches.length % availableFields,
          team1Ids,
          team2Ids,
          score1: 0,
          score2: 0,
          winnerIds: [],
          loserIds: [],
        });
      }

      const roundId = round.id;
      this.store.startRound(roundId, matches);
    }
  }

  changeResult(match: Match) {
    this.dialog.open(EditResultComponent, {
      data: match,
    });
  }
}
