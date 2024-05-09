import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { Tournament } from '../tournaments/interfaces';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
} from '@angular/fire/firestore';

type TournamentState = {
  selectedTournament: Tournament | null;
};

const initialState: TournamentState = {
  selectedTournament: null,
};

export const TournamentState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, firestore = inject(Firestore)) => ({
    selectTournament: (tournament: Tournament) => {
      patchState(store, { selectedTournament: tournament });
    },

    addNewTeam: async (teamName: string) => {
      const tournament = store.selectedTournament();
      if (!tournament) {
        throw new Error('No tournament selected');
      }

      console.log('Adding new team', teamName);

      const teamsCollectionRef = collection(
        firestore,
        'tournaments',
        tournament.id,
        'teams'
      );

      const teamRef = await addDoc(teamsCollectionRef, {
        name: teamName,
        players: [],
      });

      patchState(store, {
        selectedTournament: {
          ...tournament,
          teams: [
            ...(tournament.teams || []),
            { id: teamRef.id, name: teamName, players: [] },
          ],
        },
      });
    },

    deleteTeam: async (teamId: string) => {
      const tournament = store.selectedTournament();
      if (!tournament) {
        throw new Error('No tournament selected');
      }

      console.log('############# Deleting team', teamId);

      const teams = (tournament.teams || []).filter(team => team.id !== teamId);

      const teamDocRef = doc(
        firestore,
        'tournaments',
        tournament.id,
        'teams',
        teamId
      );
      await deleteDoc(teamDocRef);

      patchState(store, {
        selectedTournament: {
          ...tournament,
          teams,
        },
      });
    },
  }))
);
