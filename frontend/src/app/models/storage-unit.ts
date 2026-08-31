/** A storage unit as the API returns it. */
export interface StorageUnit {
  id: number;
  name: string;
  capacity: number;
}

/** The fields a caller supplies when creating one; the API assigns the id. */
export type StorageUnitCreate = Omit<StorageUnit, 'id'>;
