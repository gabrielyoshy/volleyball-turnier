import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '../../../store/tournament.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Match, RoundStatus, TournamentType } from '../../interfaces';

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent {
  store = inject(Store);
  selectedRoundIndex = signal(0);
  selectedRound = computed(() => {
    const rounds = this.store.rounds();
    const selectedRoundIndex = this.selectedRoundIndex();
    if (rounds.length > 0) {
      const teams = this.store.teams();

      return {
        ...rounds[selectedRoundIndex],
        matches: rounds[selectedRoundIndex].matches.map(match => {
          const team1 = teams.find(team => team.id === match.team1Id);
          const team2 = teams.find(team => team.id === match.team2Id);
          return { ...match, team1, team2 };
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
      const sortedTeams = this.store
        .teams()
        .sort((a, b) => b.points - a.points);

      const matches: Match[] = [];

      for (let i = 0; i < sortedTeams.length; i += 2) {
        if (i + 1 >= sortedTeams.length) {
          matches.push({
            id: `${sortedTeams[i].id}-bye`,
            team1Id: sortedTeams[i].id,
            team2Id: 'bye',
            score1: 1,
            score2: 0,
            winnerId: sortedTeams[i].id,
            loserId: 'bye',
          });
        } else {
          matches.push({
            id: `${sortedTeams[i].id}-${sortedTeams[i + 1].id}`,
            team1Id: sortedTeams[i].id,
            team2Id: sortedTeams[i + 1].id,
            score1: 0,
            score2: 0,
            winnerId: 'not-played',
            loserId: 'not-played',
          });
        }
      }

      const roundId = round.id;
      this.store.startRound(roundId, matches);
    }
  }
}
