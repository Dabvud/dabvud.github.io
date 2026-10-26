import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function finish() {
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('OK');
  }
}

function main() {
  let html;
  try {
    html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  } catch (error) {
    errors.push(error.code === 'ENOENT'
      ? 'index.html fehlt'
      : 'index.html konnte nicht gelesen werden');
    return;
  }

  const match = html.match(/const APPS = (\[[\s\S]*?\]);/);
  let apps;
  if (match) {
    try {
      apps = new Function('return ' + match[1])();
    } catch {
      errors.push('APPS konnte nicht ausgewertet werden');
    }
  }
  check(Array.isArray(apps) && apps.length > 0, 'APPS ist ein nicht-leeres Array');

  const expected = {
    name: 'Impostor',
    text: 'Partyspiel mit Fußballern – ein Handy, reihum.',
    icon: 'icons/impostor.png',
    link: '/impostor/',
    art: 'Web-App',
  };
  const keys = Object.keys(expected).sort();
  const names = new Set();

  if (Array.isArray(apps)) {
    for (const [index, app] of apps.entries()) {
      const label = 'Eintrag ' + (index + 1);
      const isObject = app !== null && typeof app === 'object' && !Array.isArray(app);
      check(isObject
        && Object.keys(app).sort().join(',') === keys.join(',')
        && keys.every((key) => typeof app[key] === 'string' && app[key].trim().length > 0),
      'Felder: ' + label);

      if (!isObject) continue;

      if (typeof app.name === 'string') {
        check(!names.has(app.name), 'Namen eindeutig: ' + label);
        names.add(app.name);
      }
      check(typeof app.icon === 'string' && app.icon.trim().length > 0
        && fs.existsSync(path.join(root, app.icon)), 'icon existiert: ' + label);
      check(typeof app.link === 'string' && /^(?:\/|https:\/\/)/.test(app.link),
        'link: ' + label);
    }
  }

  check(Array.isArray(apps) && apps.some((app) => app !== null
    && typeof app === 'object' && Object.keys(app).sort().join(',') === keys.join(',')
    && keys.every((key) => app[key] === expected[key])), 'Impostor-Eintrag');
  check([...html.matchAll(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/gi)]
    .some((block) => /href="\/impostor\/"/.test(block[1])), 'noscript-Fallback');

  check(/<html\b[^>]*\blang="de"/i.test(html), 'Meta: lang="de"');
  check(html.includes('<title>Dabvud – Apps</title>'), 'Meta: title');
  check(/<meta\b[^>]*\bname="viewport"/i.test(html), 'Meta: viewport');
  check(/<meta\b[^>]*\bname="description"/i.test(html), 'Meta: description');
  check([...html.matchAll(/<meta\b[^>]*\bname="theme-color"[^>]*>/gi)].length === 2,
    'Meta: zwei theme-color');
  check(!/<script\b[^>]*\bsrc\s*=/i.test(html), 'Meta: keine externen Scripts');
  check(!/<link\b[^>]*\bhref\s*=\s*["']?https?:/i.test(html),
    'Meta: keine externen Links auf Ressourcen');
}

main();
finish();
