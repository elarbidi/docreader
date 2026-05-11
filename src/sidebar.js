/**
 * DocDocs Reader — Sidebar
 */

import { store } from './store.js';
import { Icons, esc } from './utils.js';
import { navigate, getCurrentRoute } from './router.js';

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: 'dashboard',    label: 'Tableau de Bord', icon: 'layoutDashboard', route: '/dashboard' },
      { id: 'waiting',      label: "Salle d'Attente",  icon: 'clock',           route: '/waiting' },
      { id: 'appointments', label: 'Agenda',            icon: 'calendar',        route: '/appointments' },
      { id: 'patients',     label: 'Patients',          icon: 'users',           route: '/patients' },
      { id: 'prescriptions',label: 'Ordonnances',       icon: 'fileText',        route: '/prescriptions' },
    ],
  },
  {
    label: 'Finances',
    items: [
      { id: 'finances', label: 'Finances', icon: 'dollarSign',  route: '/finances' },
      { id: 'expenses', label: 'Dépenses', icon: 'trendingDown', route: '/expenses' },
    ],
  },
  {
    label: 'Référence',
    items: [
      { id: 'acts',   label: 'Actes & Tarifs', icon: 'stethoscope', route: '/acts' },
      { id: 'drugs',  label: 'Médicaments',    icon: 'pill',        route: '/drugs' },
      { id: 'groups', label: 'Groupes',        icon: 'tag',         route: '/groups' },
    ],
  },
];

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const clinic = store.clinic();
  const isDark = document.documentElement.classList.contains('dark');
  const hash = window.location.hash.replace('#', '') || '/dashboard';
  // normalize route to first segment for active matching
  const activeBase = '/' + (hash.split('/')[1] || 'dashboard');

  const groupsHTML = NAV_GROUPS.map(group => {
    const itemsHTML = group.items.map(item => {
      const isActive = activeBase === item.route;
      return `
        <button
          class="nav-item${isActive ? ' active' : ''}"
          data-route="${item.route}"
          id="nav-${item.id}"
        >
          ${Icons[item.icon] ?? ''}
          <span>${esc(item.label)}</span>
        </button>`;
    }).join('');

    const labelHTML = group.label
      ? `<div class="nav-group-label">${esc(group.label)}</div>`
      : '';

    return `<div class="nav-group">${labelHTML}${itemsHTML}</div>`;
  }).join('');

  sidebar.innerHTML = `
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        ${Icons.activity}
      </div>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-name">DocDocs</div>
        <div class="sidebar-brand-clinic">${esc(clinic?.name ?? 'Lecteur')}</div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav" id="sidebar-nav">
      ${groupsHTML}
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-footer-info">
        <div class="sidebar-footer-name">Mode Lecture</div>
        <div class="sidebar-footer-meta">Export hors ligne</div>
      </div>
      <button class="sidebar-theme-btn" id="theme-toggle" title="Basculer thème">
        ${isDark ? Icons.sun : Icons.moon}
      </button>
    </div>
  `;

  // Bind nav clicks
  sidebar.querySelectorAll('.nav-item[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.route);
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    renderSidebar(); // re-render to swap icon
  });
}

/** Call after each route change to update active state */
export function updateSidebarActive() {
  const hash = window.location.hash.replace('#', '') || '/dashboard';
  const activeBase = '/' + (hash.split('/')[1] || 'dashboard');

  document.querySelectorAll('.nav-item[data-route]').forEach(btn => {
    const route = btn.dataset.route;
    btn.classList.toggle('active', route === activeBase);
  });
}
