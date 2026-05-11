/**
 * Patient Detail Page — timeline of visits, appointments, prescriptions
 */

import { store } from '../store.js';
import {
  fmtDate, fmtDateTime, fmtDH, esc, fullName, initials,
  shortId, statusBadgeClass, statusLabel, groupPill,
  parseActData, Icons,
} from '../utils.js';
import { navigate } from '../router.js';

export function renderPatientDetail(container, patientId) {
  const patient = store.getPatient(patientId);

  if (!patient) {
    container.innerHTML = `<div class="page-container animate-fade-in">
      <button class="back-link" id="back">${Icons.arrowLeft} Retour aux patients</button>
      <div class="empty-state">${Icons.inbox}
        <div class="empty-state-title">Patient introuvable</div>
        <div class="empty-state-text">ID: ${esc(patientId)}</div>
      </div>
    </div>`;
    container.querySelector('#back')?.addEventListener('click', () => navigate('/patients'));
    return;
  }

  const group   = patient.groupId ? store.getPatientGroup(patient.groupId) : null;
  const visits  = store.getVisitsByPatient(patientId);
  const appts   = store.getAppointmentsByPatient(patientId);
  const rxs     = store.getPrescriptionsByPatient(patientId);

  // ─── Info fields ─────────────────────────────────────────────
  const infoFields = [
    ['Genre',           patient.gender ?? '—'],
    ['Date de naissance', fmtDate(patient.dateOfBirth)],
    ['Téléphone',       patient.phone ?? '—'],
    ['Email',           patient.email ?? '—'],
    ['CIN',             patient.cin ?? '—'],
    ['Mutuelle',        patient.mutuelle ?? '—'],
    ['Allergies',       patient.allergies ?? '—'],
    ['Référé par',      patient.referredBy ?? '—'],
    ['Inscrit le',      fmtDate(patient.createdAt)],
    ['Notes',           patient.notes ?? '—'],
  ];

  // ─── Visits tab ───────────────────────────────────────────────
  function visitsHTML() {
    if (!visits.length) return `<div class="empty-state">${Icons.inbox}
      <div class="empty-state-title">Aucune visite</div></div>`;
    return `<div class="timeline">` + visits.map((v, idx) => {
      const act = v.actId ? store.getAct(v.actId) : null;
      const actData = parseActData(v.actData);
      const actFields = Object.entries(actData).map(([label, val]) =>
        `<div class="text-xs text-muted" style="margin-top:0.25rem"><b>${esc(label)}:</b> ${esc(String(val))}</div>`
      ).join('');
      return `
        <div class="timeline-item">
          ${idx < visits.length - 1 ? '<div class="timeline-line"></div>' : ''}
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-date">${fmtDate(v.date)}</div>
            <div class="card" style="margin-top:0.5rem">
              <div class="card-body" style="padding:1rem">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:0.75rem;flex-wrap:wrap">
                  <div>
                    <span class="font-semibold">${esc(act?.name ?? 'Visite')}</span>
                    <span class="text-xs text-muted" style="margin-left:0.5rem">${shortId(v.id)}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
                    <span class="badge ${statusBadgeClass(v.status)}">${statusLabel(v.status)}</span>
                    ${v.paidAmount != null ? `<span class="text-success font-semibold">${fmtDH(v.paidAmount)}</span>` : ''}
                    ${v.totalAmount != null ? `<span class="text-xs text-muted">/ ${fmtDH(v.totalAmount)}</span>` : ''}
                  </div>
                </div>
                ${v.notes ? `<div class="text-sm text-muted">${esc(v.notes)}</div>` : ''}
                ${actFields}
              </div>
            </div>
          </div>
        </div>`;
    }).join('') + '</div>';
  }

  // ─── Appointments tab ─────────────────────────────────────────
  function apptsHTML() {
    if (!appts.length) return `<div class="empty-state">${Icons.inbox}
      <div class="empty-state-title">Aucun rendez-vous</div></div>`;
    return `<div class="table-wrapper"><table class="table">
      <thead><tr><th>Date & Heure</th><th>Type</th><th>Statut</th><th>Notes</th></tr></thead>
      <tbody>${appts.map(a => `<tr>
        <td class="font-medium">${fmtDateTime(a.startTime)}</td>
        <td class="text-muted">${esc(a.type ?? '—')}</td>
        <td><span class="badge ${statusBadgeClass(a.status)}">${statusLabel(a.status)}</span></td>
        <td class="text-muted text-sm">${esc(a.notes ?? '—')}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  }

  // ─── Prescriptions tab ────────────────────────────────────────
  function rxsHTML() {
    if (!rxs.length) return `<div class="empty-state">${Icons.inbox}
      <div class="empty-state-title">Aucune ordonnance</div></div>`;
    return rxs.map(rx => `
      <div class="prescription-card" style="margin-bottom:1rem">
        <div class="prescription-header">
          <div>
            <div class="font-semibold">${fmtDate(rx.date)}</div>
            <div class="text-xs text-muted">${shortId(rx.id)}</div>
          </div>
          <span class="badge ${statusBadgeClass(rx.status)}">${statusLabel(rx.status)}</span>
        </div>
        ${(rx.items ?? []).map(item => `
          <div class="prescription-item">
            <div class="drug-icon">${Icons.pill}</div>
            <div style="flex:1;min-width:0">
              <div class="font-medium">${esc(item.drug?.name ?? '—')}</div>
              <div class="text-xs text-muted">${esc(item.drug?.category?.name ?? '')}</div>
              <div class="text-sm text-muted" style="margin-top:0.25rem">
                ${esc(item.dosage)} · ${item.durationDays}j · Qté ${item.quantity}
              </div>
            </div>
          </div>
        `).join('')}
        ${rx.notes ? `<div style="padding:0.75rem 1.25rem;border-top:1px solid var(--border);font-size:0.875rem;color:var(--muted-foreground)">${esc(rx.notes)}</div>` : ''}
      </div>
    `).join('');
  }

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <button class="back-link" id="back">${Icons.arrowLeft} Retour aux patients</button>

      <!-- Patient header -->
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-body">
          <div style="display:flex;align-items:flex-start;gap:1.25rem;flex-wrap:wrap">
            <div class="avatar avatar-lg" style="font-size:1.25rem">${initials(patient)}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.375rem">
                <h2 style="font-size:1.375rem;font-weight:700">${esc(fullName(patient))}</h2>
                ${group ? groupPill(group, true) : ''}
                <span class="text-xs text-muted">${shortId(patient.id)}</span>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.875rem;margin-top:0.875rem">
                ${infoFields.filter(([,v]) => v !== '—').slice(0, 6).map(([l, v]) => `
                  <div>
                    <div class="text-xs text-muted">${esc(l)}</div>
                    <div class="font-medium text-sm" style="margin-top:0.125rem">${esc(v)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <!-- Quick stats -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap">
              ${[
                ['Visites', visits.length, 'icon-cyan'],
                ['RDV', appts.length, 'icon-orange'],
                ['Ordonnances', rxs.length, 'icon-violet'],
              ].map(([l, v, cls]) => `
                <div style="text-align:center;padding:0.75rem 1rem;background:var(--muted);border-radius:var(--radius-md)">
                  <div class="font-bold text-xl">${v}</div>
                  <div class="text-xs text-muted">${l}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab active" data-tab="visits">Visites (${visits.length})</button>
        <button class="tab" data-tab="appts">Rendez-vous (${appts.length})</button>
        <button class="tab" data-tab="rxs">Ordonnances (${rxs.length})</button>
      </div>

      <div id="tab-content"></div>
    </div>
  `;

  container.querySelector('#back')?.addEventListener('click', () => navigate('/patients'));

  // Tab switcher
  const tabContent = container.querySelector('#tab-content');
  const tabRenderers = {
    visits: visitsHTML,
    appts: apptsHTML,
    rxs: rxsHTML,
  };

  function switchTab(name) {
    container.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === name);
    });
    tabContent.innerHTML = tabRenderers[name]?.() ?? '';
  }

  container.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.tab));
  });

  // Initial render
  switchTab('visits');
}
