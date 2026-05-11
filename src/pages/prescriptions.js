/**
 * Prescriptions Page
 */

import { store } from '../store.js';
import { fmtDate, esc, fullName, initials, shortId, statusBadgeClass, statusLabel, Icons } from '../utils.js';
import { navigate } from '../router.js';

export function renderPrescriptions(container) {
  const allRxs = [...store.prescriptions()].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let currentSearch = '';
  let currentStatus = '';

  function getFiltered() {
    let list = allRxs;
    if (currentStatus) list = list.filter(r => r.status === currentStatus);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(r => {
        const p = store.getPatient(r.patientId);
        const drugs = (r.items ?? []).map(i => i.drug?.name ?? '').join(' ').toLowerCase();
        return fullName(p).toLowerCase().includes(q) || drugs.includes(q);
      });
    }
    return list;
  }

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Ordonnances</h1>
        <p class="page-subtitle">${allRxs.length} ordonnances dans l'export</p>
      </div>

      <!-- Filter bar -->
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-body" style="padding:1rem 1.25rem">
          <div class="filter-bar">
            <div class="input-group" style="flex:1;min-width:200px;max-width:320px">
              <span class="input-icon">${Icons.search}</span>
              <input class="input" id="rx-search" placeholder="Rechercher par patient ou médicament…" />
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              ${['', 'DRAFT', 'SIGNED', 'CANCELLED'].map(s => `
                <button class="btn btn-sm ${s === '' ? 'btn-primary' : 'btn-secondary'} rx-status-filter" data-status="${s}">
                  ${s === '' ? 'Toutes' : statusLabel(s)}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div id="rx-list"></div>
    </div>
  `;

  function renderList() {
    const list = getFiltered();
    const el = document.getElementById('rx-list');
    if (!el) return;

    if (!list.length) {
      el.innerHTML = `<div class="empty-state">${Icons.inbox}
        <div class="empty-state-title">Aucune ordonnance trouvée</div></div>`;
      return;
    }

    el.innerHTML = list.map(rx => {
      const patient = store.getPatient(rx.patientId);
      const items = rx.items ?? [];
      return `
        <div class="prescription-card" style="margin-bottom:1rem">
          <div class="prescription-header">
            <div style="display:flex;align-items:center;gap:0.875rem;flex:1;min-width:0">
              <div class="avatar avatar-sm" style="cursor:pointer" data-patient="${esc(rx.patientId)}">${initials(patient)}</div>
              <div>
                <div class="font-semibold" style="cursor:pointer" data-patient="${esc(rx.patientId)}">${esc(fullName(patient))}</div>
                <div class="text-xs text-muted">${fmtDate(rx.date)} · ${shortId(rx.id)} · ${items.length} médicament${items.length > 1 ? 's' : ''}</div>
              </div>
            </div>
            <span class="badge ${statusBadgeClass(rx.status)}">${statusLabel(rx.status)}</span>
          </div>
          ${items.map(item => `
            <div class="prescription-item">
              <div class="drug-icon">${Icons.pill}</div>
              <div style="flex:1;min-width:0">
                <div class="font-medium">${esc(item.drug?.name ?? '—')}</div>
                ${item.drug?.category?.name ? `<div class="text-xs text-muted">${esc(item.drug.category.name)}</div>` : ''}
                <div class="text-sm text-muted" style="margin-top:0.2rem">
                  Posologie: <b>${esc(item.dosage)}</b> ·
                  Durée: <b>${item.durationDays}j</b> ·
                  Quantité: <b>${item.quantity}</b>
                </div>
                ${item.drug?.contraindications ? `<div class="text-xs text-muted" style="margin-top:0.15rem">⚠ ${esc(item.drug.contraindications)}</div>` : ''}
              </div>
            </div>
          `).join('')}
          ${rx.notes ? `<div style="padding:0.75rem 1.25rem;border-top:1px solid var(--border);font-size:0.875rem;color:var(--muted-foreground)">${esc(rx.notes)}</div>` : ''}
        </div>
      `;
    }).join('');

    // Patient links
    el.querySelectorAll('[data-patient]').forEach(el => {
      el.addEventListener('click', () => navigate(`/patients/${el.dataset.patient}`));
    });
  }

  renderList();

  document.getElementById('rx-search')?.addEventListener('input', e => {
    currentSearch = e.target.value;
    renderList();
  });

  container.querySelectorAll('.rx-status-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatus = btn.dataset.status;
      container.querySelectorAll('.rx-status-filter').forEach(b => {
        b.className = `btn btn-sm ${b.dataset.status === currentStatus ? 'btn-primary' : 'btn-secondary'} rx-status-filter`;
      });
      renderList();
    });
  });
}
