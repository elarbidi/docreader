/**
 * Patients Page — searchable table with group filter
 */

import { store } from '../store.js';
import { fmtDate, esc, fullName, initials, shortId, groupPill, Icons } from '../utils.js';
import { navigate } from '../router.js';

export function renderPatients(container) {
  const groups = store.patientGroups();

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Patients</h1>
        <p class="page-subtitle">${store.patients().length} patients enregistrés</p>
      </div>

      <!-- Filter bar -->
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-body" style="padding:1rem 1.25rem">
          <div class="filter-bar">
            <div class="input-group" style="flex:1;min-width:200px;max-width:360px">
              <span class="input-icon">${Icons.search}</span>
              <input class="input" id="patient-search" placeholder="Rechercher par nom, email, CIN…" />
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
              <button class="group-pill active-filter" data-group="" style="background:var(--color-brand-main);color:#fff;border-color:var(--color-brand-main)">
                Tous
              </button>
              ${groups.map(g => `
                <button class="group-pill active-filter" data-group="${esc(g.id)}"
                  style="background:${g.color}15;border-color:${g.color}55;color:${g.color}">
                  ${esc(g.name)}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="table-wrapper">
          <table class="table" id="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Groupe</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Date de naissance</th>
                <th>Inscrit le</th>
                <th>Réf.</th>
              </tr>
            </thead>
            <tbody id="patients-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  let currentGroup = '';
  let currentSearch = '';

  function getFilteredPatients() {
    let list = currentSearch
      ? store.searchPatients(currentSearch)
      : store.patients();
    if (currentGroup) {
      list = list.filter(p => p.groupId === currentGroup);
    }
    return list;
  }

  function renderRows() {
    const list = getFilteredPatients();
    const tbody = document.getElementById('patients-tbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">
        <div class="empty-state">
          ${Icons.inbox}
          <div class="empty-state-title">Aucun patient trouvé</div>
        </div>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => {
      const group = p.groupId ? store.getPatientGroup(p.groupId) : null;
      return `<tr class="patient-row" data-id="${esc(p.id)}" style="cursor:pointer">
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <div class="avatar avatar-sm">${initials(p)}</div>
            <div>
              <div class="font-medium">${esc(fullName(p))}</div>
              ${p.cin ? `<div class="text-xs text-muted">${esc(p.cin)}</div>` : ''}
            </div>
          </div>
        </td>
        <td>${group ? groupPill(group) : '<span class="text-muted">—</span>'}</td>
        <td class="text-muted">${esc(p.phone ?? '—')}</td>
        <td class="text-muted">${esc(p.email ?? '—')}</td>
        <td class="text-muted">${fmtDate(p.dateOfBirth)}</td>
        <td class="text-muted">${fmtDate(p.createdAt)}</td>
        <td class="text-xs text-muted">${shortId(p.id)}</td>
      </tr>`;
    }).join('');

    // Row click → patient detail
    tbody.querySelectorAll('.patient-row').forEach(row => {
      row.addEventListener('click', () => {
        navigate(`/patients/${row.dataset.id}`);
      });
    });
  }

  renderRows();

  // Search
  document.getElementById('patient-search')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderRows();
  });

  // Group filter buttons
  container.querySelectorAll('.active-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      currentGroup = btn.dataset.group;
      // Visual active state
      container.querySelectorAll('.active-filter').forEach(b => {
        b.style.background = b.dataset.group
          ? (store.getPatientGroup(b.dataset.group)?.color ?? '#000') + '15'
          : 'var(--muted)';
        b.style.color = b.dataset.group
          ? (store.getPatientGroup(b.dataset.group)?.color ?? '#000')
          : 'var(--muted-foreground)';
        b.style.borderColor = b.dataset.group
          ? (store.getPatientGroup(b.dataset.group)?.color ?? '#000') + '55'
          : 'var(--border)';
      });
      if (!currentGroup) {
        btn.style.background = 'var(--color-brand-main)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--color-brand-main)';
      } else {
        btn.style.background = (store.getPatientGroup(currentGroup)?.color ?? '#000');
        btn.style.color = '#fff';
        btn.style.borderColor = (store.getPatientGroup(currentGroup)?.color ?? '#000');
      }
      renderRows();
    });
  });
}
