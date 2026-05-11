/**
 * Finances Page — monthly revenue chart + expense table
 */

import { store } from '../store.js';
import { fmtDate, fmtDH, esc, monthLabel, lastNMonths, Icons } from '../utils.js';

export function renderFinances(container) {
  const totalRevenue  = store.getTotalRevenue();
  const totalExpenses = store.getTotalExpenses();
  const balance       = totalRevenue - totalExpenses;

  const revenueMap  = store.getMonthlyRevenue();
  const expenseMap  = store.getMonthlyExpenses();
  const months      = lastNMonths(12);

  const revenueData  = months.map(m => revenueMap[m]  ?? 0);
  const expenseData  = months.map(m => expenseMap[m]  ?? 0);
  const monthLabels  = months.map(monthLabel);

  const statCards = [
    { label: 'Total Recettes',  value: fmtDH(totalRevenue),  iconClass: 'icon-emerald', icon: Icons.dollarSign },
    { label: 'Total Dépenses',  value: fmtDH(totalExpenses), iconClass: 'icon-red',     icon: Icons.trendingDown },
    { label: 'Balance nette',   value: fmtDH(balance),
      iconClass: balance >= 0 ? 'icon-cyan' : 'icon-red', icon: Icons.activity },
  ];

  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Finances</h1>
        <p class="page-subtitle">Analyse des recettes et dépenses de l'export</p>
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);max-width:800px;margin-bottom:1.5rem">
        ${statCards.map(s => `
          <div class="stat-card">
            <div class="stat-card-info">
              <div class="stat-card-label">${esc(s.label)}</div>
              <div class="stat-card-value" style="font-size:1.25rem">${esc(s.value)}</div>
            </div>
            <div class="stat-card-icon ${s.iconClass}">${s.icon}</div>
          </div>
        `).join('')}
      </div>

      <!-- Chart -->
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-header">
          <div>
            <div class="card-title">Recettes & Dépenses mensuelles</div>
            <div class="card-subtitle">12 derniers mois</div>
          </div>
          <div style="display:flex;gap:1rem;align-items:center;font-size:0.8125rem">
            <span style="display:flex;align-items:center;gap:0.4rem">
              <span style="width:10px;height:10px;border-radius:2px;background:#06b6d4;display:inline-block"></span>Recettes
            </span>
            <span style="display:flex;align-items:center;gap:0.4rem">
              <span style="width:10px;height:10px;border-radius:2px;background:#ef4444;display:inline-block"></span>Dépenses
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-wrapper">
            <canvas id="finances-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="finances-grid">
        <!-- Expense list -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Dépenses</div>
            <span class="text-muted text-sm">${store.expenses().length} entrées</span>
          </div>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr><th>Titre</th><th>Date</th><th>Montant</th></tr>
              </thead>
              <tbody>
                ${store.expenses().length === 0
                  ? `<tr><td colspan="3"><div class="empty-state">${Icons.inbox}<div class="empty-state-title">Aucune dépense</div></div></td></tr>`
                  : [...store.expenses()]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(e => `<tr>
                        <td>
                          <div class="font-medium">${esc(e.title)}</div>
                          ${e.description ? `<div class="text-xs text-muted">${esc(e.description)}</div>` : ''}
                        </td>
                        <td class="text-muted">${fmtDate(e.date)}</td>
                        <td class="text-danger font-semibold">${fmtDH(e.amount)}</td>
                      </tr>`).join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recurring expenses -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Charges récurrentes</div>
            <span class="text-muted text-sm">${store.recurringExpenses().length} entrées</span>
          </div>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr><th>Titre</th><th>Fréquence</th><th>Montant</th></tr>
              </thead>
              <tbody>
                ${store.recurringExpenses().length === 0
                  ? `<tr><td colspan="3"><div class="empty-state">${Icons.inbox}<div class="empty-state-title">Aucune charge récurrente</div></div></td></tr>`
                  : store.recurringExpenses().map(e => `<tr>
                      <td>
                        <div class="font-medium">${esc(e.title)}</div>
                        ${e.description ? `<div class="text-xs text-muted">${esc(e.description)}</div>` : ''}
                      </td>
                      <td class="text-muted text-sm">${esc(e.frequency)} × ${e.interval}</td>
                      <td class="text-danger font-semibold">${fmtDH(e.amount)}</td>
                    </tr>`).join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // ─── Chart.js ────────────────────────────────────────────────
  loadChartJs().then(Chart => {
    const canvas = document.getElementById('finances-chart');
    if (!canvas) return;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor  = isDark ? '#a3a3a3' : '#737373';

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Recettes (DH)',
            data: revenueData,
            backgroundColor: 'rgba(6,182,212,0.7)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Dépenses (DH)',
            data: expenseData,
            backgroundColor: 'rgba(239,68,68,0.6)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('fr-FR')} DH`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Outfit' } },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Outfit' },
              callback: v => `${v.toLocaleString('fr-FR')} DH`,
            },
          },
        },
      },
    });
  });
}

let chartJsPromise = null;
function loadChartJs() {
  if (chartJsPromise) return chartJsPromise;
  chartJsPromise = new Promise((resolve) => {
    if (window.Chart) { resolve(window.Chart); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = () => resolve(window.Chart);
    document.head.appendChild(script);
  });
  return chartJsPromise;
}
