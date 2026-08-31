import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageUnit, StorageUnitCreate } from '../models/storage-unit';

/**
 * Talks to the storage units API. Its only job is the transport: it holds no
 * state and makes no decisions about what the UI does with the results.
 */
@Injectable({ providedIn: 'root' })
export class StorageUnitsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/storage_units/';

  list(): Observable<StorageUnit[]> {
    return this.http.get<StorageUnit[]>(this.endpoint);
  }

  create(unit: StorageUnitCreate): Observable<StorageUnit> {
    return this.http.post<StorageUnit>(this.endpoint, unit);
  }
}
