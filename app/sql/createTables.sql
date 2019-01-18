-- disable foreign keys
-- to prevent reference errors while building schema
PRAGMA foreign_keys = OFF;

-------------------------------------------

drop table if exists personen;
create table personen (
  -- use autoincrement to prevent unused id's from being reused
  -- because: may be recreated when undoing deletion
  id integer primary key autoincrement,
  deleted integer default 0,
  personalNr integer,
  name text,
  vorname text,
  -- anrede nötig oder vom Geschlecht abhängig?
  --anrede text,
  anrede text references anredeWerte(value) on update cascade on delete no action,
  kurzzeichen text,
  adresse text,
  plz integer,
  ort text,
  -- land aus Liste auswählen?
  land text  references landWerte(value) on update cascade on delete no action,
  bildUrl text,
  telefonNr text,
  telefonNrMobile text,
  email text check (email like '%_@__%.__%'),
  geburtDatum text,
  bueroNr text,
  abteilung integer references abteilungen(id) on update cascade on delete restrict,
  sektion integer references sektionen(id) on update cascade on delete restrict,
  vorgesetztId integer references personen(id) on update cascade on delete restrict,
  eintrittDatum text,
  austrittDatum text,
  status text references statusWerte(value) on update cascade on delete no action,
  parkplatzNr text,
  parkplatzBeitrag text,
  bemerkungen text,
  beschaeftigungsgrad integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iPersonDeleted;
create index iPersonDeleted on personen (deleted);
drop index if exists iPersonName;
create index iPersonName on personen (name);
drop index if exists iPersonVorname;
create index iPersonVorname on personen (vorname);

-------------------------------------------

drop table if exists abteilungen;
create table abteilungen (
  id integer primary key autoincrement,
  deleted integer default 0,
  name text,
  kurzzeichen text,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  -- schluessel?,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iAbteilungDeleted;
create index iAbteilungDeleted on abteilungen (deleted);
drop index if exists iAbteilungName;
create index iAbteilungName on abteilungen (name);

insert into
  abteilungen(id, name, kurzzeichen)
values
  (1, 'Abfallwirtschaft und Betriebe', 'aw'),
  (2, 'Dienste', 'di'),
  (3, 'Energie', 'en'),
  (4, 'Gewässerschutz', 'gs'),
  (5, 'Luft', 'lu'),
  (6, 'Recht', 're'),
  (7, 'Wasserbau', 'wb');

-------------------------------------------

drop table if exists sektionen;
create table sektionen (
  id integer primary key autoincrement,
  deleted integer default 0,
  abteilung integer REFERENCES abteilungen (id) on update cascade on delete restrict,
  name text,
  kurzzeichen text,
  telefonNr text,
  email text check (email like '%_@__%.__%'),
  standort text,
  leiter integer REFERENCES personen(id) on update cascade on delete restrict,
  kostenstelle text references kostenstelleWerte(value) on update cascade on delete no action,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iSektionDeleted;
create index iSektionDeleted on sektionen (deleted);
drop index if exists iSektionName;
create index iSektionName on sektionen (name);

insert into
  sektionen(name, kurzzeichen, abteilung)
values
  ('Abfallwirtschaft', '', 1), -- Abfallwirtschaft und Betriebe
  ('Altlasten', '', 1), -- Abfallwirtschaft und Betriebe
  ('Betrieblicher Umweltschutz und Störfallvorsorge', '', 1), -- Abfallwirtschaft und Betriebe
  ('Biosicherheit', '', 1), -- Abfallwirtschaft und Betriebe
  ('Tankanlagen und Transportgewerbe', '', 1), -- Abfallwirtschaft und Betriebe
  ('Finanz und Rechnungswesen', '', 2), -- Dienste
  ('Controllerdienst', '', 2), -- Dienste
  ('Qualitäts- und Umweltmanagement', '', 2), -- Dienste
  ('Informatik', '', 2), -- Dienste
  ('Internet', '', 2), -- Dienste
  ('Kanzlei AWEL', '', 2), -- Dienste
  ('Energieberatung', '', 3), -- Energie
  ('Energietechnik', '', 3), -- Energie
  ('Energiewirtschaft', '', 3), -- Energie
  ('Kernenergietechnik/Radioaktive Abfälle', '', 3), -- Energie
  ('Tiefenlager', '', 3), -- Energie
  ('Oberflächengewässerschutz', '', 4), -- Gewässerschutz
  ('Abwasserreinigungsanlagen', '', 4), -- Gewässerschutz
  ('Grundwasser und Wasserversorgung', '', 4), -- Gewässerschutz
  ('Bevölkerungsschutz', '', 4), -- Gewässerschutz
  ('Siedlungsentwässerung', '', 4), -- Gewässerschutz
  ('Monitoring', '', 5), -- Luft
  ('Emissionskontrolle', '', 5), -- Luft
  ('Klima und Mobilität', '', 5), -- Luft
  ('Strahlung', '', 5), -- Luft
  ('Bearbeitung von Rechtsfragen', '', 6), -- Recht
  ('Rekurse und Beschwerden', '', 6), -- Recht
  ('Juristische Beratung', '', 6), -- Recht
  ('Rechtliche Vertretung des Amtes nach Aussen', '', 6), -- Recht
  ('Beratung und Bewilligungen', '', 7), -- Wasserbau
  ('Planung', '', 7), -- Wasserbau
  ('Gewässernutzung', '', 7), -- Wasserbau
  ('Bau', '', 7), -- Wasserbau
  ('Gewässerunterhalt', '', 7); -- Wasserbau

-------------------------------------------

drop table if exists links;
create table links (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  url text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iLinkDeleted;
create index iLinkDeleted on links (deleted);
drop index if exists iLinkIdPerson;
create index iLinkIdPerson on links (idPerson);
drop index if exists iLinkUrl;
create index iLinkUrl on links (url);

-------------------------------------------

-- wird auch für badges benutzt
drop table if exists schluessel;
create table schluessel (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  name text,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iSchluesselDeleted;
create index iSchluesselDeleted on schluessel (deleted);
drop index if exists iSchluesselIdPerson;
create index iSchluesselIdPerson on schluessel (idPerson);
drop index if exists iSchluesselName;
create index iSchluesselName on schluessel (name);

-------------------------------------------

drop table if exists mobileAbos;
create table mobileAbos (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  typ text references mobileAboTypWerte(value) on update cascade on delete no action,
  kostenstelle text references mobileAboKostenstelleWerte(value) on update cascade on delete no action,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iMobileAboDeleted;
create index iMobileAboDeleted on mobileAbos (deleted);
drop index if exists iMobileAboIdPerson;
create index iMobileAboIdPerson on mobileAbos (idPerson);
drop index if exists iMobileAboTyp;
create index iMobileAboTyp on mobileAbos (typ);

-------------------------------------------

drop table if exists kaderFunktionen;
create table kaderFunktionen (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  funktion text references kaderFunktionWerte(value) on update cascade on delete no action,
  bemerkungen text,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iKaderFunktionDeleted;
create index iKaderFunktionDeleted on kaderFunktionen (deleted);
drop index if exists iKaderFunktionIdPerson;
create index iKaderFunktionIdPerson on kaderFunktionen (idPerson);
drop index if exists iKaderFunktionFunktion;
create index iKaderFunktionFunktion on kaderFunktionen (funktion);

-------------------------------------------

drop table if exists etiketten;
create table etiketten (
  id integer primary key autoincrement,
  deleted integer default 0,
  idPerson integer references personen(id) on update cascade on delete cascade,
  etikett text references etikettWerte(value) on update cascade on delete cascade,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iEtikettDeleted;
create index iEtikettDeleted on etiketten (deleted);
drop index if exists iEtikettIdPerson;
create index iEtikettIdPerson on etiketten (idPerson);
drop index if exists iEtikettEtikett;
create index iEtikettEtikett on etiketten (etikett);

-------------------------------------------

drop table if exists mutations;
create table mutations (
  id integer primary key autoincrement,
  time TEXT,
  user TEXT,
  op TEXT,
  tableName TEXT,
  rowId integer,
  field TEXT,
  value TEXT,
  previousValue TEXT
);

drop index if exists iMutationsTime;
create index iMutationsTime on mutations (time);
drop index if exists iMutationsUser;
create index iMutationsUser on mutations (user);
drop index if exists iMutationsOp;
create index iMutationsOp on mutations (op);
drop index if exists iMutationsTableName;
create index iMutationsTableName on mutations (tableName);
drop index if exists iMutationsRowId;
create index iMutationsRowId on mutations (rowId);
drop index if exists iMutationsField;
create index iMutationsField on mutations (field);
drop index if exists iMutationsValue;
create index iMutationsValue on mutations (value);
drop index if exists iMutationsPreviousValue;
create index iMutationsPreviousValue on mutations (previousValue);

-------------------------------------------

-- first werte tables
-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists statusWerte;
create table statusWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
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
  ('aktiv', 1),
  ('pensioniert', 2),
  ('ehemalig', 3),
  ('extern', 4);

-------------------------------------------

-- boolean in sqlite is integer
-- true = 1, false = 0
drop table if exists anredeWerte;
create table anredeWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iGeschlechtWerteGeschlecht;
create index iGeschlechtWerteGeschlecht on anredeWerte (value);
drop index if exists iGeschlechtWerteHistorisch;
create index iGeschlechtWerteHistorisch on anredeWerte (historic);
drop index if exists iGeschlechtWerteSort;
create index iGeschlechtWerteSort on anredeWerte (sort);

insert into
  anredeWerte(value, sort)
values
  ('Herr', 1),
  ('Frau', 2);

-------------------------------------------

drop table if exists abteilungWerte;

-------------------------------------------

drop table if exists kostenstelleWerte;
create table kostenstelleWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
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
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboTypWerte;
create table mobileAboTypWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
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
  ('TODO', 1);

-------------------------------------------

drop table if exists kaderFunktionWerte;
create table kaderFunktionWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
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
  ('TODO', 1);

-------------------------------------------

drop table if exists mobileAboKostenstelleWerte;
create table mobileAboKostenstelleWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
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

drop table if exists etikettWerte;
create table etikettWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iEtikettWerteEtikett;
create index iEtikettWerteEtikett on etikettWerte (value);
drop index if exists iEtikettWerteHistorisch;
create index iEtikettWerteHistorisch on etikettWerte (historic);
drop index if exists iEtikettWerteSort;
create index iEtikettWerteSort on etikettWerte (sort);

insert into
  etikettWerte(value, sort)
values
  ('Fussballfan', 1),
  ('Mountainbiker', 2);


-------------------------------------------

drop table if exists landWerte;
create table landWerte (
  id integer primary key autoincrement,
  value text unique,
  deleted integer default 0,
  historic integer default 0,
  sort integer,
  letzteMutationZeit TEXT,
  letzteMutationUser TEXT
);

drop index if exists iLandWerteLand;
create index iLandWerteLand on landWerte (value);
drop index if exists iLandWerteHistorisch;
create index iLandWerteHistorisch on landWerte (historic);
drop index if exists iLandWerteSort;
create index iLandWerteSort on landWerte (sort);

insert into
  landWerte(value)
values
  ('Schweiz'),
  ('Deutschland'),
  ('Italien'),
  ('Frankreich'),
  ('Österreich');

-------------------------------------------

insert into
  personen(name, vorname)
values
  ('Tester', 'Test'),
  ('Tester_2', 'Test_2');


PRAGMA foreign_keys = ON;