/**
 * Acts & Tarifs Page
 */

import { store } from '../store.js';
import { fmtDH, esc, shortId, Icons } from '../utils.js';

export function renderActs(container) {
  const acts = [...store.acts()].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Actes & Tarifs</h1>
        <p class="page-subtitle">${acts.length} actes configurés</p>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Liste des actes</div>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix par défaut</th>
                <th>Description</th>
                <th>Champs personnalisés</th>
                <th>Réf.</th>
              </tr>
            </thead>
            <tbody>
              ${acts.length === 0
                ? `<tr><td colspan="5"><div class="empty-state">${Icons.inbox}
                    <div class="empty-state-title">Aucun acte configuré</div></div></td></tr>`
                : acts.map(act => {
                    const fields = act.fields ?? [];
                    const fieldsHTML = fields.length === 0
                      ? '<span class="text-muted text-xs">—</span>'
                      : `<div class="act-fields">${fields
                          .sort((a, b) => a.order - b.order)
                          .map(f => `
                            <div class="act-field-chip">
                              ${f.required ? '* ' : ''}${esc(f.label)}
                              <span class="type">${esc(f.type)}</span>
                            </div>`)
                          .join('')}
                        </div>`;
                    return `<tr>
                      <td class="font-semibold">${esc(act.name)}</td>
                      <td class="text-success font-medium">${act.defaultPrice != null ? fmtDH(act.defaultPrice) : '—'}</td>
                      <td class="text-muted text-sm" style="max-width:220px">${esc(act.description ?? '—')}</td>
                      <td>${fieldsHTML}</td>
                      <td class="text-xs text-muted">${shortId(act.id)}</td>
                    </tr>`;
                  }).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
