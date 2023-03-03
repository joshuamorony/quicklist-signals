import { Route } from "@angular/router";

export const routes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component')
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
]
