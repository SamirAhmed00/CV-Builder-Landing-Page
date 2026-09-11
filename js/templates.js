/* ==========================================================================
   CV Builder — Templates Module
   Bilingual: uses CVI18n for UI strings and CVApp.pick / CVI18n.pick for data.
   ========================================================================== */

(function (global) {
  'use strict';

  const { loadJSON, Icons, Motion, Toast } = global.CVApp || {};
  const I18n = global.CVI18n || { t: k => k, pick: v => (v && typeof v === 'object' ? (v[I18n?.getLang?.()] || v.en || v.ar || '') : v), getLang: () => 'en', isRTL: () => false, onChange: () => {} };

  let state = {
    templates: [],
    categories: [],
    activeCategory: 'all',
    query: ''
  };

  /* ---------- Localized getters ---------- */
  const tName = tpl => tpl.name && (I18n.pick(tpl.name) || tpl.id);
  const tStyle = tpl => I18n.pick(tpl.style) || '';
  const tDesc = tpl => I18n.pick(tpl.description) || '';
  const tRoles = tpl => (tpl.roles && I18n.pick(tpl.roles)) || [];
  const catName = cat => I18n.pick(cat.name) || cat.id;
  const catDesc = cat => I18n.pick(cat.description) || '';

  /* ---------- Template preview generator ---------- */
  function makeTemplatePreview(template) {
    const cv = document.createElement('div');
    cv.className = 'tp-doc';
    cv.style.setProperty('--template-color', template.color);

    const isAr = I18n.getLang() === 'ar';
    const lbl = isAr
      ? { summary: 'نبذة', experience: 'الخبرات', skills: 'المهارات', projects: 'المشاريع', tools: 'الأدوات', about: 'نبذة', channels: 'القنوات' }
      : { summary: 'Summary', experience: 'Experience', skills: 'Skills', projects: 'Projects', tools: 'Tools', about: 'About', channels: 'Channels' };

    if (template.id === 'design-portfolio' || template.id === 'ux-specialist') {
      cv.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:8px;height:100%;">
          <div>
            <div class="tp-name">${escapeHTML(tName(template))}</div>
            <div class="tp-role" style="margin-top:4px;">${escapeHTML(tRoles(template)[0] || '')}</div>
            <div style="margin-top:8px;">
              <div class="tp-section-title">${lbl.about}</div>
              <div class="tp-line" style="margin-top:4px;"></div>
              <div class="tp-line short"></div>
            </div>
            <div style="margin-top:8px;">
              <div class="tp-section-title">${lbl.skills}</div>
              <div style="margin-top:4px;">
                <span class="tp-pill">Figma</span><span class="tp-pill">UI</span><span class="tp-pill">UX</span>
              </div>
            </div>
            <div style="margin-top:8px;">
              <div class="tp-section-title">${lbl.tools}</div>
              <div style="margin-top:4px;">
                <span class="tp-pill">Sketch</span><span class="tp-pill">Webflow</span>
              </div>
            </div>
          </div>
          <div>
            <div class="tp-section-title">${lbl.experience}</div>
            <div class="tp-line dark short" style="margin-top:4px;"></div>
            <div class="tp-line med" style="margin-top:3px;"></div>
            <div class="tp-line" style="margin-top:3px;"></div>
            <div class="tp-line short" style="margin-top:3px;"></div>
            <div class="tp-line dark short" style="margin-top:6px;"></div>
            <div class="tp-line med" style="margin-top:3px;"></div>
            <div class="tp-line" style="margin-top:3px;"></div>
            <div style="margin-top:8px;">
              <div class="tp-section-title">${lbl.projects}</div>
              <div class="tp-line dark short" style="margin-top:4px;"></div>
              <div class="tp-line med" style="margin-top:3px;"></div>
              <div class="tp-line short" style="margin-top:3px;"></div>
            </div>
          </div>
        </div>
      `;
    } else if (template.id === 'tech-resume' || template.id === 'engineering-pro' || template.id === 'mobile-dev') {
      const skillLabel = isAr ? 'المهارات التقنية' : 'Technical Skills';
      const backendLbl = isAr ? 'باك إند' : 'Backend';
      const cloudLbl = isAr ? 'كلاود' : 'Cloud';
      cv.innerHTML = `
        <div style="background:${template.color};color:white;padding:10px;margin:-20px -20px 10px -20px;">
          <div style="font-size:14px;font-weight:700;letter-spacing:0;">${escapeHTML(tName(template))}</div>
          <div style="font-size:8px;opacity:0.85;margin-top:2px;">${escapeHTML(tRoles(template)[0] || '')}</div>
        </div>
        <div class="tp-section-title">${lbl.summary}</div>
        <div class="tp-line" style="margin-top:4px;"></div>
        <div class="tp-line med"></div>
        <div class="tp-line short" style="margin-bottom:8px;"></div>
        <div class="tp-section-title">${skillLabel}</div>
        <div style="margin-top:4px;">
          <span class="tp-pill" style="background:rgba(37,99,235,0.1);color:${template.color};">${backendLbl}</span>
          <span class="tp-pill" style="background:rgba(37,99,235,0.1);color:${template.color};">${cloudLbl}</span>
          <span class="tp-pill" style="background:rgba(37,99,235,0.1);color:${template.color};">SQL</span>
          <span class="tp-pill" style="background:rgba(37,99,235,0.1);color:${template.color};">APIs</span>
        </div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.experience}</div>
        <div class="tp-line dark short" style="margin-top:4px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
        <div class="tp-line" style="margin-top:3px;"></div>
        <div class="tp-line short" style="margin-top:3px;"></div>
        <div class="tp-line dark short" style="margin-top:6px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
      `;
    } else if (template.id === 'marketing-edge' || template.id === 'growth-marketer') {
      const spendLbl = isAr ? 'الإنفاق' : 'Spend';
      const quotaLbl = isAr ? 'تحقيق الحصة' : 'Quota Attainment';
      const pipelineLbl = isAr ? 'الصفقات' : 'Pipeline';
      cv.innerHTML = `
        <div class="tp-name">${escapeHTML(tName(template))}</div>
        <div class="tp-role" style="margin-top:2px;">${escapeHTML(tRoles(template)[0] || '')}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:8px;">
          <div style="background:${template.color};color:white;padding:6px;border-radius:3px;text-align:center;">
            <div style="font-size:11px;font-weight:700;">4.2x</div>
            <div style="font-size:6px;opacity:0.85;">ROAS</div>
          </div>
          <div style="background:#F1F5F9;color:#0F172A;padding:6px;border-radius:3px;text-align:center;">
            <div style="font-size:11px;font-weight:700;">-32%</div>
            <div style="font-size:6px;color:#64748B;">CAC</div>
          </div>
          <div style="background:#F1F5F9;color:#0F172A;padding:6px;border-radius:3px;text-align:center;">
            <div style="font-size:11px;font-weight:700;">$1.2M</div>
            <div style="font-size:6px;color:#64748B;">${spendLbl}</div>
          </div>
        </div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.experience}</div>
        <div class="tp-line dark short" style="margin-top:4px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
        <div class="tp-line" style="margin-top:3px;"></div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.channels}</div>
        <div style="margin-top:4px;">
          <span class="tp-pill">Meta</span><span class="tp-pill">Google</span><span class="tp-pill">TikTok</span>
        </div>
      `;
    } else if (template.id === 'sales-executor' || template.id === 'bdr-pro' || template.id === 'executive-classic') {
      cv.innerHTML = `
        <div class="tp-name">${escapeHTML(tName(template))}</div>
        <div class="tp-role" style="margin-top:2px;">${escapeHTML(tRoles(template)[0] || '')}</div>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <div style="flex:1;background:${template.color};color:white;padding:6px;border-radius:3px;">
            <div style="font-size:6px;opacity:0.85;text-transform:uppercase;letter-spacing:0.05em;">${quotaLbl}</div>
            <div style="font-size:12px;font-weight:700;">142%</div>
          </div>
          <div style="flex:1;background:#F1F5F9;padding:6px;border-radius:3px;">
            <div style="font-size:6px;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;">${pipelineLbl}</div>
            <div style="font-size:12px;font-weight:700;color:#0F172A;">$3.8M</div>
          </div>
        </div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.experience}</div>
        <div class="tp-line dark short" style="margin-top:4px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
        <div class="tp-line" style="margin-top:3px;"></div>
        <div class="tp-line short" style="margin-top:3px;"></div>
        <div class="tp-line dark short" style="margin-top:6px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
      `;
    } else {
      cv.innerHTML = `
        <div class="tp-name">${escapeHTML(tName(template))}</div>
        <div class="tp-role" style="margin-top:2px;">${escapeHTML(tRoles(template)[0] || '')}</div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.summary}</div>
        <div class="tp-line" style="margin-top:4px;"></div>
        <div class="tp-line med"></div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.experience}</div>
        <div class="tp-line dark short" style="margin-top:4px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
        <div class="tp-line" style="margin-top:3px;"></div>
        <div class="tp-line short" style="margin-top:3px;"></div>
        <div class="tp-line dark short" style="margin-top:6px;"></div>
        <div class="tp-line med" style="margin-top:3px;"></div>
        <div class="tp-section-title" style="margin-top:8px;">${lbl.skills}</div>
        <div style="margin-top:4px;">
          <span class="tp-pill">JavaScript</span>
          <span class="tp-pill">React</span>
          <span class="tp-pill">Node</span>
        </div>
      `;
    }
    return cv;
  }

  /* ---------- Render ---------- */
  function renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    const filtered = state.templates.filter(t => {
      if (state.activeCategory !== 'all' && t.category !== state.activeCategory) return false;
      if (state.query) {
        const q = state.query.toLowerCase();
        const hay = (tName(t) + ' ' + tStyle(t) + ' ' + tRoles(t).join(' ') + ' ' + tDesc(t)).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      grid.innerHTML = `<div class="text-center text-muted" style="grid-column:1/-1;padding:var(--s-12) 0;">${I18n.t('templatesPage.noMatch')}</div>`;
      return;
    }

    const arrowIcon = I18n.isRTL() ? 'arrow-left' : 'arrow-right';
    grid.innerHTML = filtered.map(t => {
      return `
        <article class="template-card reveal" data-id="${t.id}" tabindex="0" role="button" aria-label="${I18n.t('showcase.preview')} ${escapeAttr(tName(t))}">
          <div class="template-preview" style="--template-color:${t.color};">
            <div class="tp-role" style="color:${t.color};font-weight:600;">${escapeHTML(tStyle(t))}</div>
            <div class="tp-name">${escapeHTML(tName(t))}</div>
            <div class="tp-line dark short" style="margin-top:2px;"></div>
            <div class="tp-section-title">${I18n.t('builder.cv.experience')}</div>
            <div class="tp-line dark short"></div>
            <div class="tp-line med"></div>
            <div class="tp-line"></div>
            <div class="tp-section-title" style="margin-top:auto;">${I18n.t('builder.cv.skills')}</div>
            <div>
              <span class="tp-pill" style="background:${t.color}1A;color:${t.color};">${escapeHTML(tRoles(t)[0] || '')}</span>
              <span class="tp-pill" style="background:${t.color}1A;color:${t.color};">${escapeHTML(tRoles(t)[1] || tStyle(t))}</span>
            </div>
          </div>
          <div class="template-body">
            <div class="flex items-center justify-between gap-3">
              <h3>${escapeHTML(tName(t))}</h3>
              <span class="badge badge-success badge-dot" title="${I18n.t('showcase.atsTitle')}">${t.atsScore}% ATS</span>
            </div>
            <div class="template-meta">
              <span>${escapeHTML(getCategoryName(t.category))}</span>
              <span class="dot"></span>
              <span>${escapeHTML(tStyle(t))}</span>
            </div>
            <div class="template-actions">
              <button class="btn btn-secondary btn-sm" data-action="preview" data-id="${t.id}">
                ${Icons.get('eye')}
                ${I18n.t('showcase.preview')}
              </button>
              <a class="btn btn-primary btn-sm" href="builder.html?template=${t.id}">
                ${I18n.t('showcase.use')}
                ${Icons.get(arrowIcon)}
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('[data-action="preview"]').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const id = b.getAttribute('data-id');
        openPreview(id);
      });
    });
    grid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => openPreview(card.getAttribute('data-id')));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPreview(card.getAttribute('data-id'));
        }
      });
    });

    Motion.initReveal(grid);
  }

  function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    const colorMap = { software: '#2563EB', design: '#7C3AED', marketing: '#F59E0B', sales: '#10B981' };
    const iconMap = { software: 'code', design: 'palette', marketing: 'megaphone', sales: 'trending-up' };
    grid.innerHTML = state.categories.map(cat => {
      const count = state.templates.filter(t => t.category === cat.id).length;
      return `
        <a class="category-card reveal" href="templates.html?category=${cat.id}" style="--cat-color:${colorMap[cat.id]};">
          <div class="category-icon">${Icons.get(iconMap[cat.id])}</div>
          <h3>${escapeHTML(catName(cat))}</h3>
          <p>${escapeHTML(catDesc(cat))}</p>
          <div class="category-stats">
            <div class="category-stat">
              <span class="v">${cat.roles[I18n.getLang()] ? cat.roles[I18n.getLang()].length : (cat.roles.en || cat.roles.ar).length}</span>
              <span class="l">${I18n.t('categories.roles')}</span>
            </div>
            <div class="category-stat">
              <span class="v">${count}</span>
              <span class="l">${I18n.t('categories.templates')}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');
  }

  function renderFilters() {
    const bar = document.getElementById('filterBar');
    if (!bar) return;
    const items = [{ id: 'all', name: I18n.t('templatesPage.all') }, ...state.categories.map(c => ({ id: c.id, name: catName(c) }))];
    bar.innerHTML = items.map(i => `
      <button class="filter-pill ${state.activeCategory === i.id ? 'active' : ''}" data-cat="${i.id}">${escapeHTML(i.name)}</button>
    `).join('');
    bar.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.getAttribute('data-cat');
        renderFilters();
        renderTemplates();
      });
    });
  }

  function getCategoryName(id) {
    const c = state.categories.find(x => x.id === id);
    return c ? catName(c) : id;
  }

  /* ---------- Preview modal ---------- */
  function openPreview(id) {
    const t = state.templates.find(x => x.id === id);
    if (!t) return;
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    document.getElementById('modalTitle').textContent = tName(t);
    document.getElementById('modalStyle').textContent = tStyle(t);
    document.getElementById('modalCategory').textContent = getCategoryName(t.category);
    document.getElementById('modalATS').textContent = t.atsScore + '% ATS';
    document.getElementById('modalDesc').textContent = tDesc(t);
    document.getElementById('modalRoles').innerHTML = tRoles(t).map(r => `<span class="badge">${escapeHTML(r)}</span>`).join('');
    const useBtn = document.getElementById('modalUse');
    if (useBtn) {
      useBtn.href = 'builder.html?template=' + t.id;
      const arrowIcon = I18n.isRTL() ? 'arrow-left' : 'arrow-right';
      useBtn.innerHTML = `${I18n.t('templatesPage.useThis')} <span data-icon="${arrowIcon}"></span>`;
      const iconHolder = useBtn.querySelector('[data-icon]');
      if (iconHolder) iconHolder.innerHTML = Icons.get(arrowIcon);
    }
    const preview = document.getElementById('modalPreview');
    if (preview) {
      preview.innerHTML = '';
      preview.appendChild(makeTemplatePreview(t));
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function bindModal() {
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    modal.addEventListener('click', e => {
      if (e.target === modal) closePreview();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePreview();
    });
    const close = modal.querySelector('.modal-close');
    if (close) close.addEventListener('click', closePreview);
  }

  /* ---------- Utils ---------- */
  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHTML(s); }
  function getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  /* ---------- Init ---------- */
  async function init() {
    try {
      const [tpl, cat] = await Promise.all([
        loadJSON('data/templates.json'),
        loadJSON('data/categories.json')
      ]);
      state.templates = tpl.templates;
      state.categories = cat.categories;
      const fromURL = getQueryParam('category');
      if (fromURL && state.categories.some(c => c.id === fromURL)) state.activeCategory = fromURL;

      renderAll();
      bindModal();

      const search = document.getElementById('templateSearch');
      if (search) {
        search.placeholder = I18n.t('templatesPage.search');
        search.addEventListener('input', e => {
          state.query = e.target.value.trim();
          renderTemplates();
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show('Failed to load templates');
    }
  }

  function renderAll() {
    renderCategories();
    renderFilters();
    renderTemplates();
  }

  // Listen for language changes — re-render everything
  document.addEventListener('langchange', () => renderAll());

  document.addEventListener('DOMContentLoaded', init);
  global.Templates = { openPreview, closePreview, getState: () => state, reRender: renderAll };
})(window);
