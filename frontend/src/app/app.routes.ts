import { Routes } from '@angular/router';
import { MediaResourceComponent } from './pages/media-resource/media-resource.component';
import { StorageUnitsComponent } from './pages/storage-units/storage-units.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'storage-units' },
  {
    path: 'storage-units',
    component: StorageUnitsComponent,
    title: 'Storage units · Inventory',
  },
  {
    path: 'games',
    component: MediaResourceComponent,
    title: 'Games · Inventory',
    data: { kind: 'game', label: 'Games' },
  },
  {
    path: 'movies',
    component: MediaResourceComponent,
    title: 'Movies · Inventory',
    data: { kind: 'movie', label: 'Movies' },
  },
  {
    path: 'series',
    component: MediaResourceComponent,
    title: 'Series · Inventory',
    data: { kind: 'series', label: 'Series' },
  },
  { path: 'media', pathMatch: 'full', redirectTo: 'movies' },
  { path: '**', redirectTo: 'storage-units' },
];
