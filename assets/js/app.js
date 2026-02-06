async function loadData() {
  try {
    const response = await fetch('./ImportData/data.csv');
    const csvText = await response.text();
    window.data = parseCSV(csvText);
  } catch (e) {
    window.data = [];
  }
}

function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  const separator = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(separator).map(h =>
    h.trim().replace(/\uFEFF/g, '')
  );

  return lines.slice(1).map(line => {
    const values = line.split(separator);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

const searchInput = document.getElementById('search');
const table = document.getElementById('resultTable');
const tbody = table.querySelector('tbody');

searchInput.addEventListener('input', () => {
  const value = searchInput.value.trim();
  tbody.innerHTML = '';

  if (!value || !window.data.length) {
    table.style.display = 'none';
    return;
  }

  const results = window.data.filter(r =>
    r.NUM_LIGACAO === value
  );

  results.forEach(r => {
    const mapLink =
      r.LATITUDE && r.LONGITUDE
        ? `https://www.google.com/maps?q=${r.LATITUDE},${r.LONGITUDE}`
        : '#';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.NUM_LIGACAO || '-'}</td>
      <td>${r.NOME_CLIENTE || '-'}</td>
      <td>${r.ENDERECO_COMPLETO || '-'}</td>
      <td>
        <a href="${mapLink}" target="_blank">Ver no mapa</a>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.style.display = results.length ? 'table' : 'none';
});

loadData();
