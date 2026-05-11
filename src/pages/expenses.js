/**
 * Expenses Page — mirrors Finances but focused on expense detail
 */

import { store } from '../store.js';
import { fmtDate, fmtDH, esc, shortId, frequencyLabel, Icons } from '../utils.js';

export function renderExpenses(container) {
  const expenses   = [...store.expenses()].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recurring  = store.recurringExpenses();
  const total      = store.getTotalExpenses();

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Dépenses</h1>
        <p class="page-subtitle">Total: ${fmtDH(total)} · ${expenses.length} dépenses + ${recurring.length} récurrentes</p>
      </div>

      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-header">
          <div class="card-title">Dépenses ponctuelles</div>
          <span class="text-muted text-sm">${expenses.length} entrées</span>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr><th>Titre</th><th>Description</th><th>Date</th><th>Montant</th><th>Réf.</th></tr>
            </thead>
            <tbody>
              ${expenses.length === 0
                ? `<tr><td colspan="5"><div class="empty-state">${Icons.inbox}
                    <div class="empty-state-title">Aucune dépense</div></div></td></tr>`
                : expenses.map(e => `<tr>
                    <td class="font-medium">${esc(e.title)}</td>
                    <td class="text-muted text-sm">${esc(e.description ?? '—')}</td>
                    <td class="text-muted">${fmtDate(e.date)}</td>
                    <td class="text-danger font-semibold">${fmtDH(e.amount)}</td>
                    <td class="text-xs text-muted">${shortId(e.id)}</td>
                  </tr>`).join('')
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Charges récurrentes</div>
          <span class="text-muted text-sm">${recurring.length} entrées</span>
        </div>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr><th>Titre</th><th>Fréquence</th><th>Intervalle</th><th>Montant</th><th>Début</th><th>Fin</th></tr>
            </thead>
            <tbody>
              ${recurring.length === 0
                ? `<tr><td colspan="6"><div class="empty-state">${Icons.inbox}
                    <div class="empty-state-title">Aucune charge récurrente</div></div></td></tr>`
                : recurring.map(e => `<tr>
                    <td>
                      <div class="font-medium">${esc(e.title)}</div>
                      ${e.description ? `<div class="text-xs text-muted">${esc(e.description)}</div>` : ''}
                    </td>
                    <td class="text-muted">${frequencyLabel(e.frequency)}</td>
                    <td class="text-muted">× ${e.interval}</td>
                    <td class="text-danger font-semibold">${fmtDH(e.amount)}</td>
                    <td class="text-muted">${fmtDate(e.startDate)}</td>
                    <td class="text-muted">${fmtDate(e.endDate)}</td>
                  </tr>`).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
