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
}

export enum RoundStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Finished = 'finished',
}

export interface Round {
  id: string;
  number: number;
  matches: Match[];
  status: RoundStatus;
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  winnerId: string;
  loserId: string;
}

export interface Team {
  id: string;
  name: string;
  points: number;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  birthdate: Date;
}
