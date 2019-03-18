insert into
  kostenstelleWerte(value)
values
  ('850000'),
  ('850020'),
  ('850090'),
  ('850100'),
  ('851200'),
  ('851210'),
  ('851220'),
  ('851230'),
  ('851240'),
  ('851250'),
  ('851400'),
  ('851410'),
  ('851420'),
  ('851430'),
  ('851440'),
  ('852700'),
  ('852710'),
  ('852730'),
  ('852740'),
  ('852760'),
  ('852770'),
  ('852800'),
  ('852810'),
  ('852820'),
  ('852830'),
  ('852840'),
  ('852850'),
  ('853800'),
  ('853810'),
  ('853820'),
  ('853830');

insert into
  standortWerte(value)
values
  ('Walcheplatz 2'),
  ('Stampfenbachstrasse 12/14'),
  ('Weinbergstrasse 34'),
  ('Carbahaus'),
  ('Werkhof Adliswil'),
  ('Werkhof Obfelden'),
  ('Werkhof Glattbrugg'),
  ('Werkhof Hettlingen'),
  ('Werkhof Andelfingen'),
  ('Werkhof Hinwil');

insert into
  statusWerte(value, sort)
values
  ('aktiv', 1),
  ('pensioniert', 2),
  ('ehemalig', 3),
  ('extern', 4);

insert into
  aemter(name, id, kostenstelle)
values
  ('AWEL', 1, '850000');

insert into
  abteilungen(id, name, kurzzeichen, amt, kostenstelle)
values
  (1, 'Abfallwirtschaft', 'aw', 1, '851200'),
  (2, 'Dienste FRW', '', 1, '850090'),
  (8, 'Dienste QMS', '', 1, '850100'),
  (3, 'Energie', 'en', 1, '853800'),
  (4, 'Gewässerschutz', 'gs', 1, '852800'),
  (5, 'Luft', 'lu', 1, '851400'),
  (6, 'Recht', 're', 1, '850020'),
  (7, 'Wasserbau', 'wb', 1, '852700');

insert into
  sektionen(id, name, kurzzeichen, abteilung, kostenstelle)
values
  (1, 'Abfallwirtschaft', '', 1, '851210'), -- Abfallwirtschaft und Betriebe
  (2, 'Altlasten', '', 1, '851220'), -- Abfallwirtschaft und Betriebe
  (3, 'Betrieblicher Umweltschutz und Störfallvorsorge', '', 1, '851230'), -- Abfallwirtschaft und Betriebe
  (4, 'Biosicherheit', '', 1, '851240'), -- Abfallwirtschaft und Betriebe
  (5, 'Energieberatung', '', 3, '853830'), -- Energie
  (6, 'Energietechnik', '', 3, '853810'), -- Energie
  (7, 'Energiewirtschaft', '', 3, '853820'), -- Energie
  (8, 'Oberflächengewässerschutz', '', 4, '852810'), -- Gewässerschutz
  (9, 'Abwasserreinigungsanlagen', '', 4, '852820'), -- Gewässerschutz
  (10, 'Grundwasser und Wasserversorgung', '', 4, '852840'), -- Gewässerschutz
  (11, 'Bevölkerungsschutz', '', 4, '852850'), -- Gewässerschutz
  (12, 'Siedlungsentwässerung', '', 4, '852830'), -- Gewässerschutz
  (13, 'Monitoring', '', 5, '851410'), -- Luft
  (14, 'Emissionskontrolle', '', 5, '851440'), -- Luft
  (15, 'Klima und Mobilität', '', 5, '851420'), -- Luft
  (16, 'Strahlung', '', 5, '851430'), -- Luft
  (17, 'Beratung und Bewilligungen', '', 7, '852770'), -- Wasserbau
  (18, 'Planung', '', 7, '852730'), -- Wasserbau
  (19, 'Gewässernutzung', '', 7, '852740'), -- Wasserbau
  (20, 'Bau', '', 7, '852710'), -- Wasserbau
  (21, 'Gewässerunterhalt', '', 7, '852760'); -- Wasserbau

  -- ('Tankanlagen und Transportgewerbe', '', 1, '851250'), -- Abfallwirtschaft und Betriebe
  -- ('Finanz und Rechnungswesen', '', 2, ''), -- Dienste
  -- ('Controllerdienst', '', 2, ''), -- Dienste
  -- ('Bearbeitung von Rechtsfragen', '', 6, ''), -- Recht
  -- ('Rekurse und Beschwerden', '', 6, ''), -- Recht
  -- ('Juristische Beratung', '', 6, ''), -- Recht
  -- ('Rechtliche Vertretung des Amtes nach Aussen', '', 6, ''), -- Recht
  -- ('Kernenergietechnik/Radioaktive Abfälle', '', 3, ''), -- Energie
  -- ('Tiefenlager', '', 3, ''), -- Energie
  -- ('Qualitäts- und Umweltmanagement', '', 2, ''), -- Dienste
  -- ('Informatik', '', 2, ''), -- Dienste
  -- ('Internet', '', 2, ''), -- Dienste
  -- ('Kanzlei AWEL', '', 2, ''), -- Dienste

insert into
  personen(id, vorname, name)
values
(1, 'Werner',	'Haas'),
(2, 'Erich',	'Hess'),
(3, 'Thomas',	'Hofmann'),
(4, 'Guido',	'Merletti'),
(5, 'Peter',	'Wyler'),
(6, 'Fritz',	'Studer'),
(7, 'Paul',	'Ruckstuhl'),
(8, 'Götz',	'Christian'),
(9, 'Beat',	'Koller'),
(10, 'Thomas',	'Flüeler');

insert into
  settings(id,personMutationWeiterleiten)
values
  (1,'ausgefülltes Formular bitte an awel@bd.zh.ch, silvio.cerutti@bd.zh.ch sowie IKO der Abteilung weiterleiten');

insert into
  anredeWerte(value, sort)
values
  ('Herr', 1),
  ('Frau', 2);

insert into
  mobileAboTypWerte(value, sort)
values
  ('TODO mobileAboTypWert', 1);

insert into
  telefonTypWerte(value, sort)
values
  ('mobile', 1),
  ('Festnetz', 2);

insert into
  schluesselTypWerte(value)
values
  ('Kaba Nova'),
  ('Kaba Legic'),
  ('Kaba Star');

insert into
  schluesselAnlageWerte(value)
values
  ('RZ0146'),
  ('RZ0147');

insert into
  funktionWerte(value, sort)
values
  ('XY-Verantwortlich', 1),
  ('ZX-Organisator', 2);

insert into
  kaderFunktionWerte(value, sort)
values
  ('Amts-Leiter', 1),
  ('Abteilungs-Leiter', 2),
  ('Sektions-Leiter', 3),
  ('Bereichs-Leiter', 4);

insert into
  mobileAboKostenstelleWerte(value, sort)
values
  ('TODO mobileAboKostenstelleWert', 1);

insert into
  etikettWerte(value, sort)
values
  ('Fussballfan', 1),
  ('Mountainbiker', 2);

insert into
  landWerte(value)
values
  ('Schweiz'),
  ('Deutschland'),
  ('Italien'),
  ('Frankreich'),
  ('Österreich');

insert into
  mutationartWerte(value)
values
  ('test 1'),
  ('test 2');

insert into
  bereiche(abteilung, amt, sektion, name, standort, leiter)
values
(7, 1,	20,	'Betrieb Sihl',	'Werkhof Adliswil',	1),
(7, 1,	20,	'Betrieb Reuss / Limmat', 'Werkhof Obfelden',	2),
(7, 1,	20,	'Betrieb Töss',	'Werkhof Hettlingen',	3),
(7, 1,	20,	'Betrieb Thur / Rhein',	'Werkhof Andelfingen',	4),
(7, 1,	20,	'Betrieb Glatt',	'Werkhof Glattbrugg',	5),
(7, 1,	20,	'Betrieb Oberland / Seen',	'Werkhof Hinwil',	6),
(4, 1,	10,	'Wasserversorung',	'Stampfenbachstrasse 12/14',	7),
(4, 1,	8,	'Fachgruppe Analytik',	'Carbahaus',	8),
(4, 1,	12,	'Liegenschaftenentwässerung',	'Stampfenbachstrasse 12/14',	9),
(3, 1,	null,	'Kerntechnik',	'Stampfenbachstrasse 12/14',	10);

--insert into
--  bereiche(name)
--values
--  ('Kernenergietechnik/Radioaktive Abfälle'),
--  ('Tiefenlager'),
--  ('Bearbeitung von Rechtsfragen'),
--  ('Rekurse und Beschwerden'),
--  ('Juristische Beratung'),
--  ('Rechtliche Vertretung des Amtes nach Aussen'),
--  ('Finanz und Rechnungswesen'),
--  ('Controllerdienst'),
--  ('Qualitäts- und Umweltmanagement'),
--  ('Informatik'),
--  ('Internet'),
--  ('Kanzlei AWEL');