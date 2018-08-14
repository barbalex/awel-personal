drop table if exists person;
create table person (
  id integer primary key,
  deleted integer default 0,
  name text,
  vorname text,
  kurzzeichen text,
  telefonNr text,
  telefonNrMobile text,
  bueroNr text,
  abteilung text references abteilungWerte(abteilung) on update cascade on delete no action,
  kostenstelle text,
  vorgesetztId integer references person(id) on update cascade on delete restrict,
  eintrittDatum text,
  austrittDatum text,
  status text references statusWerte(status) on update cascade on delete no action,
  bemerkungen text
);

-------------------------------------------

drop table if exists links;
create table links (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  url text,
  bemerkungen text
);

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

-------------------------------------------

-- wird auch für badges benutzt
drop table if exists mobileAbo;
create table mobileAbo (
  id integer primary key,
  deleted integer default 0,
  idPerson integer references person(id) on update cascade on delete cascade,
  typ text references mobileAboTypWerte(typ) on update cascade on delete no action,
  kostenstelle text references mobileAboKostenstelleWerte(kostenstelle) on update cascade on delete no action,
  bemerkungen text
);

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists statusWerte;
create table statusWerte (
  status text primary key,
  deleted integer default 0,
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
  deleted integer default 0,
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
  abteilungWerte(abteilung, sort)
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
  kostenstelle text unique,
  deleted integer default 0,
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
  kostenstelleWerte(kostenstelle, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboTypWerte;
create table mobileAboTypWerte (
  typ text unique,
  deleted integer default 0,
  historisch integer default 0,
  sort integer
);

drop index if exists iMobileAboTypWerteMobileAboTyp;
create index iMobileAboTypWerteMobileAboTyp on mobileAboTypWerte (typ);
drop index if exists iMobileAboTypWerteHistorisch;
create index iMobileAboTypWerteHistorisch on mobileAboTypWerte (historisch);
drop index if exists iMobileAboTypWerteSort;
create index iMobileAboTypWerteSort on mobileAboTypWerte (sort);

insert into
  mobileAboTypWerte(mobileAboTyp, sort)
values
  ('', 0),
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboKostenstelleWerte;
create table mobileAboKostenstelleWerte (
  kostenstelle text unique,
  deleted integer default 0,
  historisch integer default 0,
  sort integer
);

drop index if exists iMobileAboKostenstelleWerteMobileAboKostenstelle;
create index iMobileAboKostenstelleWerteMobileAboKostenstelle on mobileAboKostenstelleWerte (kostenstelle);
drop index if exists iMobileAboKostenstelleWerteHistorisch;
create index iMobileAboKostenstelleWerteHistorisch on mobileAboKostenstelleWerte (historisch);
drop index if exists iMobileAboKostenstelleWerteSort;
create index iMobileAboKostenstelleWerteSort on mobileAboKostenstelleWerte (sort);

insert into
  mobileAboKostenstelleWerte(mobileAboKostenstelle, sort)
values
  ('', 0),
  ('TODO', 1);