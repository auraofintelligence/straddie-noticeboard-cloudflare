import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const publicDir = new URL('../public/', import.meta.url);
const pages = (await readdir(publicDir)).filter(name => name.endsWith('.html'));

test('every page loads the menu and footer controls exactly once', async () => {
  for (const name of pages) {
    const html = await readFile(new URL(name, publicDir), 'utf8');
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1].split('/').pop());
    for (const file of ['navigation.js', 'footer-navigation.js']) {
      assert.equal(scripts.filter(script => script === file).length, 1, name + ' should load ' + file + ' once');
    }
  }
});

test('previous and next links form one connected guide, including both board and screen modes', async () => {
  const guide = new Map();
  for (const name of pages.filter(page => page !== '404.html')) {
    const html = await readFile(new URL(name, publicDir), 'utf8');
    const sections = [...html.matchAll(/<nav class="page-sequence"([^>]*)>([\s\S]*?)<\/nav>/g)];
    const hasTwoModes = name === 'board.html' || name === 'screen.html';
    assert.equal(sections.length, hasTwoModes ? 2 : 1, name);
    for (const [, attributes, content] of sections) {
      const page = name === 'index.html' ? './' : './' + name;
      const route = attributes.includes('data-sequence-mode="pilot"') ? page + '?mode=pilot' : page;
      const links = Object.fromEntries([...content.matchAll(/<a href="([^"]+)" rel="(prev|next)"/g)]
        .map(([, href, relation]) => [relation, href]));
      assert.ok(links.next && links.prev, route + ' needs both directions');
      guide.set(route, links);
    }
  }
  const visited = new Set();
  let route = './';
  while (!visited.has(route)) {
    visited.add(route);
    const next = guide.get(route)?.next;
    assert.equal(guide.get(next)?.prev, route, 'Broken return link from ' + next + ' to ' + route);
    route = next;
  }
  assert.equal(route, './');
  assert.equal(visited.size, guide.size);
});
