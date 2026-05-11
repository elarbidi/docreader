/**
 * DocDocs Reader — Hash Router
 */

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // handle on load
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  currentRoute = hash;

  // Extract dynamic segments: /patients/:id
  let handler = null;
  let params = {};

  for (const [pattern, fn] of Object.entries(routes)) {
    const match = matchRoute(pattern, hash);
    if (match !== null) {
      handler = fn;
      params = match;
      break;
    }
  }

  if (handler) {
    handler(params);
  } else {
    // 404 fallback
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div class="page-container animate-fade-in">
          <div class="empty-state">
            <div style="font-size:4rem">404</div>
            <div class="empty-state-title">Page introuvable</div>
            <div class="empty-state-text">Route: ${hash}</div>
          </div>
        </div>`;
    }
  }
}

function matchRoute(pattern, path) {
  const patParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function getCurrentRoute() {
  return currentRoute;
}
