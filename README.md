# Heise-News-Filter

Chrome-Extension zum Ausblenden unerwünschter Einträge im heise-Newsticker.

## Funktionen

- filtert Newsticker-Einträge auf `heise.de` anhand der Kategorien im Meta-Bereich aktueller Newsticker- und Archiv-Teaser
- blendet standardmäßig alle bekannten Kategorien außer `heise online` aus
- unterstützt zusätzliche Kategorien wie `Alert`, `Angebot`, `Update` und `WTF`
- erkennt weitere Kategorien beim Besuch der Seite automatisch und zeigt sie später im Popup an
- blendet standardmäßig alle regelmäßigen Rubriken anhand des Titels aus:
  - Tageskurzzusammenfassungen mit `Montag:` bis `Sonntag:`
  - `Missing Link:`
  - `Zahlen, bitte:`
  - `#TGIQF`
  - `Post zum Freitag`
  - `Kommentar:`
- ist über das Popup der Extension konfigurierbar
- speichert Einstellungen per Chrome-Sync-Storage

## Bedienung

1. Heise-News-Filter über das Extension-Symbol öffnen.
2. Unter `Ausgeblendete Kategorien` die Kategorien aktivieren, die nicht angezeigt werden sollen.
3. Unter `Ausgeblendete Rubriken` regelmäßige Titel-Filter aktivieren.
4. Die Änderungen werden automatisch gespeichert und direkt auf geöffneten heise-Seiten angewendet.

Mit `Standard` werden alle bekannten Kategorien außer `heise online` und alle Rubrikfilter ausgeblendet.

## Installation zum Entwickeln

1. `chrome://extensions` öffnen.
2. Den Entwicklermodus aktivieren.
3. `Entpackte Erweiterung laden` auswählen.
4. Dieses Projektverzeichnis auswählen.

## Datenschutz

Die Extension verarbeitet nur Inhalte auf `heise.de`, um Newsticker-Einträge im Browser auszublenden. Einstellungen werden über `chrome.storage.sync` gespeichert. Es werden keine Daten an externe Server übertragen.
