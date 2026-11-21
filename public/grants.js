const form = document.querySelector('#grants-model');
const estimate = document.querySelector('#estimate-budget');
const yearsField = document.querySelector('#budget-years');
const amountFields = Array.from(form.querySelectorAll('.grants-money'));
const results = document.querySelector('#budget-results');
const placeholder = document.querySelector('#budget-placeholder');
const status = document.querySelector('#budget-status');
const totals = {
  capital: document.querySelector('#budget-capital-total'),
  operating: document.querySelector('#budget-operating-total'),
  reserve: document.querySelector('#budget-reserve-total'),
  annual: document.querySelector('#budget-annual-total'),
  total: document.querySelector('#budget-total'),
};
const barParts = ['capital', 'operating', 'reserve'].map(name => document.querySelector(`#budget-${name}-bar`));
const period = document.querySelector('#budget-period');
const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

function hideResults(message) {
  results.hidden = true;
  placeholder.hidden = false;
  status.textContent = message;
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const years = yearsField.valueAsNumber;
  const amounts = amountFields.map(field => field.value ? Math.round(field.valueAsNumber * 100) : 0);
  const [displays, kiosks, sharedSetup, staffing, running, annualReserve] = amounts;
  const capital = displays + kiosks + sharedSetup;
  const operating = (staffing + running) * years;
  const reserve = annualReserve * years;
  const annual = staffing + running + annualReserve;
  const total = capital + operating + reserve;

  if (!Number.isSafeInteger(years) || years < 1 || !Number.isSafeInteger(total)) {
    hideResults('Check the amounts and use a whole number of years. The estimate is outside the calculation range.');
    return;
  }
  if (total === 0) {
    hideResults('Enter at least one cash cost to build an estimate.');
    return;
  }

  for (const [name, amount] of Object.entries({ capital, operating, reserve, annual, total })) {
    totals[name].textContent = currency.format(amount / 100);
  }
  [capital, operating, reserve].forEach((amount, index) => {
    barParts[index].hidden = amount === 0;
    barParts[index].style.flexGrow = String(amount / total);
  });
  period.textContent = `Over ${years} ${years === 1 ? 'year' : 'years'}, in current Australian dollars.`;
  placeholder.hidden = true;
  results.hidden = false;
  status.textContent = `Funding estimate ready. Total ${currency.format(total / 100)}.`;
});

form.addEventListener('input', () => {
  if (!results.hidden) hideResults('Inputs changed. Estimate the funding again.');
});

estimate.disabled = false;
