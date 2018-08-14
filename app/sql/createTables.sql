drop table if exists person;
create table person (
  id integer primary key,
  name text,
  vorname text,
  kurzzeichen text,
  telefonnr text,
  telefonnrmobile text,
  bueronr text,
  abteilung text references abteilungWerte(abteilung) on update cascade on delete set null,
  kostenstelle text,
  vorgesetztid integer references person(id) on update cascade on delete set null,
  eintrittdatum text,
  austrittdatum text,
  status text references statuswerte(status) on update cascade on delete restrict,
);

-------------------------------------------

drop table if exists links;
create table links (
  id integer primary key,
  idPerson integer references geschaefte(id) on update cascade on delete cascade,
  url text,
  bemerkungen text
);

-------------------------------------------

-- wird auch für badges benutzt
drop table if exists schluessel;
create table schluessel (
  id integer primary key,
  idPerson integer references geschaefte(id) on update cascade on delete cascade,
  name text,
  bemerkungen text
);

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists statusWerte;
create table statusWerte (
  status text primary key,
  historisch integer default 0,
  sort integer
);

drop index if exists iStatusWerteStatus;
create index iStatusWerteStatus on statusWerte (status);
drop index if exists iStatusWerteHistorisch;
create index iStatusWerteHistorisch on statusWerte (historisch);
drop index if exists iStatusWerteSort;
create index iStatusWerteSort on statusWerte (sort);

-------------------------------------------

drop table if exists abteilungWerte;
create table abteilungWerte (
  abteilung text primary key,
  historisch integer default 0,
  sort integer
);

drop index if exists iAbteilungWerteAbteilung;
create index iAbteilungWerteAbteilung on abteilungWerte (abteilung);
drop index if exists iAbteilungWerteHistorisch;
create index iAbteilungWerteHistorisch on abteilungWerte (historisch);
drop index if exists iAbteilungWerteSort;
create index iAbteilungWerteSort on abteilungWerte (sort);

insert into
  abteilungWerte(abteilung, historisch, sort)
values
  ('', 0, 0),
  ('aw', 0, 1),
  ('di', 0, 2),
  ('en', 0, 3),
  ('gs', 0, 4),
  ('lu', 0, 5),
  ('re', 0, 6),
  ('wb', 0, 7);

-------------------------------------------

drop table if exists kostenstelleWerte;
create table kostenstelleWerte (
  kostenstelle text unique,
  historisch integer default 0,
  sort integer
);

drop index if exists iKostenstelleWerteKostenstelle;
create index iKostenstelleWerteKostenstelle on kostenstelleWerte (kostenstelle);
drop index if exists iKostenstelleWerteHistorisch;
create index iKostenstelleWerteHistorisch on kostenstelleWerte (historisch);
drop index if exists iKostenstelleWerteSort;
create index iKostenstelleWerteSort on kostenstelleWerte (sort);

insert into
  kostenstelleWerte(kostenstelle, historisch, sort)
values
  ('', 0, 0),
  ('TODO', 0, 1);