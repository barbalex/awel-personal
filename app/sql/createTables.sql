drop table if exists person;
create table person (
  id integer primary key autoincrement,
  name text,
  vorname text,
  kurzzeichen text,
  telefon_nr text,
  telefon_nr_mobile text,
  buero_nr text,
  org_einheit text,
  kostenstelle text,
  vorgesetzt_id integer references person(id) on update cascade on delete set null,
  eintritt_datum text,
  austritt_datum text,
)