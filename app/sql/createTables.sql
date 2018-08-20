-- disable foreign keys
-- to prevent reference errors while building schema
PRAGMA foreign_keys = OFF;

-------------------------------------------

drop table if exists person;
create table person (
  id integer primary key,
  deleted integer default 0,
  name text,
  vorname text,
  kurzzeichen text,
  telefonNr text,
  telefonNrMobile text,
  email text check (email like '%_@__%.__%'),
  geburtDatum text,
  bueroNr text,
  abteilung text references abteilungWerte(value) on update cascade on delete no action,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  vorgesetztId integer references person(id) on update cascade on delete restrict,
  eintrittDatum text,
  austrittDatum text,
  status text references statusWerte(value) on update cascade on delete no action,
  parkplatzNr text,
  parkplatzBeitrag text,
  geschlecht text references geschlechtWerte(value) on update cascade on delete no action,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iPersonDeleted;
create index iPersonDeleted on person (deleted);
drop index if exists iPersonName;
create index iPersonName on person (name);
drop index if exists iPersonVorname;
create index iPersonVorname on person (vorname);

-------------------------------------------

drop table if exists link;
create table link (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  url text,
  bemerkungen text
);

drop index if exists iLinkDeleted;
create index iLinkDeleted on link (deleted);
drop index if exists iLinkIdPerson;
create index iLinkIdPerson on link (idPerson);
drop index if exists iLinkUrl;
create index iLinkUrl on link (url);

-------------------------------------------

-- wird auch für badges benutzt
drop table if exists schluessel;
create table schluessel (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  name text,
  bemerkungen text
);

drop index if exists iSchluesselDeleted;
create index iSchluesselDeleted on schluessel (deleted);
drop index if exists iSchluesselIdPerson;
create index iSchluesselIdPerson on schluessel (idPerson);
drop index if exists iSchluesselName;
create index iSchluesselName on schluessel (name);

-------------------------------------------

drop table if exists mobileAbo;
create table mobileAbo (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  typ text references mobileAboTypWerte(value) on update cascade on delete no action,
  kostenstelle text references mobileAboKostenstelleWerte(value) on update cascade on delete no action,
  bemerkungen text
);

drop index if exists iMobileAboDeleted;
create index iMobileAboDeleted on mobileAbo (deleted);
drop index if exists iMobileAboIdPerson;
create index iMobileAboIdPerson on mobileAbo (idPerson);
drop index if exists iMobileAboTyp;
create index iMobileAboTyp on mobileAbo (typ);

-------------------------------------------

drop table if exists kaderFunktion;
create table kaderFunktion (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  funktion text references kaderFunktionWerte(value) on update cascade on delete no action,
  bemerkungen text
);

drop index if exists iKaderFunktionDeleted;
create index iKaderFunktionDeleted on kaderFunktion (deleted);
drop index if exists iKaderFunktionIdPerson;
create index iKaderFunktionIdPerson on kaderFunktion (idPerson);
drop index if exists iKaderFunktionFunktion;
create index iKaderFunktionFunktion on kaderFunktion (funktion);

-------------------------------------------

drop table if exists tag;
create table tag (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  tag text references tagWerte(value) on update cascade on delete cascade
);

drop index if exists iTagDeleted;
create index iTagDeleted on tag (deleted);
drop index if exists iTagIdPerson;
create index iTagIdPerson on tag (idPerson);
drop index if exists iTagTag;
create index iTagTag on tag (tag);

-------------------------------------------

-- first werte tables
-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists statusWerte;
create table statusWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iStatusWerteStatus;
create index iStatusWerteStatus on statusWerte (value);
drop index if exists iStatusWerteHistorisch;
create index iStatusWerteHistorisch on statusWerte (historic);
drop index if exists iStatusWerteSort;
create index iStatusWerteSort on statusWerte (sort);

insert into
  statusWerte(value, sort)
values
  ('', 0),
  ('aktiv', 1),
  ('pensioniert', 2),
  ('ehemalig', 3),
  ('extern', 4);

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists geschlechtWerte;
create table geschlechtWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iGeschlechtWerteGeschlecht;
create index iGeschlechtWerteGeschlecht on geschlechtWerte (value);
drop index if exists iGeschlechtWerteHistorisch;
create index iGeschlechtWerteHistorisch on geschlechtWerte (historic);
drop index if exists iGeschlechtWerteSort;
create index iGeschlechtWerteSort on geschlechtWerte (sort);

insert into
  geschlechtWerte(value, sort)
values
  ('', 0),
  ('m', 1),
  ('w', 2);

-------------------------------------------

drop table if exists abteilungWerte;
create table abteilungWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iAbteilungWerteAbteilung;
create index iAbteilungWerteAbteilung on abteilungWerte (value);
drop index if exists iAbteilungWerteHistorisch;
create index iAbteilungWerteHistorisch on abteilungWerte (historic);
drop index if exists iAbteilungWerteSort;
create index iAbteilungWerteSort on abteilungWerte (sort);

insert into
  abteilungWerte(value, sort)
values
  ('', 0),
  ('aw', 1),
  ('di', 2),
  ('en', 3),
  ('gs', 4),
  ('lu', 5),
  ('re', 6),
  ('wb', 7);

-------------------------------------------

drop table if exists kostenstelleWerte;
create table kostenstelleWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iKostenstelleWerteKostenstelle;
create index iKostenstelleWerteKostenstelle on kostenstelleWerte (value);
drop index if exists iKostenstelleWerteHistorisch;
create index iKostenstelleWerteHistorisch on kostenstelleWerte (historic);
drop index if exists iKostenstelleWerteSort;
create index iKostenstelleWerteSort on kostenstelleWerte (sort);

insert into
  kostenstelleWerte(value, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboTypWerte;
create table mobileAboTypWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iMobileAboTypWerteMobileAboTyp;
create index iMobileAboTypWerteMobileAboTyp on mobileAboTypWerte (value);
drop index if exists iMobileAboTypWerteHistorisch;
create index iMobileAboTypWerteHistorisch on mobileAboTypWerte (historic);
drop index if exists iMobileAboTypWerteSort;
create index iMobileAboTypWerteSort on mobileAboTypWerte (sort);

insert into
  mobileAboTypWerte(value, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists kaderFunktionWerte;
create table kaderFunktionWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iKaderFunktionWerteKaderFunktion;
create index iKaderFunktionWerteKaderFunktion on kaderFunktionWerte (value);
drop index if exists iKaderFunktionWerteHistorisch;
create index iKaderFunktionWerteHistorisch on kaderFunktionWerte (historic);
drop index if exists iKaderFunktionWerteSort;
create index iKaderFunktionWerteSort on kaderFunktionWerte (sort);

insert into
  kaderFunktionWerte(value, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboKostenstelleWerte;
create table mobileAboKostenstelleWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iMobileAboKostenstelleWerteMobileAboKostenstelle;
create index iMobileAboKostenstelleWerteMobileAboKostenstelle on mobileAboKostenstelleWerte (value);
drop index if exists iMobileAboKostenstelleWerteHistorisch;
create index iMobileAboKostenstelleWerteHistorisch on mobileAboKostenstelleWerte (historic);
drop index if exists iMobileAboKostenstelleWerteSort;
create index iMobileAboKostenstelleWerteSort on mobileAboKostenstelleWerte (sort);

insert into
  mobileAboKostenstelleWerte(value, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists tagWerte;
create table tagWerte (
  id integer primary key,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer
);

drop index if exists iTagWerteTag;
create index iTagWerteTag on tagWerte (value);
drop index if exists iTagWerteHistorisch;
create index iTagWerteHistorisch on tagWerte (historic);
drop index if exists iTagWerteSort;
create index iTagWerteSort on tagWerte (sort);

insert into
  tagWerte(value, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

insert into
  person(name, vorname)
values
  ('Tester', 'Test'),
  ('Tester_2', 'Test_2');


PRAGMA foreign_keys = ON;