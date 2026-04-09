document.addEventListener('DOMContentLoaded', () => {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const panels = document.querySelectorAll('.panel');

  if (toggleBtns.length === 0) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons
      toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      panels.forEach(p => {
        p.classList.add('hidden');
      });

      // Activate clicked button
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show target panel
      const targetId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }

      // If switching to code view and tree hasn't been loaded, trigger load
      if (btn.dataset.panel === 'code' && window.loadGithubTree) {
        window.loadGithubTree();
      }
    });
  });

  // Iframe error fallback handling
  const iframe = document.getElementById('project-iframe');
  const loading = document.getElementById('iframe-loading');
  
  if (iframe) {
    iframe.addEventListener('load', () => {
      if (loading) loading.style.display = 'none';
      
      // Attempt to catch iframe loading exceptions by checking cross origin
      // Note: we can't reliably detect 404s inside cross-origin iframes,
      // but we hide the loader when 'load' event fires regardless.
    });
    
    // Safety timeout for loader
    setTimeout(() => {
      if (loading) loading.style.display = 'none';
    }, 5000);
  }
});
