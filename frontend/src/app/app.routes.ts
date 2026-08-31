import { Routes } from '@angular/router';
import { StorageUnitsComponent } from './pages/storage-units/storage-units.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'storage-units' },
  {
    path: 'storage-units',
    component: StorageUnitsComponent,
    title: 'Storage units · Inventory',
  },
  { path: '**', redirectTo: 'storage-units' },
];
