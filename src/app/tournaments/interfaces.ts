export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  startTime: string;
  teams: Team[];
  type?: string;
  numberOfRounds?: string;
  rounds?: Round[];
}

export interface Round {
  id: string;
  number: number;
  matches: Match[];
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  winner: Team;
  loser: Team;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  birthdate: Date;
}
