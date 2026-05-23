(function () {
  'use strict';

  const searchInput   = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const categoryGrid  = document.getElementById('category-grid');
  const resourceList  = document.getElementById('resource-list');
  const resultsCount  = document.getElementById('results-count');
  const btnClear      = document.getElementById('btn-clear');

  let activeCategory = '';
  let searchQuery    = '';

  // ── Populate category select ──────────────────────────────────────────────
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.icon + '  ' + cat.label;
    categoryFilter.appendChild(opt);
  });

  // ── Populate category grid ────────────────────────────────────────────────
  CATEGORIES.forEach(cat => {
    const a = document.createElement('a');
    a.href = 'category.html?cat=' + cat.id;
    a.className = 'category-card';
    a.setAttribute('role', 'listitem');
    a.setAttribute('aria-label', cat.label);
    a.dataset.cat = cat.id;
    a.innerHTML = `
      <span class="cat-icon" aria-hidden="true">${cat.icon}</span>
      <span class="cat-label">${cat.label}</span>
    `;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (activeCategory === cat.id) {
        activeCategory = '';
        categoryFilter.value = '';
      } else {
        activeCategory = cat.id;
        categoryFilter.value = cat.id;
      }
      updateGrid();
      render();
      scrollToResults();
    });
    categoryGrid.appendChild(a);
  });

  // ── Event listeners ───────────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    render();
  });

  document.getElementById('search-btn').addEventListener('click', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    render();
    scrollToResults();
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
      scrollToResults();
    }
  });

  categoryFilter.addEventListener('change', () => {
    activeCategory = categoryFilter.value;
    updateGrid();
    render();
  });

  btnClear.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    searchQuery    = '';
    activeCategory = '';
    updateGrid();
    render();
  });

  // ── Pre-fill from URL params ──────────────────────────────────────────────
  const params = new URLSearchParams(location.search);
  if (params.get('q')) {
    searchQuery = params.get('q').toLowerCase();
    searchInput.value = params.get('q');
  }
  if (params.get('cat')) {
    activeCategory = params.get('cat');
    categoryFilter.value = activeCategory;
    updateGrid();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getCategoryLabel(id) {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? cat.label : id;
  }

  function updateGrid() {
    document.querySelectorAll('.category-card').forEach(card => {
      card.classList.toggle('active', card.dataset.cat === activeCategory);
    });
  }

  function scrollToResults() {
    const el = document.getElementById('results');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function matchesSearch(r, q) {
    if (!q) return true;
    const haystack = [r.name, r.description, r.address, r.zip, r.eligibility]
      .filter(Boolean).join(' ').toLowerCase();
    return q.split(/\s+/).every(word => haystack.includes(word));
  }

  function render() {
    const filtered = RESOURCES.filter(r => {
      const catOk = !activeCategory || r.category === activeCategory;
      const qOk   = matchesSearch(r, searchQuery);
      return catOk && qOk;
    });

    const hasFilter = searchQuery || activeCategory;
    btnClear.classList.toggle('hidden', !hasFilter);

    // No search/filter active — clear the list and hide count
    if (!hasFilter) {
      resultsCount.textContent = '';
      resourceList.innerHTML   = '';
      return;
    }

    resultsCount.textContent =
      filtered.length === 0 ? 'No resources found' :
      filtered.length === 1 ? '1 resource found' :
      `${filtered.length} resources found`;

    if (filtered.length === 0) {
      resourceList.innerHTML = `
        <div class="empty-state">
          <h2>No results found</h2>
          <p>Try a different keyword or browse by category above.</p>
          <a href="suggest.html" class="btn-suggest">+ Suggest a Resource</a>
        </div>`;
      return;
    }

    resourceList.innerHTML = filtered.map(r => resourceCard(r)).join('');
  }

  function resourceCard(r) {
    const catLabel = getCategoryLabel(r.category);
    const phone    = r.phone ? `<a class="btn-phone" href="tel:${r.phone.replace(/\D/g,'')}"
                        aria-label="Call ${r.name}">📞 ${r.phone}</a>` : '';
    const addressLine = r.address
      ? `<span>📍 ${r.address}</span>` : '';
    const hoursLine = r.hours
      ? `<span>🕐 ${r.hours}</span>` : '';

    return `
      <article class="resource-card">
        <div class="card-top">
          <a class="card-name" href="resource.html?id=${r.id}">${r.name}</a>
          <span class="category-badge" aria-label="Category: ${catLabel}">${catLabel}</span>
        </div>
        <div class="card-meta">
          ${addressLine}
          ${hoursLine}
        </div>
        <p class="card-desc">${r.description}</p>
        <div class="card-actions">
          <a class="btn-details" href="resource.html?id=${r.id}">View Details</a>
          ${phone}
        </div>
      </article>`;
  }

  render();
})();
