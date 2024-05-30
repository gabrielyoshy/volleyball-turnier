import {
  signalStore,
  withMethods,
  withState,
  patchState,
  withComputed,
} from '@ngrx/signals';
import {
  Match,
  RoundStatus,
  Team,
  Tournament,
  TournamentType,
} from '../tournaments/interfaces';
import { Router } from '@angular/router';
import { computed, inject } from '@angular/core';
import {
  Firestore,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';

const initialState: Tournament = {
  id: '',
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  location: '',
  startTime: '',
  teams: [],
  type: TournamentType.Swiss,
  rounds: [],
  numberOffPlayOffs: 0,
  ribbonTournamentNumber: 1,
  numberOfAvailableFields: 1,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ teams, rounds }) => ({
    numberOfTeams: computed(() => teams().length),
    numberOfRounds: computed(() => rounds().length),
  })),
  withMethods((store, firestore = inject(Firestore)) => ({
    selectTournament: (tournament: Tournament) => {
      patchState(store, tournament);
    },

    deleteTournament: async () => {
      const tournamentId = store.id();
      if (!tournamentId) {
        return;
      }
      await deleteDoc(doc(firestore, 'tournaments', tournamentId));
      inject(Router).navigate(['tournaments', 'list']);
    },

    addNewTeam: async (teamName: string) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const newTeam = {
        id: Math.random().toString(36).substring(2, 15),
        name: teamName,
        players: [],
        points: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDrawn: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
      await updateDoc(tournamentDocRef, {
        teams: arrayUnion(newTeam),
      });
      const teams = [...store.teams(), newTeam];
      patchState(store, {
        teams,
      });
    },

    deleteTeam: async (teamId: string) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const teams = store.teams().filter(team => team.id !== teamId);
      await updateDoc(tournamentDocRef, {
        teams,
      });
      patchState(store, {
        teams,
      });
    },

    addNewRound: async () => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const round = {
        id: Math.random().toString(36).substring(2, 15),
        number: store.rounds().length + 1,
        matches: [],
        status: RoundStatus.NotStarted,
      };
      const rounds = [...store.rounds(), round];
      await updateDoc(tournamentDocRef, {
        rounds,
      });
      patchState(store, {
        rounds,
      });
    },

    deletelastRound: async () => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const rounds = store.rounds().slice(0, -1);
      await updateDoc(tournamentDocRef, {
        rounds,
      });
      patchState(store, {
        rounds,
      });
    },

    startRound: async (roundId: string, matches: Match[]) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const rounds = store.rounds().map(round => {
        if (round.id === roundId) {
          return {
            ...round,
            matches,
            status: RoundStatus.InProgress,
          };
        }
        return round;
      });
      await updateDoc(tournamentDocRef, {
        rounds,
      });
      patchState(store, {
        rounds,
      });
    },

    setTournamentType: async (type: TournamentType) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      await updateDoc(tournamentDocRef, {
        type,
      });
      patchState(store, {
        type,
      });
    },

    setNumberOfPlayOffs: async (numberOffPlayOffs: number) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      await updateDoc(tournamentDocRef, {
        numberOffPlayOffs,
      });
      patchState(store, {
        numberOffPlayOffs,
      });
    },

    setNumberOfRibbonTournament: async (ribbonTournamentNumber: number) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      await updateDoc(tournamentDocRef, {
        ribbonTournamentNumber,
      });
      patchState(store, {
        ribbonTournamentNumber,
      });
    },

    setNumberOfAvailableFields: async (numberOfAvailableFields: number) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      await updateDoc(tournamentDocRef, {
        numberOfAvailableFields,
      });
      patchState(store, {
        numberOfAvailableFields,
      });
    },

    changeMatchResult: async (match: Match, score1: number, score2: number) => {
      const tournamentDocRef = doc(firestore, 'tournaments', store.id());
      const rounds = store.rounds().map(round => {
        const matches = round.matches.map(m => {
          if (m.id === match.id) {
            if (score1 === score2) {
              return {
                ...m,
                score1,
                score2,
                winnerIds: ['draw'],
                loserIds: ['draw'],
              };
            }

            return {
              ...m,
              score1,
              score2,
              winnerIds: score1 > score2 ? m.team1Ids : m.team2Ids,
              loserIds: score1 > score2 ? m.team2Ids : m.team1Ids,
            };
          }
          return m;
        });
        return {
          ...round,
          matches,
        };
      });
      await updateDoc(tournamentDocRef, {
        rounds,
      });

      console.log('rounds', rounds);

      const teams = store.teams().map(team => {
        const matches = store
          .rounds()
          .flatMap(r => r.matches)
          .filter(
            m => m.team1Ids.includes(team.id) || m.team2Ids.includes(team.id)
          );
        const gamesPlayed = matches.length;
        const gamesWon = matches.filter(m =>
          m.winnerIds.includes(team.id)
        ).length;
        const gamesLost = matches.filter(m =>
          m.loserIds.includes(team.id)
        ).length;
        const gamesDrawn = matches.filter(m =>
          m.winnerIds.includes('draw')
        ).length;
        const goalsFor = matches
          .filter(m => m.team1Ids.includes(team.id))
          .reduce((acc, m) => acc + m.score1, 0);
        const goalsAgainst = matches
          .filter(m => m.team1Ids.includes(team.id))
          .reduce((acc, m) => acc + m.score2, 0);
        return {
          ...team,
          gamesPlayed,
          gamesWon,
          gamesLost,
          gamesDrawn,
          goalsFor,
          goalsAgainst,
        };
      });

      await updateDoc(tournamentDocRef, {
        teams,
        rounds,
      });
    },
  }))
);
