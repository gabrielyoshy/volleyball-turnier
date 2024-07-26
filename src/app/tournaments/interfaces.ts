export enum TournamentType {
  Swiss = 'swiss',
  Playoffs = 'playoffs',
  Combined = 'combined',
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  startTime: string;
  teams: Team[];
  type: TournamentType;
  rounds: Round[];
  numberOffPlayOffs: number;
  ribbonTournamentNumber: number;
  numberOfAvailableFields: number;
}

export enum RoundStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Finished = 'finished',
}

export interface Round {
  id: string;
  number: number;
  start: string;
  pause: string;
  duration: string;
  matches: Match[];
  status: RoundStatus;
}

export interface Match {
  id: string;
  start: string;
  fieldNumber: number;
  team1Ids: string[];
  team2Ids: string[];
  score1: number;
  score2: number;
  winnerIds: string[];
  loserIds: string[];
  refereeId: string;
}

export interface Team {
  id: string;
  name: string;
  present: boolean;
  players: Player[];
  points: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  goalsFor: number;
  goalsAgainst: number;
  numberOfReferees: number;
}

export interface Player {
  id: string;
  name: string;
  birthdate: Date;
}
