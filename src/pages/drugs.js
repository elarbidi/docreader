/**
 * Drugs Page — deduplicated drug list from prescriptions
 */

import { store } from '../store.js';
import { esc, Icons } from '../utils.js';

export function renderDrugs(container) {
  const drugs = store.getAllDrugs();

  // Group by category
  const byCategory = {};
  for (const drug of drugs) {
    const catName = drug.category?.name ?? 'Sans catégorie';
    if (!byCategory[catName]) byCategory[catName] = [];
    byCategory[catName].push(drug);
  }

  const catNames = Object.keys(byCategory).sort((a, b) => a.localeCompare(b, 'fr'));

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Médicaments</h1>
        <p class="page-subtitle">${drugs.length} médicaments extraits des ordonnances</p>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="input-group" style="max-width:320px">
            <span class="input-icon">${Icons.search}</span>
            <input class="input" id="drug-search" placeholder="Rechercher un médicament…" />
          </div>
        </div>
        <div id="drugs-list">
          ${renderDrugsList(catNames, byCategory)}
        </div>
      </div>
    </div>
  `;

  document.getElementById('drug-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      document.getElementById('drugs-list').innerHTML = renderDrugsList(catNames, byCategory);
      return;
    }
    const filtered = drugs.filter(d => d.name.toLowerCase().includes(q) || (d.description ?? '').toLowerCase().includes(q));
    document.getElementById('drugs-list').innerHTML = filtered.length === 0
      ? `<div class="empty-state">${Icons.inbox}<div class="empty-state-title">Aucun médicament trouvé</div></div>`
      : `<table class="table"><thead><tr><th>Médicament</th><th>Catégorie</th><th>Description</th><th>Contre-indications</th></tr></thead>
          <tbody>${filtered.map(d => drugRow(d)).join('')}</tbody></table>`;
  });
}

function renderDrugsList(catNames, byCategory) {
  if (catNames.length === 0) {
    return `<div class="empty-state">${Icons.inbox}<div class="empty-state-title">Aucun médicament dans l'export</div></div>`;
  }

  return catNames.map(cat => `
    <div class="drug-category-header">${esc(cat)} (${byCategory[cat].length})</div>
    <table class="table">
      <tbody>
        ${byCategory[cat].map(d => drugRow(d)).join('')}
      </tbody>
    </table>
  `).join('');
}

function drugRow(d) {
  return `<tr>
    <td>
      <div style="display:flex;align-items:center;gap:0.75rem">
        <div class="drug-icon">${Icons.pill}</div>
        <span class="font-medium">${esc(d.name)}</span>
      </div>
    </td>
    <td class="text-muted">${esc(d.category?.name ?? '—')}</td>
    <td class="text-muted text-sm" style="max-width:220px">${esc(d.description ?? '—')}</td>
    <td class="text-muted text-sm" style="max-width:220px">${d.contraindications ? `<span style="color:var(--color-warning)">⚠ ${esc(d.contraindications)}</span>` : '—'}</td>
  </tr>`;
}
