import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '../../../store/tournament.store';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamComponent } from './add-team/add-team.component';
import { getAuth } from 'firebase/auth';
import { Team } from '../../interfaces';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  store = inject(Store);
  dialog = inject(MatDialog);
  auth = getAuth();

  addNewTeam() {
    this.dialog.open(AddTeamComponent);
  }

  deleteTeam(teamId: string) {
    this.store.deleteTeam(teamId);
  }

  changeStatus(team: Team) {
    this.store.changePresentStatus(team.id, !team.present);
  }
}
