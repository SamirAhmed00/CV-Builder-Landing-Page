/* ==========================================================================
   CV Builder — Builder Module
   Bilingual live CV builder with template switching, persistence, download.
   ========================================================================== */

(function (global) {
  'use strict';

  const { Icons, Toast, loadJSON } = global.CVApp || {};
  const I18n = global.CVI18n || { t: k => k, pick: v => (v && typeof v === 'object' ? (v.en || v.ar || '') : v), getLang: () => 'en', isRTL: () => false };

  const STORAGE_KEY = 'cvbuilder-data-v1';
  const DEFAULT_TEMPLATE = 'modern-professional';

  // Two sample datasets — one per language. The active one is selected on init.
  const SAMPLE = {
    en: {
      personal: {
        firstName: 'Alex', lastName: 'Morgan',
        role: 'Senior Software Engineer',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexmorgan',
        website: 'alexmorgan.dev'
      },
      summary: 'Senior engineer with 7+ years building scalable web platforms. Specialized in TypeScript, distributed systems, and developer experience. Led teams of 4-8 engineers and shipped products used by millions of users.',
      experience: [
        {
          title: 'Senior Software Engineer', company: 'Stripe', location: 'Remote',
          start: '2022', end: 'Present',
          bullets: [
            'Led migration of payments API to a typed client SDK, reducing integration time by 40%.',
            'Designed and shipped multi-region failover system handling 50k req/s with 99.99% uptime.',
            'Mentored 5 engineers; ran weekly architecture review for the platform team.'
          ]
        },
        {
          title: 'Software Engineer', company: 'Linear', location: 'San Francisco, CA',
          start: '2019', end: '2022',
          bullets: [
            'Built the real-time sync engine powering collaborative editing across teams.',
            'Reduced cold-start time by 60% through dependency graph optimization.',
            'Owned the design system; contributed 30+ accessible React primitives.'
          ]
        }
      ],
      education: [
        { degree: 'B.S. Computer Science', school: 'University of California, Berkeley', start: '2015', end: '2019', details: '' }
      ],
      skills: ['TypeScript','React','Node.js','PostgreSQL','AWS','Docker','GraphQL','System Design'],
      projects: [
        { name: 'OpenSync — Realtime CRDT toolkit', link: 'github.com/alexmorgan/opensync',
          description: 'Open-source CRDT library with 2.4k GitHub stars. Used in production by 30+ teams.' }
      ]
    },
    ar: {
      personal: {
        firstName: 'أحمد', lastName: 'العلوي',
        role: 'مهندس برمجيات أول',
        email: 'ahmed.alalawi@example.com',
        phone: '+966 50 000 0000',
        location: 'الرياض، السعودية',
        linkedin: 'linkedin.com/in/ahmedalalawi',
        website: 'ahmed.dev'
      },
      summary: 'مهندس أول بخبرة 7+ سنوات في بناء منصات ويب قابلة للتوسع. متخصص في TypeScript، الأنظمة الموزعة، وتجربة المطوّر. قُدت فرقًا من 4-8 مهندسين وأطلقت منتجات يستخدمها ملايين المستخدمين.',
      experience: [
        {
          title: 'مهندس برمجيات أول', company: 'Stripe', location: 'عن بُعد',
          start: '2022', end: 'حتى الآن',
          bullets: [
            'قُدت ترحيل واجهة برمجة المدفوعات إلى SDK مكتوب بأنواع، مما قلل زمن التكامل بنسبة 40%.',
            'صممت وأطلقت نظام failover متعدد المناطق يستوعب 50 ألف طلب/ثانية مع وقت تشغيل 99.99%.',
            'أشرفت على 5 مهندسين؛ أدّيت مراجعة الهندسة المعمارية الأسبوعية لفريق المنصة.'
          ]
        },
        {
          title: 'مهندس برمجيات', company: 'Linear', location: 'سان فرانسيسكو، كاليفورنيا',
          start: '2019', end: '2022',
          bullets: [
            'بنيت محرّك المزامنة الفورية الذي يدعم التحرير التعاوني بين الفرق.',
            'قلّلت زمن البدء البارد بنسبة 60% من خلال تحسين الرسم البياني للتبعيات.',
            'امتلكت نظام التصميم؛ ساهمت بـ 30+ مكوّن React متاح.'
          ]
        }
      ],
      education: [
        { degree: 'بكالوريوس علوم الحاسب', school: 'جامعة الملك سعود', start: '2015', end: '2019', details: '' }
      ],
      skills: ['TypeScript','React','Node.js','PostgreSQL','AWS','Docker','GraphQL','تصميم الأنظمة'],
      projects: [
        { name: 'OpenSync — مكتبة CRDT فورية', link: 'github.com/ahmedalalawi/opensync',
          description: 'مكتبة CRDT مفتوحة المصدر مع 2.4k نجمة على GitHub. تُستخدم في الإنتاج من قبل 30+ فريق.' }
      ]
    }
  };

  function defaultData() {
    const lang = (global.CVI18n && global.CVI18n.getLang()) || 'en';
    const sample = SAMPLE[lang] || SAMPLE.en;
    return Object.assign({ template: DEFAULT_TEMPLATE }, clone(sample));
  }

  let state = loadState() || defaultData();
  let templates = [];

  /* ---------- Persistence ---------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.personal) return null;
      return data;
    } catch (e) { return null; }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- Form binding ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function bindPersonal() {
    const map = [
      ['firstName', 'personal.firstName'],
      ['lastName', 'personal.lastName'],
      ['role', 'personal.role'],
      ['email', 'personal.email'],
      ['phone', 'personal.phone'],
      ['location', 'personal.location'],
      ['linkedin', 'personal.linkedin'],
      ['website', 'personal.website'],
      ['summary', 'summary']
    ];
    map.forEach(([id, path]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = getPath(state, path) || '';
      el.addEventListener('input', () => {
        setPath(state, path, el.value);
        saveState();
        renderPreview();
      });
    });
  }

  function renderExperience() {
    const list = document.getElementById('experienceList');
    if (!list) return;
    list.innerHTML = '';
    state.experience.forEach((exp, i) => {
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <div class="dynamic-item-head">
          <span class="label">${escapeHTML(exp.title || I18n.t('builder.experience.newItem'))}</span>
          <button type="button" class="remove-btn" data-remove="${i}">${Icons.get('x')} ${I18n.t('builder.experience.remove')}</button>
        </div>
        <div class="row-2">
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.experience.jobTitle')}</label>
            <input class="input" data-field="title" data-i="${i}" value="${escapeAttr(exp.title)}" />
          </div>
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.experience.company')}</label>
            <input class="input" data-field="company" data-i="${i}" value="${escapeAttr(exp.company)}" />
          </div>
        </div>
        <div class="row-2">
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.experience.location')}</label>
            <input class="input" data-field="location" data-i="${i}" value="${escapeAttr(exp.location)}" />
          </div>
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.experience.start')}</label>
            <input class="input" data-field="start" data-i="${i}" value="${escapeAttr(exp.start)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.experience.end')}</label>
          <input class="input" data-field="end" data-i="${i}" value="${escapeAttr(exp.end)}" />
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.experience.highlights')}</label>
          <textarea class="textarea" data-field="bullets" data-i="${i}" rows="4">${escapeHTML((exp.bullets || []).join('\n'))}</textarea>
        </div>
      `;
      list.appendChild(item);
    });

    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.getAttribute('data-remove');
        state.experience.splice(i, 1);
        saveState();
        renderExperience();
        renderPreview();
      });
    });
    list.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', () => {
        const i = +input.getAttribute('data-i');
        const field = input.getAttribute('data-field');
        const value = field === 'bullets'
          ? input.value.split('\n').map(s => s.trim()).filter(Boolean)
          : input.value;
        state.experience[i][field] = value;
        saveState();
        renderPreview();
        if (field === 'title' || field === 'company') {
          const label = input.closest('.dynamic-item').querySelector('.label');
          if (label) label.textContent = state.experience[i].title || state.experience[i].company || I18n.t('builder.experience.newItem');
        }
      });
    });
  }

  function renderEducation() {
    const list = document.getElementById('educationList');
    if (!list) return;
    list.innerHTML = '';
    state.education.forEach((edu, i) => {
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <div class="dynamic-item-head">
          <span class="label">${escapeHTML(edu.degree || I18n.t('builder.education.newItem'))}</span>
          <button type="button" class="remove-btn" data-remove="${i}">${Icons.get('x')} ${I18n.t('builder.education.remove')}</button>
        </div>
        <div class="row-2">
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.education.degree')}</label>
            <input class="input" data-field="degree" data-i="${i}" value="${escapeAttr(edu.degree)}" />
          </div>
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.education.school')}</label>
            <input class="input" data-field="school" data-i="${i}" value="${escapeAttr(edu.school)}" />
          </div>
        </div>
        <div class="row-2">
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.education.start')}</label>
            <input class="input" data-field="start" data-i="${i}" value="${escapeAttr(edu.start)}" />
          </div>
          <div class="form-group">
            <label class="form-label">${I18n.t('builder.education.end')}</label>
            <input class="input" data-field="end" data-i="${i}" value="${escapeAttr(edu.end)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.education.details')}</label>
          <input class="input" data-field="details" data-i="${i}" value="${escapeAttr(edu.details)}" />
        </div>
      `;
      list.appendChild(item);
    });
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.getAttribute('data-remove');
        state.education.splice(i, 1);
        saveState();
        renderEducation();
        renderPreview();
      });
    });
    list.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', () => {
        const i = +input.getAttribute('data-i');
        const field = input.getAttribute('data-field');
        state.education[i][field] = input.value;
        saveState();
        renderPreview();
        const label = input.closest('.dynamic-item').querySelector('.label');
        if (label) label.textContent = state.education[i].degree || I18n.t('builder.education.newItem');
      });
    });
  }

  function renderProjects() {
    const list = document.getElementById('projectsList');
    if (!list) return;
    list.innerHTML = '';
    state.projects.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <div class="dynamic-item-head">
          <span class="label">${escapeHTML(p.name || I18n.t('builder.extras.newProject'))}</span>
          <button type="button" class="remove-btn" data-remove="${i}">${Icons.get('x')} ${I18n.t('builder.extras.remove')}</button>
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.extras.name')}</label>
          <input class="input" data-field="name" data-i="${i}" value="${escapeAttr(p.name)}" />
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.extras.link')}</label>
          <input class="input" data-field="link" data-i="${i}" value="${escapeAttr(p.link)}" />
        </div>
        <div class="form-group">
          <label class="form-label">${I18n.t('builder.extras.description')}</label>
          <textarea class="textarea" data-field="description" data-i="${i}" rows="3">${escapeHTML(p.description)}</textarea>
        </div>
      `;
      list.appendChild(item);
    });
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.getAttribute('data-remove');
        state.projects.splice(i, 1);
        saveState();
        renderProjects();
        renderPreview();
      });
    });
    list.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', () => {
        const i = +input.getAttribute('data-i');
        const field = input.getAttribute('data-field');
        state.projects[i][field] = input.value;
        saveState();
        renderPreview();
        const label = input.closest('.dynamic-item').querySelector('.label');
        if (label) label.textContent = state.projects[i].name || I18n.t('builder.extras.newProject');
      });
    });
  }

  function renderSkills() {
    const input = document.getElementById('skillsInput');
    const container = document.getElementById('skillsChips');
    if (!input || !container) return;
    if (input.placeholder !== undefined) input.placeholder = I18n.t('builder.extras.skillsPh');
    function refresh() {
      container.innerHTML = state.skills.map((s, i) => `
        <span class="skill-tag">
          ${escapeHTML(s)}
          <button type="button" data-rm="${i}" aria-label="${I18n.t('builder.extras.remove')} ${escapeAttr(s)}" style="display:inline-flex;align-items:center;color:var(--text-subtle);">
            ${Icons.get('x')}
          </button>
        </span>
      `).join('');
      container.querySelectorAll('[data-rm]').forEach(b => {
        b.addEventListener('click', () => {
          state.skills.splice(+b.getAttribute('data-rm'), 1);
          saveState();
          renderSkills();
          renderPreview();
        });
      });
    }
    refresh();
    if (input._bound) return;
    input._bound = true;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const v = input.value.trim().replace(/,$/, '');
        if (v && !state.skills.includes(v)) {
          state.skills.push(v);
          saveState();
          renderSkills();
          renderPreview();
        }
        input.value = '';
      } else if (e.key === 'Backspace' && !input.value && state.skills.length) {
        state.skills.pop();
        saveState();
        renderSkills();
        renderPreview();
      }
    });
  }

  /* ---------- Template selector ---------- */
  function renderTemplateSelector() {
    const sel = document.getElementById('templateSelector');
    if (!sel) return;
    sel.innerHTML = templates.map(t => {
      const tplName = I18n.pick(t.name) || t.id;
      return `
      <div class="template-thumb ${state.template === t.id ? 'active' : ''}" data-tpl="${t.id}" role="button" tabindex="0" aria-label="Switch to ${escapeAttr(tplName)}" style="--tpl-color:${t.color};">
        <div class="tt-line dark tt-title"></div>
        <div class="tt-line"></div>
        <div class="tt-line short"></div>
        <div class="tt-pill" style="background:${t.color}26;"></div>
        <div class="tt-pill" style="background:${t.color}26;"></div>
        <div class="tt-pill" style="background:#E4E4E7;"></div>
        <div class="tt-line" style="margin-top:3px;"></div>
        <div class="tt-line short"></div>
        <div class="tt-name">${escapeHTML(tplName)}</div>
      </div>
    `;
    }).join('');
    sel.querySelectorAll('.template-thumb').forEach(el => {
      el.addEventListener('click', () => switchTemplate(el.getAttribute('data-tpl')));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchTemplate(el.getAttribute('data-tpl'));
        }
      });
    });
  }

  function switchTemplate(id) {
    if (!templates.find(t => t.id === id)) return;
    state.template = id;
    saveState();
    renderTemplateSelector();
    renderPreview();
  }

  /* ---------- Preview render ---------- */
  function renderPreview() {
    const paper = document.getElementById('cvPaper');
    if (!paper) return;
    const tpl = templates.find(t => t.id === state.template) || templates[0];
    const accent = tpl ? tpl.accent || tpl.color : '#2563EB';

    paper.setAttribute('data-template', tpl ? tpl.id : '');
    paper.style.setProperty('--cv-accent', accent);
    paper.classList.toggle('two-col', !!(tpl && (tpl.id === 'design-portfolio' || tpl.id === 'ux-specialist' || tpl.id === 'sales-executor' || tpl.id === 'executive-classic')));

    const p = state.personal;
    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ').trim() || (I18n.getLang() === 'ar' ? 'اسمك' : 'Your Name');
    const presentLbl = I18n.t('builder.cv.present');
    const contactBits = [
      p.email && `<span>${Icons.get('mail')} ${escapeHTML(p.email)}</span>`,
      p.phone && `<span>${Icons.get('phone')} ${escapeHTML(p.phone)}</span>`,
      p.location && `<span>${Icons.get('map-pin')} ${escapeHTML(p.location)}</span>`,
      p.linkedin && `<span>${Icons.get('linkedin')} ${escapeHTML(p.linkedin)}</span>`,
      p.website && `<span>${Icons.get('globe')} ${escapeHTML(p.website)}</span>`
    ].filter(Boolean).join('');

    const summaryHTML = state.summary
      ? `<div class="cv-section"><div class="cv-section-title">${I18n.t('builder.cv.summary')}</div><p class="cv-summary">${escapeHTML(state.summary)}</p></div>`
      : '';

    const expHTML = state.experience.length ? `
      <div class="cv-section">
        <div class="cv-section-title">${I18n.t('builder.cv.experience')}</div>
        ${state.experience.map(exp => {
          const endLabel = (exp.end || '').toLowerCase() === 'present' || (exp.end || '') === 'حتى الآن' ? presentLbl : (exp.end || '');
          return `
          <div class="cv-item">
            <div class="cv-item-head">
              <span class="cv-item-title">${escapeHTML(exp.title || '')}${exp.company ? ' · ' + escapeHTML(exp.company) : ''}</span>
              <span class="cv-item-meta">${escapeHTML(exp.start || '')} – ${escapeHTML(endLabel)}</span>
            </div>
            ${exp.location ? `<div class="cv-item-sub">${escapeHTML(exp.location)}</div>` : ''}
            ${(exp.bullets && exp.bullets.length) ? `
              <div class="cv-item-desc">
                <ul>${exp.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}</ul>
              </div>` : ''}
          </div>
        `;
        }).join('')}
      </div>
    ` : '';

    const eduHTML = state.education.length ? `
      <div class="cv-section">
        <div class="cv-section-title">${I18n.t('builder.cv.education')}</div>
        ${state.education.map(edu => `
          <div class="cv-item">
            <div class="cv-item-head">
              <span class="cv-item-title">${escapeHTML(edu.degree || '')}${edu.school ? ' · ' + escapeHTML(edu.school) : ''}</span>
              <span class="cv-item-meta">${escapeHTML(edu.start || '')} – ${escapeHTML(edu.end || '')}</span>
            </div>
            ${edu.details ? `<div class="cv-item-sub">${escapeHTML(edu.details)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    const projHTML = state.projects.length ? `
      <div class="cv-section">
        <div class="cv-section-title">${I18n.t('builder.cv.projects')}</div>
        ${state.projects.map(p => `
          <div class="cv-item">
            <div class="cv-item-head">
              <span class="cv-item-title">${escapeHTML(p.name || '')}${p.link ? ' · ' + escapeHTML(p.link) : ''}</span>
            </div>
            ${p.description ? `<div class="cv-item-desc">${escapeHTML(p.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    const skillsHTML = state.skills.length ? `
      <div class="cv-section">
        <div class="cv-section-title">${I18n.t('builder.cv.skills')}</div>
        <div class="cv-skills">
          ${state.skills.map(s => `<span class="cv-skill">${escapeHTML(s)}</span>`).join('')}
        </div>
      </div>
    ` : '';

    if (paper.classList.contains('two-col')) {
      paper.innerHTML = `
        <div class="cv-header">
          <div class="cv-name">${escapeHTML(fullName)}</div>
          <div class="cv-role">${escapeHTML(p.role || '')}</div>
          <div class="cv-contact">${contactBits}</div>
        </div>
        <div class="cv-side">
          ${skillsHTML}
          ${eduHTML}
          ${projHTML}
        </div>
        <div class="cv-main">
          ${summaryHTML}
          ${expHTML}
        </div>
      `;
    } else {
      paper.innerHTML = `
        <div class="cv-header">
          <div class="cv-name">${escapeHTML(fullName)}</div>
          <div class="cv-role">${escapeHTML(p.role || '')}</div>
          <div class="cv-contact">${contactBits}</div>
        </div>
        ${summaryHTML}
        ${expHTML}
        ${skillsHTML}
        ${projHTML}
        ${eduHTML}
      `;
    }
  }

  /* ---------- Tabs & add buttons ---------- */
  function bindTabs() {
    const tabs = $$('.builder-tab');
    const sections = $$('.builder-section');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        sections.forEach(s => s.classList.toggle('active', s.id === 'tab-' + target));
      });
    });
  }

  function bindAddButtons() {
    const add = (id, fn) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', fn);
    };
    add('addExperience', () => {
      state.experience.push({ title: '', company: '', location: '', start: '', end: '', bullets: [''] });
      saveState(); renderExperience(); renderPreview();
    });
    add('addEducation', () => {
      state.education.push({ degree: '', school: '', start: '', end: '', details: '' });
      saveState(); renderEducation(); renderPreview();
    });
    add('addProject', () => {
      state.projects.push({ name: '', link: '', description: '' });
      saveState(); renderProjects(); renderPreview();
    });
  }

  function bindDownload() {
    const btn = document.getElementById('downloadBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const paper = document.getElementById('cvPaper');
      const name = [state.personal.firstName, state.personal.lastName].filter(Boolean).join('_') || 'resume';
      downloadHTML(paper, name + '_CV.html');
    });
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!confirm(I18n.t('builder.confirm.reset'))) return;
        localStorage.removeItem(STORAGE_KEY);
        state = defaultData();
        bindPersonal();
        renderExperience();
        renderEducation();
        renderProjects();
        renderSkills();
        renderTemplateSelector();
        renderPreview();
        Toast.show(I18n.t('builder.confirm.resetDone'));
      });
    }
  }

  function downloadHTML(node, filename) {
    const isRTL = I18n.isRTL();
    const inner = node.outerHTML;
    const fontLink = isRTL
      ? `<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">`
      : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
    const css = `
      <style>
        body { background: #fff; color: #0F172A; font-family: ${isRTL ? "'Cairo'" : "'Inter'"}, -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 24px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
        .cv-paper { width: 794px; max-width: 100%; background: white; color: #0F172A; padding: 48px 56px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin: 0 auto; font-size: 11px; line-height: 1.55; }
        .cv-paper .cv-header { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; border-bottom: 1px solid #E4E4E7; margin-bottom: 20px; }
        .cv-paper .cv-name { font-size: 24px; font-weight: 700; }
        .cv-paper .cv-role { font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
        .cv-paper .cv-contact { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; color: #475569; font-size: 10px; }
        .cv-paper .cv-contact span { display: inline-flex; align-items: center; gap: 4px; }
        .cv-paper .cv-section { margin-bottom: 18px; }
        .cv-paper .cv-section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--cv-accent, #2563EB); border-bottom: 1px solid #E4E4E7; padding-bottom: 4px; margin-bottom: 10px; }
        .cv-paper .cv-item { margin-bottom: 12px; }
        .cv-paper .cv-item-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .cv-paper .cv-item-title { font-weight: 600; font-size: 12px; }
        .cv-paper .cv-item-meta { color: #64748B; font-size: 10px; }
        .cv-paper .cv-item-sub { color: #475569; font-size: 11px; margin-bottom: 4px; }
        .cv-paper .cv-item-desc { color: #334155; font-size: 11px; }
        .cv-paper .cv-item-desc ul { padding-${isRTL ? 'right' : 'left'}: 16px; list-style: disc; margin-top: 4px; }
        .cv-paper .cv-item-desc li { margin-bottom: 2px; }
        .cv-paper .cv-skill { padding: 3px 8px; background: #F1F5F9; border-radius: 3px; font-size: 10px; color: #334155; border: 1px solid #E4E4E7; }
        .cv-paper .cv-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .cv-paper.two-col { display: grid; grid-template-columns: ${isRTL ? '2fr 1fr' : '1fr 2fr'}; gap: 24px; }
        .cv-paper.two-col .cv-header { grid-column: 1 / -1; }
        .cv-paper.two-col .cv-side, .cv-paper.two-col .cv-main { display: flex; flex-direction: column; gap: 18px; }
        svg { width: 12px; height: 12px; }
        @media print { body { padding: 0; } .cv-paper { box-shadow: none; padding: 32px; } }
      </style>
    `;
    const html = `<!doctype html><html lang="${I18n.getLang()}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${filename}</title>${fontLink}${css}</head><body>${inner}</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Toast.show(I18n.t('builder.confirm.downloaded'));
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
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function setPath(obj, path, val) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
    target[last] = val;
  }

  function getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  /* ---------- Init ---------- */
  async function init() {
    try {
      const data = await loadJSON('data/templates.json');
      templates = data.templates;
    } catch (e) {
      console.warn('Failed to load templates', e);
      return;
    }

    // Allow ?template= override
    const fromURL = getQueryParam('template');
    if (fromURL && templates.find(t => t.id === fromURL)) {
      state.template = fromURL;
      saveState();
    }

    bindPersonal();
    bindTabs();
    bindAddButtons();
    bindDownload();
    renderExperience();
    renderEducation();
    renderProjects();
    renderSkills();
    renderTemplateSelector();
    renderPreview();

    // On language change: re-render everything that depends on i18n.
    // If the current state still matches the OLD language's untouched sample,
    // swap it for the NEW language's sample so the user sees a fresh CV.
    document.addEventListener('langchange', (e) => {
      const prevLang = e.detail && e.detail.prev;
      const newLang = e.detail && e.detail.lang;
      if (prevLang && newLang && SAMPLE[prevLang] && stateMatchesSample(state, SAMPLE[prevLang])) {
        state = defaultData();
        saveState();
        bindPersonal();
      }
      renderExperience();
      renderEducation();
      renderProjects();
      renderSkills();
      renderTemplateSelector();
      renderPreview();
    });
  }

  /** Returns true if the given state is structurally identical to the sample
   *  (no user customisation has happened). */
  function stateMatchesSample(state, sample) {
    if (!state || !sample) return false;
    // Compare key sections loosely
    if ((state.personal.firstName || '') !== (sample.personal.firstName || '')) return false;
    if ((state.summary || '') !== (sample.summary || '')) return false;
    if (state.experience.length !== sample.experience.length) return false;
    if (state.education.length !== sample.education.length) return false;
    if (state.skills.length !== sample.skills.length) return false;
    if (state.projects.length !== sample.projects.length) return false;
    return true;
  }

  document.addEventListener('DOMContentLoaded', init);
  global.Builder = { getState: () => state, reset: () => { localStorage.removeItem(STORAGE_KEY); state = defaultData(); } };
})(window);
