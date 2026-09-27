const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let widgetPromise = null;
let queue = Promise.resolve();

function loadWidget() {
  widgetPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onerror = () => {
      widgetPromise = null;
      reject(new Error('Kunne ikke indlæse sikkerhedstjekket'));
    };
    script.onload = () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.bottom = '16px';
      container.style.right = '16px';
      container.style.zIndex = '60';
      document.body.appendChild(container);
      const state = { pending: null };
      const id = window.turnstile.render(container, {
        sitekey: SITE_KEY,
        execution: 'execute',
        appearance: 'interaction-only',
        callback: token => state.pending?.resolve(token),
        'error-callback': () => state.pending?.reject(new Error('Sikkerhedstjekket fejlede. Genindlæs siden og prøv igen.')),
        'expired-callback': () => window.turnstile.reset(id),
      });
      resolve({ id, state });
    };
    document.head.appendChild(script);
  });
  return widgetPromise;
}

async function freshToken() {
  const { id, state } = await loadWidget();
  const token = await new Promise((resolve, reject) => {
    state.pending = { resolve, reject };
    window.turnstile.execute(id);
  });
  state.pending = null;
  window.turnstile.reset(id);
  return token;
}

export const turnstileEnabled = Boolean(SITE_KEY);

export function getTurnstileToken() {
  if (!turnstileEnabled) return Promise.resolve(null);
  const next = queue.then(freshToken, freshToken);
  queue = next.catch(() => {});
  return next;
}
