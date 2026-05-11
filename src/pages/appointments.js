/**
 * Appointments Page
 */

import { store } from '../store.js';
import { fmtDateTime, esc, fullName, initials, shortId, statusBadgeClass, statusLabel, Icons } from '../utils.js';
import { navigate } from '../router.js';

export function renderAppointments(container) {
  const allAppts = [...store.appointments()].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  const STATUSES = ['', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  let currentStatus = '';
  let currentSearch = '';

  function getFiltered() {
    let list = allAppts;
    if (currentStatus) list = list.filter(a => a.status === currentStatus);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(a => {
        const p = store.getPatient(a.patientId);
        return fullName(p).toLowerCase().includes(q) ||
          (a.type ?? '').toLowerCase().includes(q) ||
          (a.notes ?? '').toLowerCase().includes(q);
      });
    }
    return list;
  }

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Agenda</h1>
        <p class="page-subtitle">${allAppts.length} rendez-vous dans l'export</p>
      </div>

      <!-- Filter bar -->
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-body" style="padding:1rem 1.25rem">
          <div class="filter-bar">
            <div class="input-group" style="flex:1;min-width:200px;max-width:320px">
              <span class="input-icon">${Icons.search}</span>
              <input class="input" id="appt-search" placeholder="Rechercher patient, type…" />
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              ${STATUSES.map(s => `
                <button class="btn btn-sm ${s === '' ? 'btn-primary' : 'btn-secondary'} status-filter" data-status="${s}">
                  ${s === '' ? 'Tous' : statusLabel(s)}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Heure</th>
                <th>Fin</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Notes</th>
                <th>Réf.</th>
              </tr>
            </thead>
            <tbody id="appt-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  function renderRows() {
    const list = getFiltered();
    const tbody = document.getElementById('appt-tbody');
    if (!tbody) return;

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">${Icons.inbox}
        <div class="empty-state-title">Aucun rendez-vous trouvé</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(a => {
      const patient = store.getPatient(a.patientId);
      return `<tr style="cursor:pointer" class="appt-row" data-patient="${esc(a.patientId)}">
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <div class="avatar avatar-sm">${initials(patient)}</div>
            <span class="font-medium">${esc(fullName(patient))}</span>
          </div>
        </td>
        <td class="font-medium">${fmtDateTime(a.startTime)}</td>
        <td class="text-muted">${fmtDateTime(a.endTime)}</td>
        <td class="text-muted">${esc(a.type ?? '—')}</td>
        <td><span class="badge ${statusBadgeClass(a.status)}">${statusLabel(a.status)}</span></td>
        <td class="text-muted text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(a.notes ?? '—')}</td>
        <td class="text-xs text-muted">${shortId(a.id)}</td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('.appt-row').forEach(row => {
      row.addEventListener('click', () => navigate(`/patients/${row.dataset.patient}`));
    });
  }

  renderRows();

  document.getElementById('appt-search')?.addEventListener('input', e => {
    currentSearch = e.target.value;
    renderRows();
  });

  container.querySelectorAll('.status-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatus = btn.dataset.status;
      container.querySelectorAll('.status-filter').forEach(b => {
        b.className = `btn btn-sm ${b.dataset.status === currentStatus ? 'btn-primary' : 'btn-secondary'} status-filter`;
      });
      renderRows();
    });
  });
}
