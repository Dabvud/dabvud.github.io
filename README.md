# dabvud.github.io

Startseite mit allen Apps von Dabvud: <https://dabvud.github.io/>

Die Seite ist statisch (`index.html` + `style.css`) und wird von GitHub Pages
direkt aus `main` veröffentlicht – ohne Build.

Jede App hat ihr eigenes Repo mit GitHub Pages und ist dadurch unter
`https://dabvud.github.io/<repo>/` erreichbar, z. B. Impostor unter
<https://dabvud.github.io/impostor/>. Der Hub verlinkt nur dorthin.

## Neue App hinzufügen

1. Icon nach `icons/<name>.png` legen (quadratisch, mindestens 128 px).
2. In `index.html` einen Eintrag im Array `APPS` ergänzen:

   ```js
   {
     name: "Name",
     text: "Ein Satz, was die App macht.",
     icon: "icons/name.png",
     link: "/repo-name/",
     art: "Web-App",
   },
   ```

3. Prüfen: `node tests/check.mjs` muss `OK` ausgeben.
4. Committen und auf `main` pushen. Pages aktualisiert sich nach etwa einer Minute.
