import { categories, places } from './notices.js';

const form = document.querySelector('#draft-form');
const fields = Object.fromEntries(Array.from(form.querySelectorAll('input, select, textarea')).map(field => [field.id, field]));
const generate = document.querySelector('#generate-draft');
const preview = document.querySelector('#draft-preview');
const copy = document.querySelector('#copy-draft');
const download = document.querySelector('#download-draft');
const storageStatus = document.querySelector('#storage-status');
const draftStatus = document.querySelector('#draft-status');
const storageKey = 'straddie-noticeboard:notice-draft:v1';

function addOptions(select, values) {
  for (const value of values) {
    select.add(new Option(value, value));
  }
}

function formValues() {
  return Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value.trim()]));
}

function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || typeof saved !== 'object') return;

    for (const [name, field] of Object.entries(fields)) {
      if (typeof saved[name] === 'string') field.value = saved[name];
    }
    storageStatus.textContent = 'Draft restored from this browser.';
  } catch {
    storageStatus.textContent = 'Local draft storage is unavailable.';
  }
}

function saveDraft() {
  let message = 'Draft saved in this browser.';
  try {
    localStorage.setItem(storageKey, JSON.stringify(formValues()));
  } catch {
    message = 'Local draft storage is unavailable. Download your draft to keep a copy.';
  }
  if (storageStatus.textContent !== message) storageStatus.textContent = message;
}

function validate() {
  const values = formValues();
  for (const field of [fields.title, fields.publisher, fields.summary]) {
    field.setCustomValidity(values[field.id] ? '' : 'Please enter a value.');
  }

  fields.expires.setCustomValidity('');
  if (values.starts && values.expires && values.expires <= values.starts) {
    fields.expires.setCustomValidity('Choose a take-down time after the start time.');
  }

  fields.source.setCustomValidity('');
  if (values.source && !/^https?:\/\//i.test(values.source)) {
    fields.source.setCustomValidity('Enter a public link beginning with https:// or http://.');
  }
  return form.reportValidity();
}

function localDateTime(value) {
  return value ? `${value}:00+10:00` : '';
}

function buildMarkdown() {
  const { title, publisher, place, category, starts, expires, venue, source, summary } = formValues();
  const metadata = {
    schema: 'notice.v1',
    title,
    publisher,
    town: place,
    type: category,
    ...(starts && { starts: localDateTime(starts) }),
    expires: localDateTime(expires),
    ...(venue && { venue }),
    source_url: source,
    status: 'draft',
    visibility: 'review_only'
  };
  const frontmatter = Object.entries(metadata).map(([name, value]) => `${name}: ${JSON.stringify(value)}`);
  return ['---', ...frontmatter, '---', '', `# ${title}`, '', summary, ''].join('\n');
}

function showDraft() {
  if (!validate()) return;

  preview.value = buildMarkdown();
  copy.disabled = false;
  download.disabled = false;
  draftStatus.textContent = 'Your Markdown draft is ready.';
  preview.focus();
}

addOptions(fields.place, places);
addOptions(fields.category, categories);
restoreDraft();
generate.disabled = false;

form.addEventListener('input', event => {
  event.target.setCustomValidity('');
  fields.expires.setCustomValidity('');
  saveDraft();

  if (preview.value) {
    preview.value = '';
    copy.disabled = true;
    download.disabled = true;
    draftStatus.textContent = 'Details changed. Create a fresh Markdown draft to export.';
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  showDraft();
});

generate.addEventListener('click', showDraft);

copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preview.value);
    draftStatus.textContent = 'Markdown copied.';
  } catch {
    preview.focus();
    preview.select();
    draftStatus.textContent = 'Markdown is selected. Use your device’s copy shortcut.';
  }
});

download.addEventListener('click', () => {
  const content = new Blob([preview.value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  const slug = fields.title.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
  link.href = url;
  link.download = `${slug || 'straddie-notice'}-draft.md`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  draftStatus.textContent = 'Markdown download started.';
});
