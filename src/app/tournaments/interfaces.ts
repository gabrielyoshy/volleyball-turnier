export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  teams: Team[];
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
