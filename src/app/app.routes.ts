import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tournaments',
    loadComponent: () =>
      import('./tournaments/tournaments.component').then(
        m => m.TournamentsComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./tournaments/list/list.component').then(
            m => m.ListComponent
          ),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./tournaments/add/add.component').then(m => m.AddComponent),
      },
      {
        path: 'show/:id',
        loadComponent: () =>
          import(
            './tournaments/tournement-show/tournement-show.component'
          ).then(m => m.TournementShowComponent),
      },
    ],
  },
];
