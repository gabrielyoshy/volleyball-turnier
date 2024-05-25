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
  }))
);
