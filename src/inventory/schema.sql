CREATE TABLE IF NOT EXISTS storage_units(
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL UNIQUE,
  capacity  REAL    NOT NULL CHECK (capacity > 0)
);

CREATE TABLE IF NOT EXISTS movies(
  id                INTEGER PRIMARY KEY,
  title             TEXT NOT NULL,
  year              INTEGER,
  storage_unit_id   INTEGER NOT NULL,

  FOREIGN KEY (storage_unit_id) REFERENCES storage_units(id)
);

CREATE INDEX IF NOT EXISTS id_movies_storage_unit ON movies(storage_unit_id);

CREATE TABLE IF NOT EXISTS series(
  id                INTEGER PRIMARY KEY,
  title             TEXT NOT NULL,
  year              INTEGER,
  storage_unit_id   INTEGER NOT NULL,

  FOREIGN KEY (storage_unit_id) REFERENCES storage_units(id)
);

CREATE INDEX IF NOT EXISTS id_series_storage_unit ON series(storage_unit_id);