/**
 * Open File Page — drag-drop or file picker
 */

import { store } from '../store.js';
import { Icons, esc } from '../utils.js';
import { SAMPLE_DATA } from '../sample-data.js';

const REQUIRED_KEYS = ['exportedAt', 'patients', 'appointments', 'visits'];

export function renderOpenFile(container, onSuccess) {
  // Auto-load demo data when ?demo=1 is in URL (dev only)
  if (new URLSearchParams(window.location.search).get('demo') === '1') {
    store.load(SAMPLE_DATA);
    onSuccess();
    return;
  }

  container.innerHTML = `
    <div class="open-file-screen">
      <div class="open-file-logo">
        ${Icons.database}
      </div>
      <h1 class="open-file-title">DocDocs <span>Reader</span></h1>
      <p class="open-file-subtitle">
        Ouvrez un fichier de sauvegarde DocDocs pour consulter vos données cliniques hors ligne.
      </p>

      <div class="drop-zone" id="drop-zone" tabindex="0" role="button" aria-label="Ouvrir un fichier de sauvegarde">
        <div class="drop-zone-icon">${Icons.upload}</div>
        <div class="drop-zone-text">Glissez-déposez votre fichier ici</div>
        <div class="drop-zone-hint">Fichier docdocs-backup-*.json</div>
      </div>

      <div class="open-file-divider">ou</div>

      <button class="btn btn-primary" id="open-btn" style="width:480px;max-width:90vw;justify-content:center">
        ${Icons.folderOpen}
        Choisir un fichier
      </button>

      <div id="open-error" class="open-file-error hidden"></div>

      <p style="margin-top:2rem;font-size:0.75rem;color:var(--muted-foreground)">
        Aucune donnée n'est envoyée à Internet. Tout reste local.
      </p>
    </div>
  `;

  const dropZone = container.querySelector('#drop-zone');
  const openBtn  = container.querySelector('#open-btn');
  const errorEl  = container.querySelector('#open-error');

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function hideError() {
    errorEl.classList.add('hidden');
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      showError('Veuillez sélectionner un fichier JSON valide.');
      return;
    }
    hideError();

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      validateAndLoad(data);
    } catch (e) {
      showError(`Erreur lors de la lecture du fichier: ${e.message}`);
    }
  }

  function validateAndLoad(data) {
    const missing = REQUIRED_KEYS.filter(k => !(k in data));
    if (missing.length > 0) {
      showError(`Format invalide. Clés manquantes: ${missing.join(', ')}`);
      return;
    }
    store.load(data);
    onSuccess();
  }

  // ─── Drag & Drop ───
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  });
  dropZone.addEventListener('click', triggerPicker);
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') triggerPicker();
  });

  // ─── File button ───
  openBtn.addEventListener('click', triggerPicker);

  async function triggerPicker() {
    // Electron: use native dialog
    if (window.electronAPI) {
      const filePath = await window.electronAPI.openFile();
      if (!filePath) return;
      const result = await window.electronAPI.readFile(filePath);
      if (!result.success) {
        showError(`Impossible de lire le fichier: ${result.error}`);
        return;
      }
      try {
        const data = JSON.parse(result.content);
        validateAndLoad(data);
      } catch (e) {
        showError(`JSON invalide: ${e.message}`);
      }
    } else {
      // Browser fallback: hidden <input type="file">
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = () => handleFile(input.files?.[0]);
      input.click();
    }
  }
}
