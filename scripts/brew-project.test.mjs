import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const projectSlug = 'brew-first-ask-later';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

for (const [locale, prefix, theme] of [
  ['fr', '', "Le choix n'arrive qu'après"],
  ['en', 'en/', 'The choice only comes afterwards'],
]) {
  test(`${locale}: built project contains localized copy, working assets and links`, () => {
    const document = new JSDOM(read(`dist/${prefix}projects/${projectSlug}/index.html`)).window.document;
    assert.equal(document.documentElement.lang, locale);
    assert(document.body.textContent.includes(theme));
    assert(document.body.textContent.includes('5 minutes'));
    assert(document.body.textContent.includes(locale === 'fr' ? 'Technologie' : 'Technology'));
    assert(document.body.textContent.includes(locale === 'fr' ? 'Outils et technologies utilisés' : 'Tools and technologies used'));
    assert(!document.title.includes('\u2014'));
    const embed = document.querySelector('iframe[src*="w.soundcloud.com"]');
    assert(embed);
    const trackUrl = new URL(new URL(embed.src).searchParams.get('url'));
    assert.equal(trackUrl.pathname, '/kforkowskii/brew-first-ask-later-original');
    assert(document.querySelector('a[href="https://ystos.itch.io/brew-first-ask-later"]'));
    assert(document.querySelector('button[onclick*="https://itch.io/jam/game-jam-cstudio-2026"]'));
    assert(document.querySelector('.project-bento .hero-card'));
    assert(document.querySelector('.hero-card').outerHTML.includes('/_astro/hero.'));
  });
  test(`${locale}: project is discoverable on the Game Audio orbit`, () => {
    const document = new JSDOM(read(`dist/${prefix}index.html`)).window.document;
    const electron = document.querySelector(`.electron[data-project="2_game-audio/${projectSlug}"]`);
    assert(electron);
    assert.equal(electron.dataset.domain, 'game-audio');
    assert(document.querySelector(`.bento-project[data-project-slug="2_game-audio/${projectSlug}"]`));
  });
}
