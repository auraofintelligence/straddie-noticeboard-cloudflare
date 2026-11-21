import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const publicDir = new URL('../public/', import.meta.url);
const pages = (await readdir(publicDir)).filter(name => name.endsWith('.html')).sort();
const documents = new Map(await Promise.all(pages.map(async name => [name, await readFile(new URL(name, publicDir), 'utf8')])));
const journey = [
  'index.html', 'how-it-works.html', 'training.html', 'submit.html', 'opportunities.html', 'businesses.html',
  'setup.html', 'resilience.html', 'visitor-volunteer.html', 'pilot.html', 'grants.html',
];
const projectContact = 'https://auraofintelligence.github.io/strange-but-true/contact.html';

function sequences(name) {
  return [...documents.get(name).matchAll(/<nav class="page-sequence"([^>]*)>([\s\S]*?)<\/nav>/g)]
    .map(([, attributes, content]) => ({
      attributes,
      links: Object.fromEntries([...content.matchAll(/<a href="([^"]+)" rel="(prev|next)"><span>(Previous|Next|Take part)<\/span><strong>([^<]+)<\/strong><\/a>/g)]
        .map(([, href, relation, marker, description]) => [relation, { href, marker, description }])),
    }));
}

function pageHref(name) {
  return name === 'index.html' ? './' : './' + name;
}

test('every page loads the menu and footer controls exactly once', async () => {
  for (const [name, html] of documents) {
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1].split('/').pop());
    for (const file of ['navigation.js', 'footer-navigation.js']) {
      assert.equal(scripts.filter(script => script === file).length, 1, name + ' should load ' + file + ' once');
    }
  }
});

test('the proposal advances one chapter at a time and closes with a way to contact the project', () => {
  for (const [index, name] of journey.entries()) {
    const sections = sequences(name);
    assert.equal(sections.length, 1, name);
    const [{ attributes, links }] = sections;
    assert.match(attributes, /Continue through the proposal/);
    assert.equal(links.prev?.href, index ? pageHref(journey[index - 1]) : undefined, name);
    assert.equal(links.next?.href, index === journey.length - 1 ? projectContact : pageHref(journey[index + 1]), name);
  }
});

test('side pages offer contextual exits and retain a working default without JavaScript', () => {
  const sidePages = {
    '404.html': [['/', '/how-it-works.html']],
    'board.html': [['./submit.html', './screen.html'], ['./how-it-works.html', './screen.html?mode=pilot']],
    'emergencies.html': [['./island.html', './resilience.html']],
    'island.html': [['./visitor-volunteer.html', './emergencies.html']],
    'network.html': [['./pilot.html', './grants.html']],
    'screen.html': [['./board.html', './setup.html'], ['./board.html?mode=pilot', './setup.html']],
  };
  assert.deepEqual(Object.keys(sidePages), pages.filter(name => !journey.includes(name)));
  for (const [name, destinations] of Object.entries(sidePages)) {
    const sections = sequences(name);
    assert.deepEqual(sections.map(({ links }) => [links.prev?.href, links.next?.href]), destinations, name);
    assert.ok(sections.every(({ attributes }) => attributes.includes('Continue from this page')), name);
    if (destinations.length === 2) {
      assert.match(sections[0].attributes, /data-sequence-mode="practice"$/);
      assert.match(sections[1].attributes, /data-sequence-mode="pilot" hidden$/);
    }
  }
  for (const name of pages) {
    for (const { links } of sequences(name)) {
      for (const [relation, { href, marker, description }] of Object.entries(links)) {
        const expectedMarker = relation === 'prev' ? 'Previous' : name === 'grants.html' ? 'Take part' : 'Next';
        assert.equal(marker, expectedMarker, name);
        assert.notEqual(description.trim(), '', name);
        const { origin, pathname } = new URL(href, 'https://noticeboard.test/');
        if (origin === 'https://noticeboard.test') assert.ok(pathname === '/' || pages.includes(pathname.slice(1)), `${name}: ${href}`);
      }
    }
  }
});

test('the native menu makes all pages and both display modes discoverable', () => {
  const offeredPages = pages.filter(name => name !== '404.html').map(pageHref);
  offeredPages.push('./board.html?mode=pilot', './screen.html?mode=pilot');
  for (const [name, html] of documents) {
    const menu = html.match(/<details class="section-menu">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(menu, name);
    assert.match(menu, /<summary[^>]*>[\s\S]*?<\/span>Menu<\/summary>/);
    assert.equal((menu.match(/<details class="nav-more"/g) || []).length, 2, name);
    const links = [...menu.matchAll(/<a(?: class="[^"]+")? href="([^"]+)" data-nav-route="([^"]+)"([^>]*)>/g)];
    const prefix = name === '404.html' ? '/' : './';
    assert.deepEqual(links.map(([, href]) => href).sort(), offeredPages.map(href => prefix + href.slice(2)).sort(), name);
    const current = links.filter(([, , , attributes]) => attributes.includes('aria-current="page"'));
    const nativePage = name.startsWith('board') || name.startsWith('screen') ? name.replace('.html', '-practice') : name.replace('.html', '');
    assert.deepEqual(current.map(([, , route]) => route), name === '404.html' ? [] : [nativePage], name);
  }
});
