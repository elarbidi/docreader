/**
 * Salle d'Attente — real-time data not in export
 */

import { Icons } from '../utils.js';

export function renderWaiting(container) {
  container.innerHTML = `
    <div class="page-container animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Salle d'Attente</h1>
        <p class="page-subtitle">Données en temps réel</p>
      </div>

      <div class="realtime-notice">
        <div class="realtime-notice-icon">${Icons.alertCircle}</div>
        <div class="empty-state-title">Données en temps réel non disponibles</div>
        <div class="empty-state-text" style="max-width:400px">
          La salle d'attente est gérée en temps réel dans l'application DocDocs principale.<br>
          Ces données ne sont pas incluses dans le fichier d'export de sauvegarde.
        </div>
        <div class="text-xs text-muted" style="margin-top:0.5rem">
          Modèle <code>WaitingEntry</code> non exporté.
        </div>
      </div>
    </div>
  `;
}
