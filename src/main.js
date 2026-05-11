/**
 * DocDocs Reader — App Bootstrap
 */

import { store } from './store.js';
import { initRouter, registerRoute, navigate } from './router.js';
import { renderSidebar, updateSidebarActive } from './sidebar.js';

// Pages
import { renderOpenFile } from './pages/open-file.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderPatients } from './pages/patients.js';
import { renderPatientDetail } from './pages/patient-detail.js';
import { renderAppointments } from './pages/appointments.js';
import { renderPrescriptions } from './pages/prescriptions.js';
import { renderFinances } from './pages/finances.js';
import { renderActs } from './pages/acts.js';
import { renderDrugs } from './pages/drugs.js';
import { renderGroups } from './pages/groups.js';
import { renderWaiting } from './pages/waiting.js';
import { renderExpenses } from './pages/expenses.js';

// Default: dark mode
document.documentElement.classList.add('dark');

const openFileScreen = document.getElementById('open-file-screen');
const shell = document.getElementById('shell');

// Show open file screen first
renderOpenFile(openFileScreen, onDataLoaded);

function onDataLoaded() {
  // Hide open file screen, show shell
  openFileScreen.classList.add('hidden');
  shell.classList.remove('hidden');

  // Register routes
  registerRoute('/dashboard',      () => { updateSidebarActive(); renderDashboard(getMain()); });
  registerRoute('/patients',       () => { updateSidebarActive(); renderPatients(getMain()); });
  registerRoute('/patients/:id',   (p) => { updateSidebarActive(); renderPatientDetail(getMain(), p.id); });
  registerRoute('/appointments',   () => { updateSidebarActive(); renderAppointments(getMain()); });
  registerRoute('/prescriptions',  () => { updateSidebarActive(); renderPrescriptions(getMain()); });
  registerRoute('/finances',       () => { updateSidebarActive(); renderFinances(getMain()); });
  registerRoute('/expenses',       () => { updateSidebarActive(); renderExpenses(getMain()); });
  registerRoute('/acts',           () => { updateSidebarActive(); renderActs(getMain()); });
  registerRoute('/drugs',          () => { updateSidebarActive(); renderDrugs(getMain()); });
  registerRoute('/groups',         () => { updateSidebarActive(); renderGroups(getMain()); });
  registerRoute('/waiting',        () => { updateSidebarActive(); renderWaiting(getMain()); });

  // Render sidebar
  renderSidebar();

  // Navigate to dashboard
  initRouter();
  navigate('/dashboard');
}

function getMain() {
  return document.getElementById('main-content');
}
