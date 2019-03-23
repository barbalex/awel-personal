select
  coalesce(personen.personalNr, '') || ' ' ||
  coalesce(lower(personen.name), '') || ' ' ||
  coalesce(lower(personen.vorname), '') || ' ' ||
  coalesce(lower(personen.anrede), '') || ' ' ||
  coalesce(lower(personen.titel), '') || ' ' ||
  coalesce(lower(personen.kurzzeichen), '') || ' ' ||
  coalesce(lower(personen.adresse), '') || ' ' ||
  coalesce(personen.plz, '') || ' ' ||
  coalesce(lower(personen.ort), '') || ' ' ||
  coalesce(lower(personen.land), '') || ' ' ||
  coalesce(lower(personen.bildUrl), '') || ' ' ||
  coalesce(lower(personen.email), '') || ' ' ||
  coalesce(personen.geburtDatum, '') || ' ' ||
  coalesce(lower(personen.bueroNr), '') || ' ' ||
  coalesce(lower(personen.standort), '') || ' ' ||
  coalesce(personen.eintrittDatum, '') || ' ' ||
  coalesce(personen.austrittDatum, '') || ' ' ||
  coalesce(lower(personen.status), '') || ' ' ||
  coalesce(lower(personen.parkplatzNr), '') || ' ' ||
  coalesce(lower(personen.bemerkungen), '') || ' ' ||
  coalesce(personen.beschaeftigungsgrad, '') || ' ' ||
  coalesce(personen.mutationFrist, '') || ' ' ||
  coalesce(lower(personen.mutationArt), '') || ' ' ||
  coalesce(personen.rufnummer, '') || ' ' ||
  coalesce(personen.arbeitsplatzeroeffnungPer, '') || ' ' ||
  coalesce(lower(personen.benoetigteSoftware), '') || ' ' ||
  coalesce(lower(personen.standardabweichendeHardware), '') || ' ' ||
  coalesce(personen.abmeldungArbeitsplatzPer, '') || ' ' ||
  coalesce(personen.bueroWechselPer, '') || ' ' ||
  coalesce(personen.kostenstellenAenderungPer, '') || ' ' ||
  coalesce(lower(personen.itMutationBemerkungen), '') || ' ' ||
  coalesce(aemter.name, '') || ' ' ||
  coalesce(abteilungen.name, '') || ' ' ||
  coalesce(sektionen.name, '') || ' ' ||
  coalesce(bereiche.name, '') as result
from personen
left join aemter
on personen.amt = aemter.id
left join abteilungen
on personen.abteilung = abteilungen.id
left join sektionen
on personen.sektion = sektionen.id
left join bereiche
on personen.bereich = bereiche.id


-- group-concat from:
funktionen
kaderfunktionen
schluessel
links
telefones
mobileAbos
etiketten