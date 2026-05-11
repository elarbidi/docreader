/**
 * Groups Page
 */

import { store } from '../store.js';
import { esc, Icons } from '../utils.js';
import { navigate } from '../router.js';

export function renderGroups(container) {
  const groups = store.patientGroups();

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Groupes de patients</h1>
        <p class="page-subtitle">${groups.length} groupes configurés</p>
      </div>

      ${groups.length === 0
        ? `<div class="empty-state">${Icons.inbox}
            <div class="empty-state-title">Aucun groupe configuré</div>
            <div class="empty-state-text">Les groupes permettent de segmenter vos patients</div>
          </div>`
        : `<div class="groups-grid" id="groups-grid">
            ${groups.map(g => {
              const patients = store.getPatientsByGroup(g.id);
              const color = g.color ?? '#6366f1';
              return `
                <div class="group-card">
                  <div class="group-card-header">
                    <div class="group-color-dot" style="background:${color}"></div>
                    <div style="flex:1;min-width:0">
                      <div class="font-semibold">${esc(g.name)}</div>
                      ${g.description ? `<div class="text-xs text-muted">${esc(g.description)}</div>` : ''}
                    </div>
                    <span class="badge" style="background:${color}15;color:${color};border:1px solid ${color}55">
                      ${patients.length} patient${patients.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  ${patients.length > 0 ? `
                    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.25rem">
                      ${patients.slice(0, 6).map(p => `
                        <button class="btn btn-ghost btn-sm patient-link" data-id="${esc(p.id)}"
                          style="font-size:0.75rem;padding:0.25rem 0.625rem;height:auto">
                          ${esc(p.firstName)} ${esc(p.lastName)}
                        </button>
                      `).join('')}
                      ${patients.length > 6 ? `<span class="text-xs text-muted" style="display:flex;align-items:center">+${patients.length - 6} autres</span>` : ''}
                    </div>
                  ` : '<div class="text-xs text-muted" style="margin-top:0.25rem">Aucun patient dans ce groupe</div>'}

                  <div style="padding-top:0.75rem;border-top:1px solid var(--border);margin-top:0.5rem">
                    <div style="display:flex;align-items:center;justify-content:space-between">
                      <div class="group-pill" style="background:${color}15;border-color:${color}55;color:${color};border:1px solid ${color}55">
                        ${esc(g.name)}
                      </div>
                      <button class="btn btn-ghost btn-sm view-group-btn" data-group="${esc(g.id)}" style="font-size:0.8125rem">
                        Voir tous →
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>`
      }
    </div>
  `;

  // Patient name links
  container.querySelectorAll('.patient-link[data-id]').forEach(btn => {
    btn.addEventListener('click', () => navigate(`/patients/${btn.dataset.id}`));
  });

  // "Voir tous" button → navigate to patients filtered by group
  container.querySelectorAll('.view-group-btn[data-group]').forEach(btn => {
    btn.addEventListener('click', () => navigate('/patients'));
  });
}
