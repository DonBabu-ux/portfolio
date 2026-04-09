document.addEventListener('DOMContentLoaded', () => {
  const fileList = document.getElementById('file-list');
  const fileLoading = document.getElementById('file-tree-loading');
  const codeContent = document.getElementById('code-content');
  const codePlaceholder = document.getElementById('code-placeholder');
  const codeLoading = document.getElementById('code-loading');
  const codeError = document.getElementById('code-error');
  const codeErrorMsg = document.getElementById('code-error-msg');
  const codePre = document.getElementById('code-pre');
  const codeBlock = document.getElementById('code-block');
  const codeFilePath = document.getElementById('code-file-path');
  const copyBtn = document.getElementById('btn-copy-code');
  
  let treeLoaded = false;
  let activeFileItem = null;

  // Expose to window so toggleView can call it
  window.loadGithubTree = async () => {
    if (treeLoaded || !window.PROJECT || !window.PROJECT.githubRepo) return;
    
    // Safety lock
    treeLoaded = true;

    try {
      const response = await fetch(`/projects/${window.PROJECT.slug}/api/tree`);
      const data = await response.json();
      
      if (fileLoading) fileLoading.style.display = 'none';

      if (data.error || !data.files || data.files.length === 0) {
        fileList.innerHTML = `<li class="file-tree-empty"><i class="fas fa-exclamation-triangle"></i> Failed to load files</li>`;
        return;
      }

      // Sort files: sort src/, package.json, etc if needed. Default alphabetical.
      const files = data.files.sort((a, b) => a.path.localeCompare(b.path));

      files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        // Pick an icon based on extension
        let icon = 'fa-file-code';
        if (file.path.endsWith('.json')) icon = 'fa-file-alt text-yellow';
        else if (file.path.endsWith('.md')) icon = 'fa-book text-blue';
        else if (file.path.endsWith('.css')) icon = 'fa-file-code text-blue';
        
        li.innerHTML = `<i class="fas ${icon}"></i> ${file.path}`;
        li.dataset.path = file.path;
        
        li.addEventListener('click', () => loadFile(file.path, li));
        
        fileList.appendChild(li);
      });

    } catch (err) {
      if (fileLoading) fileLoading.style.display = 'none';
      fileList.innerHTML = `<li class="file-tree-empty"><i class="fas fa-exclamation-triangle"></i> Backend error</li>`;
    }
  };

  const loadFile = async (filePath, listItem) => {
    // Update UI states
    if (activeFileItem) activeFileItem.classList.remove('active');
    activeFileItem = listItem;
    activeFileItem.classList.add('active');

    codePlaceholder.classList.add('hidden');
    codeContent.classList.add('hidden');
    codeError.classList.add('hidden');
    codeLoading.classList.remove('hidden');

    try {
      const pathParam = encodeURIComponent(filePath);
      const response = await fetch(`/projects/${window.PROJECT.slug}/api/file?path=${pathParam}`);
      const data = await response.json();

      codeLoading.classList.add('hidden');

      if (data.error) {
        codeErrorMsg.textContent = data.error;
        codeError.classList.remove('hidden');
        return;
      }

      // Infer language from extension
      const ext = filePath.split('.').pop();
      let lang = 'javascript';
      if (ext === 'json') lang = 'json';
      else if (ext === 'html') lang = 'html';
      else if (ext === 'css') lang = 'css';
      else if (ext === 'md') lang = 'markdown';
      else if (ext === 'ts' || ext === 'tsx') lang = 'typescript';

      // Set content and highlight
      codeFilePath.textContent = filePath;
      codeBlock.className = `language-${lang}`;
      codeBlock.textContent = data.content;

      if (typeof hljs !== 'undefined') {
        hljs.highlightElement(codeBlock);
      }

      codeContent.classList.remove('hidden');

    } catch (err) {
      codeLoading.classList.add('hidden');
      codeErrorMsg.textContent = 'Network error loading file context.';
      codeError.classList.remove('hidden');
    }
  };

  // Copy to clipboard functionality
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = codeBlock.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('text-success');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('text-success');
        }, 2000);
      });
    });
  }
});
