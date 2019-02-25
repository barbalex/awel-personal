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
  sektionen(name, kurzzeichen, abteilung, kostenstelle)
values
  ('Abfallwirtschaft', '', 1, '851210'), -- Abfallwirtschaft und Betriebe
  ('Altlasten', '', 1, '851220'), -- Abfallwirtschaft und Betriebe
  ('Betrieblicher Umweltschutz und Störfallvorsorge', '', 1, '851230'), -- Abfallwirtschaft und Betriebe
  ('Biosicherheit', '', 1, '851240'), -- Abfallwirtschaft und Betriebe
  ('Energieberatung', '', 3, '853830'), -- Energie
  ('Energietechnik', '', 3, '853810'), -- Energie
  ('Energiewirtschaft', '', 3, '853820'), -- Energie
  ('Oberflächengewässerschutz', '', 4, '852810'), -- Gewässerschutz
  ('Abwasserreinigungsanlagen', '', 4, '852820'), -- Gewässerschutz
  ('Grundwasser und Wasserversorgung', '', 4, '852840'), -- Gewässerschutz
  ('Bevölkerungsschutz', '', 4, '852850'), -- Gewässerschutz
  ('Siedlungsentwässerung', '', 4, '852830'), -- Gewässerschutz
  ('Monitoring', '', 5, '851410'), -- Luft
  ('Emissionskontrolle', '', 5, '851440'), -- Luft
  ('Klima und Mobilität', '', 5, '851420'), -- Luft
  ('Strahlung', '', 5, '851430'), -- Luft
  ('Beratung und Bewilligungen', '', 7, '852770'), -- Wasserbau
  ('Planung', '', 7, '852730'), -- Wasserbau
  ('Gewässernutzung', '', 7, '852740'), -- Wasserbau
  ('Bau', '', 7, '852710'), -- Wasserbau
  ('Gewässerunterhalt', '', 7, '852760'); -- Wasserbau

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
  bereiche(abteilung, sektion, name, standort, leiter)
values
('Wasserbau',	'Bau',	'Betrieb Sihl',	'Adliswil',	1),
('Wasserbau',	'Bau',	'Betrieb Reuss / Limmat', 	'Obfelden',	2),
('Wasserbau',	'Bau',	'Betrieb Töss',	'Hettlingen',	3),
('Wasserbau',	'Bau',	'Betrieb Thur / Rhein',	'Andelfingen',	4),
('Wasserbau',	'Bau',	'Betrieb Glatt',	'Glattbrugg',	5),
('Wasserbau',	'Bau',	'Betrieb Oberland / Seen',	'Hinwil',	6),
('Gewässerschutz',	'Grundwasser und Wasserversorgung',	'Wasserversorung',	'Stampfenbachstrasse 12 / 14',	7),
('Gewässerschutz',	'Oberflächengewässerschutz',	'Fachgruppe Analytik',	'Carbahaus',	8),
('Gewässerschutz',	'Siedlungsentwässerung',	'Liegenschaftenentwässerung',	'Stampfenbachstrasse 12 / 14',	9),
('Energie',	'',	'Kerntechnik',	'Stampfenbachstrasse 12 / 14',	10);

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

insert into
  settings(id)
values
  (1);

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
  ('Chef', 1),
  ('Knecht', 2);

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