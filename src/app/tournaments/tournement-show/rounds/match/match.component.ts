import { Component, Input } from '@angular/core';
import { Match } from '../../../interfaces';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface ExtendedMatch extends Match {
  teams1: any[];
  teams2: any[];
  referee: any;
}

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [TranslateModule, CommonModule, MatIconModule],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss',
})
export class MatchComponent {
  @Input() match!: ExtendedMatch;
}
