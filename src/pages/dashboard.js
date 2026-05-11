/**
 * Dashboard Page
 */

import { store } from '../store.js';
import { fmtDate, fmtDH, fmtDateTime, statusBadgeClass, statusLabel, esc, fullName, initials, Icons } from '../utils.js';

export function renderDashboard(container) {
  const stats = store.getDashboardStats();
  const recentAppts = store.getRecentAppointments(8);

  const statCards = [
    {
      label: 'Patients',
      value: stats.totalPatients,
      icon: Icons.users,
      iconClass: 'icon-cyan',
      sub: 'Total enregistrés',
    },
    {
      label: 'Rendez-vous',
      value: stats.totalAppointments,
      icon: Icons.calendar,
      iconClass: 'icon-orange',
      sub: "Total dans l'export",
    },
    {
      label: "Aujourd'hui",
      value: stats.todayAppointments,
      icon: Icons.clock,
      iconClass: 'icon-blue',
      sub: 'Rendez-vous du jour',
    },
    {
      label: 'Recettes',
      value: fmtDH(stats.totalRevenue),
      icon: Icons.dollarSign,
      iconClass: 'icon-emerald',
      sub: 'Montant total payé',
    },
    {
      label: 'Dépenses',
      value: fmtDH(stats.totalExpenses),
      icon: Icons.trendingDown,
      iconClass: 'icon-red',
      sub: 'Total dépenses',
    },
  ];

  const statsHTML = statCards.map(s => `
    <div class="stat-card">
      <div class="stat-card-info">
        <div class="stat-card-label">${esc(s.label)}</div>
        <div class="stat-card-value">${esc(String(s.value))}</div>
        <div class="stat-card-sub">${esc(s.sub)}</div>
      </div>
      <div class="stat-card-icon ${s.iconClass}">${s.icon}</div>
    </div>
  `).join('');

  const apptRowsHTML = recentAppts.length === 0
    ? `<tr><td colspan="5"><div class="empty-state" style="padding:2rem">
        ${Icons.inbox}<div class="empty-state-text">Aucun rendez-vous</div></div></td></tr>`
    : recentAppts.map(a => {
        const patient = store.getPatient(a.patientId);
        return `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <div class="avatar avatar-sm">${initials(patient)}</div>
              <span class="font-medium">${esc(fullName(patient))}</span>
            </div>
          </td>
          <td class="text-muted">${fmtDateTime(a.startTime)}</td>
          <td class="text-muted">${esc(a.type ?? '—')}</td>
          <td><span class="badge ${statusBadgeClass(a.status)}">${statusLabel(a.status)}</span></td>
          <td class="text-muted text-xs">${esc(a.notes ?? '')}</td>
        </tr>`;
      }).join('');

  // Clinic info card
  const clinic = store.clinic();
  const clinicHTML = clinic ? `
    <div class="card" style="margin-bottom:1.5rem">
      <div class="card-header">
        <div>
          <div class="card-title">${esc(clinic.name)}</div>
          <div class="card-subtitle">Informations du cabinet</div>
        </div>
        <span class="badge badge-active">Actif</span>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">
          ${clinic.phone   ? `<div><div class="text-xs text-muted">Téléphone</div><div class="font-medium">${esc(clinic.phone)}</div></div>` : ''}
          ${clinic.email   ? `<div><div class="text-xs text-muted">Email</div><div class="font-medium">${esc(clinic.email)}</div></div>` : ''}
          ${clinic.address ? `<div><div class="text-xs text-muted">Adresse</div><div class="font-medium">${esc(clinic.address)}</div></div>` : ''}
          ${clinic.ice     ? `<div><div class="text-xs text-muted">ICE</div><div class="font-medium">${esc(clinic.ice)}</div></div>` : ''}
        </div>
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Tableau de Bord</h1>
        <p class="page-subtitle">
          Export du ${fmtDate(store.exportedAt())} · ${store.patients().length} patients · ${store.visits().length} visites
        </p>
      </div>

      ${clinicHTML}

      <div class="stats-grid">${statsHTML}</div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Derniers rendez-vous</div>
            <div class="card-subtitle">8 plus récents de l'export</div>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Heure</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>${apptRowsHTML}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
