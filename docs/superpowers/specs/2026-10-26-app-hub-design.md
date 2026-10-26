# App-Hub „Dabvud“ – Design

Stand: 2026-10-26

## Ziel

Eine Startseite unter `https://dabvud.github.io/`, auf der man zwischen den Apps
wählen kann, die Dabvud gebaut und auf GitHub veröffentlicht hat. Ein Tipp auf
eine Kachel führt direkt zur App.

**Was der Nutzer gesagt hat:**

- Eine Seite, die „dazwischen geschaltet“ wird und mehrere Apps zur Auswahl zeigt.
- Zum Start ist Impostor die einzige App.
- Die App-Liste wird von Hand gepflegt, nicht automatisch von GitHub gelesen.
- Der Stil ist persönlich und schlicht.

**Erfolgskriterien:**

1. `https://dabvud.github.io/` zeigt den Hub mit einer Impostor-Kachel.
2. Ein Tipp auf die Kachel öffnet `https://dabvud.github.io/impostor/`.
3. `https://dabvud.github.io/impostor/` funktioniert weiter direkt. Der QR-Code
   im Spiel, Lesezeichen und installierte PWAs sind nicht betroffen.
4. Für eine neue App reicht ein neuer Listeneintrag plus Icon, danach ein Push.

## Abgrenzung zu Impostor

Der Hub ist ein eigenes Repo `dabvud/dabvud.github.io`, also eine GitHub-Pages-User-Site.
Projekt-Repos mit Pages werden von GitHub unabhängig davon unter
`dabvud.github.io/<repo>/` ausgeliefert. Das Impostor-Repo und sein Code werden
nicht verändert. Der Teilen-QR-Code in Impostor (`location.origin + BASE_URL`)
zeigt weiterhin direkt auf das Spiel.

## Technik

- Statische Seite ohne Build und ohne npm-Abhängigkeiten.
- GitHub Pages veröffentlicht direkt aus Branch `main`, Ordner `/` (Root),
  ohne GitHub Actions.
- Lokaler Ordner: `Desktop\dabvud.github.io`.

### Dateien

```
index.html          Seite mit Markup, App-Liste und kleinem Script
style.css           Gestaltung mit Farb-Tokens für Hell und Dunkel
favicon.svg         eigenes Hub-Icon (ein schlichtes „D“-Monogramm)
icons/impostor.png  Kopie von Impostor/public/pwa-192x192.png
.nojekyll           Pages soll nichts per Jekyll verarbeiten
README.md           kurz: was das ist, wie man eine App hinzufügt
```

### App-Liste

In `index.html` steht ein Array `APPS`. Jeder Eintrag hat genau diese Felder:

| Feld   | Bedeutung                                | Beispiel                                          |
|--------|------------------------------------------|---------------------------------------------------|
| `name` | Anzeigename                              | `"Impostor"`                                      |
| `text` | ein Satz Beschreibung                    | `"Partyspiel mit Fußballern – ein Handy, reihum."` |
| `icon` | Pfad zum Icon, relativ zur Seite         | `"icons/impostor.png"`                            |
| `link` | Ziel der Kachel                          | `"/impostor/"`                                    |
| `art`  | kurzer Typ-Hinweis auf der Kachel        | `"Web-App"`                                       |

Ein kleines Script erzeugt aus `APPS` die Kacheln. Die Reihenfolge der Kacheln
entspricht der Reihenfolge im Array.

**Ohne JavaScript:** Die Impostor-Kachel steht zusätzlich als statisches Markup in
einem `<noscript>`-Block. So bleibt sie auch ohne JavaScript erreichbar.

## Gestaltung

- **Kopf:** „Dabvud“ als Überschrift, darunter die Zeile „Meine Apps“.
- **Kacheln:** Icon (abgerundet, 56–64 px), Name, Beschreibung und darunter dezent
  `art · öffnen`. Die ganze Kachel ist ein `<a>`, das im selben Tab öffnet.
  Hover- und Fokus-Zustand sind sichtbar, auch bei Tastaturbedienung.
- **Raster:** auf dem Handy eine Spalte, ab ca. 640 px zwei, ab ca. 960 px drei
  Spalten. Maximalbreite ca. 960 px, zentriert, seitlicher Rand 16 px, kein
  horizontales Scrollen.
- **Farben:** als CSS-Variablen auf `:root`. Dunkelmodus über
  `prefers-color-scheme: dark`. Neutrale Grundfarben und eine Akzentfarbe, ohne
  Fußball-Bezug.
- **Schrift:** System-Schriftstack, keine externen Fonts.
- **Fuß:** eine kleine Zeile mit Link zum GitHub-Profil `github.com/Dabvud`.
- **Meta:** `lang="de"`, Viewport-Meta, `<title>Dabvud – Apps</title>`,
  `meta description`, `theme-color` für Hell und Dunkel.

## Neue App hinzufügen

1. Icon nach `icons/<name>.png` legen, quadratisch, mindestens 128 px.
2. Eintrag in `APPS` ergänzen.
3. Committen und auf `main` pushen. Pages aktualisiert sich nach ca. 1 Minute.

Das steht auch im README.

## Veröffentlichung

1. Öffentliches Repo `Dabvud/dabvud.github.io` auf GitHub anlegen und `main` pushen.
   Dieser Schritt ist nach außen sichtbar und braucht deshalb vorher das OK des Nutzers.
2. In den Repo-Einstellungen Pages auf „Deploy from a branch“, `main`, `/` stellen.
   Bei User-Site-Repos ist das meist schon voreingestellt.

## Tests

Die Seite ist statisch und hat keine Logik, die Unit-Tests rechtfertigt. Geprüft
wird von Hand bzw. im Browser:

1. Die lokale Seite zeigt die Impostor-Kachel mit Icon, Name, Text und Hinweis.
2. Bei 375 px Breite: eine Spalte, kein horizontales Scrollen.
3. Hell- und Dunkelmodus sind beide lesbar.
4. Die Kachel ist per Tab erreichbar, der Fokus ist sichtbar, Enter öffnet sie.
5. Nach dem Deploy lädt `https://dabvud.github.io/`, die Kachel führt zu
   `https://dabvud.github.io/impostor/`, und diese URL lädt weiterhin direkt.
6. Die HTML-Validierung zeigt keine Fehler (z. B. per `npx html-validate` einmalig
   oder per W3C-Validator).

## Bewusst nicht enthalten

- Automatisches Auslesen der GitHub-Repos.
- Suche, Kategorien und Filter.
- Downloads für Desktop-Programme (Releases, `.exe`, `.zip`). Das kommt erst,
  wenn eine solche App wirklich in den Hub soll.
- Eine PWA bzw. Installierbarkeit für den Hub selbst.
- Änderungen am Impostor-Repo.
