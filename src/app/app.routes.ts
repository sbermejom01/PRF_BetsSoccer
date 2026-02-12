import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    loadComponent: () => import('./panel/panel.page').then( m => m.PanelPage)
  },
  {
    path: 'clasificacion',
    loadComponent: () => import('./clasificacion/clasificacion.page').then( m => m.ClasificacionPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.page').then( m => m.RankingPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'partido/:id',
    loadComponent: () => import('./detalle-partido/detalle-partido.page').then( m => m.DetallePartidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'equipo/:name',
    loadComponent: () => import('./detalle-equipo/detalle-equipo.page').then( m => m.DetalleEquipoPage),
    canActivate: [authGuard]
  },

];