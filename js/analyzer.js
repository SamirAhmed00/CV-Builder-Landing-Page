/* ==========================================================================
   CV Builder — Job Analyzer (Bilingual)
   Frontend keyword detection. Tech terms are universal (kept in English);
   UI labels use the active language.
   ========================================================================== */

(function (global) {
  'use strict';

  const { Toast } = global.CVApp || {};
  const I18n = global.CVI18n || { t: k => k, pick: v => (v && typeof v === 'object' ? (v.en || v.ar || '') : v), getLang: () => 'en', isRTL: () => false };

  // English skill dictionary — kept universal because tools/frameworks are
  // typically named in English even in Arabic job descriptions.
  const SKILL_DICTIONARY = {
    software: [
      'JavaScript','TypeScript','Python','Java','C#','Go','Rust','Ruby','PHP','Swift','Kotlin',
      'React','Vue','Angular','Next.js','Nuxt','Svelte','Redux','Node.js','Express','NestJS',
      'ASP.NET','ASP.NET Core','.NET','Entity Framework','EF Core','Django','Flask','Spring Boot',
      'SQL Server','PostgreSQL','MySQL','MongoDB','Redis','Elasticsearch','DynamoDB','SQLite',
      'AWS','Azure','GCP','Docker','Kubernetes','Terraform','Jenkins','GitHub Actions','CI/CD',
      'GraphQL','REST','REST APIs','gRPC','Microservices','Kafka','RabbitMQ',
      'Git','Linux','Jira','Agile','Scrum','TDD','Unit Testing',
      'iOS','Android','React Native','Flutter','SwiftUI','Jetpack Compose',
      'Tailwind','HTML','CSS','Sass','Webpack','Vite'
    ],
    design: [
      'Figma','Sketch','Adobe XD','Photoshop','Illustrator','After Effects','Premiere','Framer',
      'Webflow','InVision','Principle','Lottie','Miro',
      'UI Design','UX Design','UX Research','User Research','Design Systems','Wireframing','Prototyping',
      'Usability Testing','A/B Testing','Heuristic Evaluation','Information Architecture',
      'Interaction Design','Visual Design','Typography','Brand Design','Illustration'
    ],
    marketing: [
      'Google Ads','Meta Ads','Facebook Ads','Instagram Ads','TikTok Ads','LinkedIn Ads',
      'SEO','SEM','PPC','Programmatic','Display Advertising','Affiliate Marketing',
      'Email Marketing','Marketing Automation','HubSpot','Marketo','Mailchimp','Klaviyo',
      'Google Analytics','GA4','Mixpanel','Amplitude','Looker','Tableau',
      'A/B Testing','Conversion Optimization','CRO','Attribution','MMM',
      'ROAS','CAC','LTV','CTR','CPC','CPM','Funnel Optimization',
      'Content Marketing','Copywriting','Social Media','Influencer Marketing','Brand Strategy',
      'Figma','Canva','Notion','Asana'
    ],
    sales: [
      'Salesforce','HubSpot','Outreach','Salesloft','Gong','Chorus','Apollo','ZoomInfo','LinkedIn Sales Navigator',
      'MEDDIC','MEDDPICC','SPIN Selling','Challenger Sale','Solution Selling','Command of the Message',
      'Pipeline Management','Forecasting','Quota Attainment','Outbound','Inbound','Cold Calling',
      'Discovery','Objection Handling','Negotiation','Closing','Account Management',
      'B2B','B2C','SaaS','Enterprise Sales','Mid-Market','SMB',
      'RFP','Procurement','Contract Negotiation','Renewals','Upsell','Cross-sell',
      'CRM','Sales Operations','Revenue Operations','RevOps'
    ]
  };

  const TEMPLATE_BY_CATEGORY = {
    software: 'tech-resume',
    design: 'design-portfolio',
    marketing: 'marketing-edge',
    sales: 'sales-executor',
    general: 'modern-professional'
  };

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function detectCategory(text) {
    const lower = text.toLowerCase();
    const scores = { software: 0, design: 0, marketing: 0, sales: 0 };
    Object.entries(SKILL_DICTIONARY).forEach(([cat, skills]) => {
      skills.forEach(skill => {
        const re = new RegExp('\\b' + escapeRegExp(skill.toLowerCase()) + '\\b', 'g');
        const matches = lower.match(re);
        if (matches) scores[cat] += matches.length;
      });
    });
    const titleBoost = {
      software: /\b(developer|engineer|devops|backend|frontend|full[- ]?stack|mobile|software|sre|مطور|مهندس|برمجيات|باك|فرونت)\b/i,
      design: /\b(designer|design|ux|ui|product design|graphic|مصمم|تصميم)\b/i,
      marketing: /\b(marketing|marketer|media buyer|growth|seo|performance|cmo|تسويق|إعلانات|أداء)\b/i,
      sales: /\b(sales|account executive|business development|bdr|sdr|ae|am|مبيعات|حساب|تطوير أعمال)\b/i
    };
    Object.entries(titleBoost).forEach(([cat, re]) => {
      if (re.test(lower)) scores[cat] += 3;
    });
    let best = 'general';
    let bestScore = 0;
    Object.entries(scores).forEach(([cat, score]) => {
      if (score > bestScore) { bestScore = score; best = cat; }
    });
    return { category: best, scores };
  }

  function extractSkills(text) {
    const lower = text.toLowerCase();
    const matched = new Set();
    Object.values(SKILL_DICTIONARY).flat().forEach(skill => {
      const re = new RegExp('\\b' + escapeRegExp(skill.toLowerCase()) + '\\b');
      if (re.test(lower)) matched.add(skill);
    });
    return Array.from(matched);
  }

  function suggestMissing(text, category) {
    const lower = text.toLowerCase();
    const matched = extractSkills(text);
    const matchedSet = new Set(matched.map(s => s.toLowerCase()));
    const catalog = SKILL_DICTIONARY[category] || [];
    return catalog.filter(s => !matchedSet.has(s.toLowerCase())).slice(0, 6);
  }

  function findTemplate(templates, id) {
    return templates.find(t => t.id === id) || templates[0];
  }

  function categoryLabel(id) {
    // Try to read from loaded categories (if Templates module already loaded them).
    // Fall back to category id in lowercase.
    if (global.Templates && typeof global.Templates.getState === 'function') {
      const cat = global.Templates.getState().categories.find(c => c.id === id);
      if (cat) return I18n.pick(cat.name) || id;
    }
    // Last resort: a small static map
    const map = {
      software: { en: 'Software', ar: 'هندسة البرمجيات' },
      design:   { en: 'Design', ar: 'التصميم' },
      marketing:{ en: 'Marketing', ar: 'التسويق' },
      sales:    { en: 'Sales', ar: 'المبيعات' }
    };
    return (map[id] && (I18n.pick(map[id]) || id)) || id;
  }

  function renderResult(out, state) {
    const { matched, missing, category, scores, template } = state;
    const scoreEntries = Object.entries(scores).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const tplName = I18n.pick(template.name) || template.id;
    const tplStyle = I18n.pick(template.style) || '';
    const arrowIcon = I18n.isRTL() ? 'arrow-left' : 'arrow-right';

    out.innerHTML = `
      <div class="flex items-center gap-3" style="margin-bottom:var(--s-2);">
        <span class="eyebrow" style="color:var(--primary);">${I18n.t('analyzer.complete')}</span>
        <span class="badge badge-primary">${escapeHTML(categoryLabel(category))}</span>
      </div>
      <div class="analyzer-suggestion">
        <span class="lbl">${I18n.t('analyzer.recommended')}</span>
        <span class="val">${escapeHTML(tplName)}</span>
        <span class="text-subtle" style="font-size:0.8125rem;">${escapeHTML(tplStyle)} · ${template.atsScore}% ${I18n.t('analyzer.atsCompatible')}</span>
        <div style="margin-top:8px;display:flex;gap:8px;">
          <a class="btn btn-primary btn-sm" href="builder.html?template=${template.id}&role=${encodeURIComponent(category)}">
            ${I18n.t('analyzer.useTemplate')}
            <span data-icon="${arrowIcon}"></span>
          </a>
          <a class="btn btn-secondary btn-sm" href="templates.html?category=${category}">${I18n.t('analyzer.seeMore')}</a>
        </div>
      </div>
      <div class="analyzer-suggestion">
        <span class="lbl">${I18n.t('analyzer.detected')} (${matched.length})</span>
        <div class="skill-tags">
          ${matched.length ? matched.map(s => `<span class="skill-tag matched">${escapeHTML(s)}</span>`).join('') :
            `<span class="text-subtle" style="font-size:0.875rem;">${I18n.t('analyzer.noSkills')}</span>`}
        </div>
      </div>
      <div class="analyzer-suggestion">
        <span class="lbl">${I18n.t('analyzer.missing')}</span>
        <div class="skill-tags">
          ${missing.length ? missing.map(s => `<span class="skill-tag missing">${escapeHTML(s)}</span>`).join('') :
            `<span class="text-subtle" style="font-size:0.875rem;">${I18n.t('analyzer.comprehensive')}</span>`}
        </div>
      </div>
      ${scoreEntries.length > 1 ? `
        <div class="analyzer-suggestion">
          <span class="lbl">${I18n.t('analyzer.confidence')}</span>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${scoreEntries.map(([cat, score]) => {
              const max = Math.max(...Object.values(scores));
              const pct = Math.round((score / max) * 100);
              return `
                <div style="display:flex;align-items:center;gap:8px;font-size:0.875rem;">
                  <span style="width:84px;color:var(--text-muted);">${escapeHTML(categoryLabel(cat))}</span>
                  <div style="flex:1;height:6px;background:var(--bg-subtle);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));"></div>
                  </div>
                  <span class="text-subtle" style="width:24px;text-align:end;">${score}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    `;
    // Re-inject icons in newly rendered HTML
    out.querySelectorAll('[data-icon]').forEach(el => {
      el.innerHTML = global.CVApp.Icons.get(el.getAttribute('data-icon'));
    });
  }

  function renderEmpty(out) {
    out.innerHTML = `
      <div class="analyzer-empty">
        <span data-icon="sparkles"></span>
        <h4 style="color:var(--text);margin-bottom:6px;">${I18n.t('analyzer.emptyTitle')}</h4>
        <p style="font-size:0.9375rem;">${I18n.t('analyzer.emptyDesc')}</p>
      </div>
    `;
    out.querySelectorAll('[data-icon]').forEach(el => {
      el.innerHTML = global.CVApp.Icons.get(el.getAttribute('data-icon'));
    });
  }

  async function init() {
    const input = document.getElementById('jobInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleChips = document.querySelectorAll('[data-example]');
    const output = document.getElementById('analyzerOutput');
    if (!input || !output) return;

    // Apply i18n placeholders
    applyI18n();

    let templates = [];
    try {
      const data = await global.CVApp.loadJSON('data/templates.json');
      templates = data.templates;
    } catch (e) {
      console.warn('Could not load templates for analyzer', e);
    }

    function run() {
      const text = (input.value || '').trim();
      if (!text || text.length < 20) {
        Toast.show(I18n.t('analyzer.shortInput'));
        return;
      }
      const { category, scores } = detectCategory(text);
      const matched = extractSkills(text);
      const missing = suggestMissing(text, category);
      const tplId = TEMPLATE_BY_CATEGORY[category];
      const template = findTemplate(templates, tplId);
      renderResult(output, { category, scores, matched, missing, template });
    }

    analyzeBtn && analyzeBtn.addEventListener('click', run);
    clearBtn && clearBtn.addEventListener('click', () => {
      input.value = '';
      renderEmpty(output);
    });
    exampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.getAttribute('data-example');
        run();
      });
    });
    input.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
    });

    // Re-apply i18n on language change
    document.addEventListener('langchange', () => {
      applyI18n();
      // If the analyzer has a result, re-render it in the new language
      if (output.children.length && output.querySelector('.analyzer-suggestion')) {
        // Re-run with current input if any
        if (input.value.trim().length >= 20) run();
      }
    });
  }

  function applyI18n() {
    const input = document.getElementById('jobInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const output = document.getElementById('analyzerOutput');
    if (input) input.placeholder = I18n.t('analyzer.placeholder');
    if (analyzeBtn) analyzeBtn.innerHTML = `<span data-icon="sparkles"></span> ${I18n.t('analyzer.analyze')}`;
    if (clearBtn) clearBtn.textContent = I18n.t('analyzer.clear');
    // Re-inject icons for the button
    if (analyzeBtn) {
      analyzeBtn.querySelectorAll('[data-icon]').forEach(el => {
        el.innerHTML = global.CVApp.Icons.get(el.getAttribute('data-icon'));
      });
    }
    if (output) renderEmpty(output);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
