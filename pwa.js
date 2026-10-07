(() => {
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;

    if (standalone || document.getElementById('pwaInstallBtn')) return;

    const button = document.createElement('button');
    button.id = 'pwaInstallBtn';
    button.type = 'button';
    button.textContent = 'Install App';

    Object.assign(button.style, {
      position: 'fixed',
      right: '14px',
      bottom: '92px',
      zIndex: '1200',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '999px',
      padding: '10px 14px',
      background: '#C8102E',
      color: '#fff',
      font: '800 12px system-ui,sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,.35)'
    });

    button.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      button.remove();
    });

    document.body.appendChild(button);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('pwaInstallBtn')?.remove();
  });
})();