import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { MediaItem, MediaItemCreate, MediaKind } from '../models/media-item';

/** A movie or series in the shape the API speaks: snake_case, and untagged. */
interface MediaItemDto {
  id: number;
  title: string;
  year: number | null;
  storage_unit_id: number | null;
}

/** The payload the API accepts. The id is assigned server side. */
type MediaItemCreateDto = Omit<MediaItemDto, 'id'>;

const ENDPOINTS: Readonly<Record<MediaKind, string>> = {
  movie: '/api/movies/',
  series: '/api/series/',
};

/**
 * Movies and series live behind separate endpoints and neither says which of
 * the two it is, so the kind is stamped on from the endpoint the rows came
 * from. That tag is what lets the page hold both in one list.
 */
function toMediaItem(kind: MediaKind, dto: MediaItemDto): MediaItem {
  return {
    id: dto.id,
    kind,
    title: dto.title,
    year: dto.year,
    storageUnitId: dto.storage_unit_id,
  };
}

function toDto(draft: MediaItemCreate): MediaItemCreateDto {
  return {
    title: draft.title,
    year: draft.year,
    storage_unit_id: draft.storageUnitId,
  };
}

/**
 * Talks to the movies and series APIs. Its only job is the transport: it holds
 * no state and makes no decisions about what the UI does with the results.
 */
@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  /** Every title, both kinds, in one list. */
  list(): Observable<MediaItem[]> {
    return forkJoin({
      movies: this.listOf('movie'),
      series: this.listOf('series'),
    }).pipe(map(({ movies, series }) => [...movies, ...series]));
  }

  create(draft: MediaItemCreate): Observable<MediaItem> {
    return this.http
      .post<MediaItemDto>(ENDPOINTS[draft.kind], toDto(draft))
      .pipe(map((dto) => toMediaItem(draft.kind, dto)));
  }

  private listOf(kind: MediaKind): Observable<MediaItem[]> {
    return this.http
      .get<MediaItemDto[]>(ENDPOINTS[kind])
      .pipe(map((dtos) => dtos.map((dto) => toMediaItem(kind, dto))));
  }
}
