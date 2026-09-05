/**
 * Movies and series are separate tables in the API, but they carry the same
 * fields and the library lists them side by side, so the UI treats them as one
 * kind of thing tagged with which table it came from.
 */
export type MediaKind = 'movie' | 'series';

/** A movie or series as the API returns it. */
export interface MediaItem {
  id: number;
  kind: MediaKind;
  title: string;
  year: number | null;
  storageUnitId: number | null;
}

/** The fields a caller supplies when creating one; the API assigns the id. */
export type MediaItemCreate = Omit<MediaItem, 'id'>;

/** What the library is currently showing. */
export type MediaFilter = MediaKind | 'all';

/** The label printed for each kind. */
export const MEDIA_KIND_LABELS: Readonly<Record<MediaKind, string>> = {
  movie: 'Movie',
  series: 'Series',
};
